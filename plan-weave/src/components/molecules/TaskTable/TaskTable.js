import { useMemo, useState, useEffect, useCallback } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import 'react-toastify/dist/ReactToastify.css'
import { THEMES, TASK_STATUSES, SORTING_METHODS } from '../../utils/constants'
import { filterTaskList, rearrangeDnD, completedOnTopSorted } from '../../utils/helpers'
import { transform, calculateWaste, calculateRange } from '../../utils/helpers.js'
import { parseISO } from 'date-fns'
import { todoList } from './TodoList.js'
/*
	Intended Features:

	1. Initially, Redux Tasks -> Local tasks = Redux Tasks(sort, dnd config == [0,...,n], waste/eta) 
	2. Redux Tasks change -> Local tasks = Redux Tasks(sort, dnd config, waste/eta)
	3. Sorting Algo changes -> Local tasks = Redux Tasks(sort, dnd config == [0,...,n], waste/eta)
	4. Dnd event -> Local tasks = transform(Local Tasks, dnd list)
	5. Search changes -> displayed tasks are Local Tasks, but filtered using search as filter (must be memoized)
	6. Every 50ms, waste should be updated

	Notes: Completed must always be on top, regardless of sorting method
*/
// services: updateDnDConfig 
// state: dndConfig, search
const TaskTable = ({
	services,
	state,
	variant = 'dark',
	headerLabels,
	maxwidth = 818
}) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	// Services and State (destructured)
	const { updateDnDConfig } = { ...services }
	const { globalTasks, search, dnd, timeRange, page, tasksPerPage, taskList, sortingAlgo, owl, taskTransition, taskRowState } = { ...state }
	const start = useMemo(() => parseISO(timeRange?.start), [timeRange])

	// Local State
	const [localTasks, setLocalTasks] = useState(taskList)
	const [startRange, endRange] = useMemo(() => calculateRange(tasksPerPage, page), [tasksPerPage, page])
	const [taskUpdated, setTaskUpdated] = useState(false) // Used to help the waste update every second feature. Ugly but it works

	const lastCompletedIndex = useMemo(
		() => taskList?.findIndex(task => task.status !== TASK_STATUSES.COMPLETED) - 1,
		[taskList])

	const lastCompleted = useMemo(
		() => lastCompletedIndex >= 0 ? taskList[lastCompletedIndex] : null,
		[lastCompletedIndex]) // gives last completed task

	const filteredTasks = useMemo(() => (search === search.trimRight())
		? filterTaskList({ list: localTasks, filter: search.trim(), attribute: 'task' })
		: localTasks, [localTasks, taskList, search]) // covers: search changes (case: 5)

	// --- DnD Event, covers: DnD event (case: 4)
	const onDragEnd = result => {
		if (!result.destination) return // Drag was canceled or dropped outside the list
		const [source, destination] = [result.source.index, result.destination.index]
		setLocalTasks(rearrangeDnD(localTasks, source, destination))
		setTimeout(() => { updateDnDConfig(rearrangeDnD(dnd, source, destination)) }, 0)
	}

	useEffect(() => {
		if (!dnd || dnd.length === 0) return // dnd config should not be used unless you want bugs
		const [source, destination] = [taskTransition[0], taskTransition[1]]
		//setLocalTasks(rearrangeDnD(localTasks, source, destination))
		setTimeout(() => { updateDnDConfig(rearrangeDnD(dnd, source, destination)) }, 0)
	}, [taskTransition])

	// Effects
	const transformList = dnd => [
		t => transform(t, dnd), // [...completed, ...incomplete] => dnd applied correctly 
		t => calculateWaste({ start, taskList: t, time: new Date() }) // dnd applied correctly => waste / eta applied correctly
	] // helper to get correct transformer list easily

	useEffect(() => {
		const correctedDnd = dnd?.length > 0 ? dnd : taskList.map((_, i) => i) // to prevent dnd from being empty in any case
		setLocalTasks(completedOnTopSorted(
			taskList,
			taskList,
			start,
			transformList(correctedDnd)
		))
		console.log('taskList')
	}, [taskList])

	useEffect(() => {
		const resetDnD = taskList.map((_, i) => i)
		updateDnDConfig(resetDnD)
		setLocalTasks(completedOnTopSorted(
			taskList,
			taskList,
			start,
			transformList(resetDnD)
		))
	}, [sortingAlgo])

	// --- ETA + Waste Auto Calculation Feature
	/*
	const update = () => setLocalTasks(old => calculateWaste({ start: start, taskList: old, time: new Date() }) || old)
	useEffect(() => update(), [timeRange, start, owl, dnd, taskTransition])
	useEffect(() => {
		if (taskUpdated) { update() }
		const interval = setInterval(() => { if (!taskUpdated) update() }, 5000) // 50
		return () => { if (interval) { clearInterval(interval); setTaskUpdated(false) } }
	}, [taskList, localTasks]) // covers: waste update every 50ms (case: 6)
	*/

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<button onClick={() => console.log(localTasks)}>Tasks</button>
			<button onClick={() => console.log(services)}>Services TaskTable</button>
			<TaskTableContainer maxwidth={maxwidth}>
				<table>
					<TableHeader variant={variant} labels={headerLabels} />
					<Droppable droppableId="taskTable" type="TASK">
						{provided => (
							<tbody ref={provided.innerRef} {...provided.droppableProps}>
								{todoList(services, taskRowState, filteredTasks, startRange, endRange, lastCompleted, timeRange, variant)}
								{provided.placeholder}
							</tbody>
						)}
					</Droppable>
				</table>
			</TaskTableContainer>
		</DragDropContext>
	)
}
export default TaskTable