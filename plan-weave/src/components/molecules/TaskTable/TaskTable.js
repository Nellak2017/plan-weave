import { useState, useContext, useMemo, useEffect } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import TaskRow from '../TaskRow/TaskRow'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import 'react-toastify/dist/ReactToastify.css'
import { THEMES, DEFAULT_SIMPLE_TASKS, TASK_STATUSES } from '../../utils/constants'
import { TaskEditorContext } from '../../organisms/TaskEditor/TaskEditor.js'
import useValidateTasks from '../../../hooks/useValidateTasks.js'
import { isTimestampFromToday } from '../../utils/helpers'

import { pipe } from 'ramda'
/* 
 TODO: Fix the Full Task Schema (See Full Task TODO)

 TODO: Gray out, out of range completed tasks.
 TODO: Extract out validate tasks to it's own function / hook
 TODO: Check if tasks are old every so often using a useEffect hook or something
 TODO: Add Test Cases for 'isTimestampFromYesterday' function, and JS Docs too
*/
// TODO: Remove the .slice(startRange, endRange) and tasksPerPage, page in Production
const TaskTable = ({ variant = 'dark', headerLabels, tasks, maxwidth = 818 }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const { taskList, setTaskList, highlights, setHighlights, tasksPerPage, page } = !TaskEditorContext._currentValue ? { 1: 'example', 2: 'example' } : useContext(TaskEditorContext)
	const [localTasks, setLocalTasks] = useState(!tasks ? DEFAULT_SIMPLE_TASKS : tasks)

	const lastCompletedIndex = taskList?.findIndex(task => task.status !== TASK_STATUSES.COMPLETED) - 1
	const lastCompleted = lastCompletedIndex >= 0 ? taskList[lastCompletedIndex] : null // gives last completed task

	// --- Temporary Pagination Feature
	const [startRange, endRange] = useMemo(() => calculateRange(tasksPerPage, page))
	const [paginatedTaskList, setPaginatedTaskList] = useState(taskList.slice(startRange, endRange))
	function calculateRange(tasksPerPage, page) {
		// find the start, end indices given tasksPerPage and page number
		// For development use only, in prod, I will use Firebase query to solve this more elegantly
		if (Math.floor(tasksPerPage) !== tasksPerPage || Math.floor(page) !== page) return [0, undefined]
		return [(page - 1) * tasksPerPage + 1, page * tasksPerPage]
	}
	useEffect(() => {
		setPaginatedTaskList(taskList.slice(startRange, endRange))
	}, [tasksPerPage, page])

	// Validate tasks and correct invalid ones when the page loads in. DOES NOT EFFECT REDUX STORE, ONLY VIEW OF IT
	useValidateTasks({ taskList: (taskList ? taskList : tasks), callback: (setTaskList ? setTaskList : () => console.error('setTaskList not defined')) })

	// Modded to include the local tasks
	// --- Includes the Task Swapping Feature, keeping timestamps constant (View Only, no store updates)
	const onDragEnd = result => {
		if (!result.destination) return // Drag was canceled or dropped outside the list

		const shuffleTasks = (ordering, source = result.source.index, destination = result.destination.index, field = 'timestamp') => {
			const originalTimestampOrder = ordering.map(task => task[field])
			return pipe(
				ordering => ordering.filter((_, index) => index !== source),
				remainingTasks => [...remainingTasks.slice(0, destination), ordering[source], ...remainingTasks.slice(destination)],
				shuffledTasks => shuffledTasks.map((task, index) => ({ ...task, timestamp: originalTimestampOrder[index] }))
			)(ordering)
		}
		const ret = shuffleTasks(taskList ? taskList : localTasks)
		taskList ? setTaskList(ret) : setLocalTasks(ret)
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<TaskTableContainer maxwidth={maxwidth}>
				<table>
					<TableHeader variant={variant} labels={headerLabels} />
					<Droppable droppableId="taskTable" type="TASK">
						{provided => (
							<tbody ref={provided.innerRef} {...provided.droppableProps}>
								{taskList && taskList?.length >= 1 && paginatedTaskList?.map((task, idx) => (
									<TaskRow
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
										highlight={isTimestampFromToday(new Date(), task.timestamp) ? highlights[idx] : 'old'}
										lastCompletedTask={lastCompleted}
									/>)
								)}
								{!taskList && localTasks.length >= 1 && paginatedTaskList?.map((task, idx) => (
									<TaskRow
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
										highlight={isTimestampFromToday(new Date(), task.timestamp) ? highlights[idx] : 'old'}
										lastCompletedTask={lastCompleted}
									/>
								))
								}
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