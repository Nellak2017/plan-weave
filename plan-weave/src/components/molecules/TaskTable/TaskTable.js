import { useState, useEffect, useContext } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import TaskRow from '../TaskRow/TaskRow'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { pureTaskAttributeUpdate } from '../../utils/helpers'
import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../../schemas/simpleTaskSchema/simpleTaskSchema'
import { THEMES } from '../../utils/constants'

import { addNewTask } from '../../../redux/thunks/taskThunks'
import { useDispatch, useSelector } from 'react-redux'

import { TaskEditorContext } from '../../organisms/TaskEditor/TaskEditor.js'

/* 
 TODO: Fix the Full Task Schema (See Full Task TODO)

 TODO: Gray out, out of range completed tasks.
 TODO: Disable everything for completed tasks, except the checkbox and dnd and delete button.
 TODO: All Completed tasks must have a checkmark beside them. 
	   Do this on page load and everytime the checkmarks change.
 TODO: Set the status of a task to completed if checkmark is pressed
 TODO: Extract out validate tasks to it's own function / hook
 TODO: Extract out certain functions to helpers to be tested etc
 TODO: Check if tasks are old every so often using a useEffect hook or something
*/

const TaskTable = ({ variant = 'dark', headerLabels, tasks, maxwidth = 818, useContextData = true }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const { taskList, setTaskList } = useContext(TaskEditorContext)

	const dispatch = useDispatch()

	// Validate tasks and correct invalid ones when the page loads in
	useEffect(() => {
		// Note you can't use the handleTaskAttributeUpdate in a loop, hence DRY violations here
		const validateTasks = async () => {
			if (taskList) {
				const updatedTaskList = [...taskList]
				for (let idx of Object.keys(taskList)) {
					try {
						const updatedTask = await pureTaskAttributeUpdate({
							index: idx,
							attribute: 'id',
							value: taskList[idx]['id'],
							taskList,
							schema: simpleTaskSchema,
							schemaDefaultFx: fillDefaultsForSimpleTask
						})
						updatedTaskList[idx] = updatedTask[idx]
					} catch (updateError) {
						console.error(updateError.message)
						toast.error('Your Tasks are messed up and things might not display right. Check Dev Tools for more info.')
					}
				}
				setTaskList(updatedTaskList)
			}
		}
		validateTasks()
	}, [])

	const handleTaskAttributeUpdate = async (index, attribute, value, taskList) => {
		try {
			const updatedTaskList = await pureTaskAttributeUpdate({ index, attribute, value, taskList, schema: simpleTaskSchema, schemaDefaultFx: fillDefaultsForSimpleTask })
			setTaskList(updatedTaskList)
		} catch (updateError) {
			console.error(updateError.message)
			toast.error('Your Tasks are messed up and things might not display right. Check Dev Tools for more info.')
		}
		//onTasksUpdate(updatedTaskList) // Notify parent about the change
	}

	const onDragEnd = result => {
		if (!result.destination) return // Drag was canceled or dropped outside the list
		const newTaskList = Array.from(taskList)
		const [movedTask] = newTaskList.splice(result.source.index, 1)
		newTaskList.splice(result.destination.index, 0, movedTask)
		setTaskList(newTaskList)
	}

	// today is a Date, timestamp is a number of seconds
	// returns true if timestamp is from yesterday, false otherwise
	function isTimestampFromYesterday(today, timestamp) {
		// Seconds since start of today
		const todayToSeconds = today.getTime()/1000
		const seconds = Math.floor((today.getTime() - today.setHours(0, 0, 0, 0)) / 1000)

		// If seconds since start of today < today - timestamp, then it is from yesterday
		return seconds < (todayToSeconds - timestamp)
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<TaskTableContainer maxwidth={maxwidth}>
				<table>
					<TableHeader variant={variant} labels={headerLabels} />
					<Droppable droppableId="taskTable" type="TASK">
						{provided => (
							<tbody ref={provided.innerRef} {...provided.droppableProps}>
								{taskList && taskList.length >= 1 && taskList?.map((task, idx) => (
									<TaskRow
										key={`task-${task.id}`}
										variant={variant}
										task={task.task}
										waste={task.waste}
										ttc={task.ttc}
										eta={task.eta}
										id={task.id}
										status={task.status}
										index={idx}
										timestamp={task.timestamp}
										old={isTimestampFromYesterday(new Date(), task.timestamp) ? 'old' : ''}
									/>)
								)}
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