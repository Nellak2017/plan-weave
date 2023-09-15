import { useState, useContext, useMemo } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import TaskRow from '../TaskRow/TaskRow'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import 'react-toastify/dist/ReactToastify.css'
import { THEMES, TASK_STATUSES } from '../../utils/constants'
import { TaskEditorContext } from '../../organisms/TaskEditor/TaskEditor.js'
import { isTimestampFromToday, filterTaskList, rearrangeDnD } from '../../utils/helpers'

/* 
 TODO: Fix the Full Task Schema (See Full Task TODO)
*/
const TaskTable = ({ variant = 'dark', headerLabels, tasks, maxwidth = 818 }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const { taskList, setTaskList, tasksPerPage, page, search, dnd, setDnd, timeRange } = useContext(TaskEditorContext)
	const [localTasks, setLocalTasks] = useState(tasks)

	const lastCompletedIndex = taskList?.findIndex(task => task.status !== TASK_STATUSES.COMPLETED) - 1
	const lastCompleted = lastCompletedIndex >= 0 ? taskList[lastCompletedIndex] : null // gives last completed task

	// --- Temporary Pagination Feature
	const calculateRange = (tasksPerPage, page) => (Math.floor(tasksPerPage) !== tasksPerPage || Math.floor(page) !== page) ? [0, undefined] : [(page - 1) * tasksPerPage + 1, page * tasksPerPage]
	const [startRange, endRange] = useMemo(() => calculateRange(tasksPerPage, page), [tasksPerPage, page])

	// --- Search Feature (pure version where eta and waste are constants)
	const filteredTasks = useMemo(() => (search === search.trimRight())
		? filterTaskList({ list: taskList, filter: search.trim(), attribute: 'task' }) : taskList, [taskList, search])

	// --- DnD Feature (DnD in context so config can be applied between renders)
	const onDragEnd = result => {
		if (!result.destination) return // Drag was canceled or dropped outside the list

		// Set the config so that next time we get the tasks from the store, we can place it properly
		setDnd(rearrangeDnD(dnd, result.source.index, result.destination.index))

		// It is not enough to set dnd config, we must setTasks too. If we do this and make a re-render it is inefficient and will flicker the UI
		setTaskList(rearrangeDnD(taskList, result.source.index, result.destination.index))
	}

	// --- Extracted view logic
	const todoList = (taskList, startRange, endRange, lastCompleted, timeRange) => {
		if (!taskList) return []

		const { start, end } = { ...timeRange } ? { ...timeRange } : { 0: new Date(new Date().setHours(0, 0, 0, 0)), 1: new Date(new Date().setHours(24, 59, 59, 59)) }

		const epochDiff = (end - start) / 1000 // seconds between end and start
		const epochTimeSinceStart = (start.getTime() - new Date(start).setHours(0, 0, 0, 0)) / 1000 // seconds between 00:00 and start
		const epochTotal = epochDiff >= 0 ? epochDiff + epochTimeSinceStart : epochTimeSinceStart // seconds in our modified day. If negative, then default to full day

		// startRange, endRange is for pagination capabilities
		return taskList?.slice(startRange - 1, endRange)?.map((task, idx) => {
			const epochETA = task?.eta?.getTime() / 1000
			const highlightOld = isTimestampFromToday(start, epochETA, epochTotal) ? ' ' : 'old'
			return <TaskRow
				key={`task-${task.id}`}
				variant={variant}
				taskObject={{
					task: task.task,
					waste: task.waste,
					ttc: task.ttc,
					eta: task.eta,
					id: task.id,
					status: task.status,
					timestamp: task.timestamp,
				}}
				index={idx}
				highlight={highlightOld}
				lastCompletedTask={lastCompleted}
			/>
		})
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<TaskTableContainer maxwidth={maxwidth}>
				<table>
					<TableHeader variant={variant} labels={headerLabels} />
					<Droppable droppableId="taskTable" type="TASK">
						{provided => (
							<tbody ref={provided.innerRef} {...provided.droppableProps}>
								{taskList && taskList?.length >= 1
									? todoList(filteredTasks, startRange, endRange, lastCompleted, timeRange)
									: todoList(localTasks, startRange, endRange, lastCompleted, timeRange)}
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