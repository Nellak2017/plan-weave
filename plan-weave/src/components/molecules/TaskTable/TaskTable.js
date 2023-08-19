import { useState, useContext } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import TaskRow from '../TaskRow/TaskRow'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import 'react-toastify/dist/ReactToastify.css'
import { THEMES, DEFAULT_SIMPLE_TASKS } from '../../utils/constants'

import { TaskEditorContext } from '../../organisms/TaskEditor/TaskEditor.js'

import useValidateTasks from '../../../hooks/useValidateTasks.js'
import { isTimestampFromToday, pureTaskAttributeUpdate } from '../../utils/helpers'
/* 
 TODO: Fix the Full Task Schema (See Full Task TODO)

 TODO: Gray out, out of range completed tasks.
 TODO: Extract out validate tasks to it's own function / hook
 TODO: Check if tasks are old every so often using a useEffect hook or something
 TODO: Add Test Cases for 'isTimestampFromYesterday' function, and JS Docs too
*/

const TaskTable = ({ variant = 'dark', headerLabels, tasks, maxwidth = 818 }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const { taskList, setTaskList, highlights, setHighlights } = !TaskEditorContext._currentValue ? { 1: 'example', 2: 'example' } : useContext(TaskEditorContext)
	const [localTasks, setLocalTasks] = useState(!tasks ? DEFAULT_SIMPLE_TASKS : tasks)

	// Validate tasks and correct invalid ones when the page loads in. DOES NOT EFFECT REDUX STORE, ONLY VIEW OF IT
	useValidateTasks({taskList, callback:setTaskList})

	// Modded to include the local tasks
	const onDragEnd = result => {
		if (!result.destination) return // Drag was canceled or dropped outside the list
		const newTaskList = Array.from(taskList ? taskList : localTasks)
		const [movedTask] = newTaskList.splice(result.source.index, 1)
		newTaskList.splice(result.destination.index, 0, movedTask)
		taskList ? setTaskList(newTaskList) : setLocalTasks(newTaskList)
	}
	
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<TaskTableContainer maxwidth={maxwidth}>
				<table>
					<TableHeader variant={variant} labels={headerLabels} />
					<Droppable droppableId="taskTable" type="TASK">
						{provided => (
							<tbody ref={provided.innerRef} {...provided.droppableProps}>
								{taskList && taskList?.length >= 1 && taskList?.map((task, idx) => (
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
									/>)
								)}
								{!taskList && localTasks.length >= 1 && localTasks?.map((task, idx) => (
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