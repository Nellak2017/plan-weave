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
	const { updateTasks } = { ...services }
	const { globalTasks, search, timeRange, page, tasksPerPage, taskList, sortingAlgo, owl, taskRowState } = { ...state }
	const start = useMemo(() => parseISO(timeRange?.start), [timeRange])

	const filteredTasks = useMemo(() => (search === search.trimRight())
		? filterTaskList({ list: taskList, filter: search.trim(), attribute: 'task' })
		: taskList, [taskList, search]) // covers: search changes (case: 5)

	// Local State
	const [startRange, endRange] = useMemo(() => calculateRange(tasksPerPage, page), [tasksPerPage, page])
	const [taskUpdated, setTaskUpdated] = useState(false) // Used to help the waste update every second feature. Ugly but it works

	// --- DnD Event, covers: DnD event (case: 4)
	const onDragEnd = result => {
		if (!result.destination) return // Drag was canceled or dropped outside the list
		const [source, destination] = [result.source.index, result.destination.index]
		updateTasks(rearrangeDnD(taskList, source, destination))
	}


	// Effects
	const transformList = start => [
		t => calculateWaste({ start, taskList: t, time: new Date() }) // Sorted => waste / eta applied correctly
	] // helper to get correct transformer list easily

	useEffect(() => {
		const rawTasks = globalTasks?.tasks
		const transformsAppliedTasks = completedOnTopSorted(
			rawTasks,
			rawTasks,
			start, 
			transformList(start),
			SORTING_METHODS[sortingAlgo]
		)
		updateTasks(transformsAppliedTasks) // Note that each eta is an ISO string, not a date
	}, [])

	const update = () => {
		const ret = calculateWaste({ start: start, taskList: taskList, time: new Date() })
		if (ret.length > 0) updateTasks(ret || taskList)
	}
	useEffect(() => update(), [timeRange, owl])
	useEffect(() => {
		if (taskUpdated) { update() }
		const interval = setInterval(() => { if (!taskUpdated) update() }, 500)
		return () => { if (interval) { clearInterval(interval); setTaskUpdated(false) } }
	}, [taskList]) // covers: waste update every 500ms (case: 6)

	/*
	
	useEffect(() => {
		if (!dnd || dnd.length === 0) return // dnd config should not be used unless you want bugs
		const [source, destination] = [taskTransition[0], taskTransition[1]]
		//setLocalTasks(rearrangeDnD(localTasks, source, destination))
		setTimeout(() => { updateDnDConfig(rearrangeDnD(dnd, source, destination)) }, 0)
	}, [taskTransition])

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
	*/

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<button onClick={() => console.log(taskList)}>Tasks</button>
			<button onClick={() => console.log(services)}>Services TaskTable</button>
			<TaskTableContainer maxwidth={maxwidth}>
				<table>
					<TableHeader variant={variant} labels={headerLabels} />
					<Droppable droppableId="taskTable" type="TASK">
						{provided => (
							<tbody ref={provided.innerRef} {...provided.droppableProps}>
								{todoList(services, taskRowState, filteredTasks, startRange, endRange, timeRange, variant)}
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