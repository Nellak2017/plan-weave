import { useState, useEffect } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import TaskRow from '../TaskRow/TaskRow'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { pureTaskAttributeUpdate } from '../../utils/helpers'
import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../../schemas/simpleTaskSchema/simpleTaskSchema'
import { THEMES } from '../../utils/constants'

/* 
 TODO: Add a parent to pass down props to this
 TODO: Verify that prop drilling works

 TODO: Fix the Full Task Schema (See Full Task TODO)

 TODO: Gray out, out of range completed tasks.
 TODO: Disable everything for completed tasks, except the checkbox and dnd and delete button.
 TODO: All Completed tasks must have a checkmark beside them. 
	   Do this on page load and everytime the checkmarks change.
 TODO: Set the status of a task to completed if checkmark is pressed
 TODO: Add a TimeStamp to the Schema for tasks, it is necessary for purging old, graying out old, etc.
*/

const TaskTable = ({ variant = 'dark', headerLabels, tasks, maxwidth = 818, onTasksUpdate }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const [taskList, setTaskList] = useState(tasks)

	// Validate tasks and correct invalid ones when the page loads in
	useEffect(() => {
		// Note you can't use the handleTaskAttributeUpdate in a loop, hence DRY violations here
		const validateTasks = async () => {
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
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<TaskTableContainer maxwidth={maxwidth}>
				<button onClick={() => console.log(taskList)}>Test</button>
				<button onClick={() => handleTaskAttributeUpdate(1, 'waste', 4, taskList)}>task attrib update</button>
				<table>
					<TableHeader variant={variant} labels={headerLabels} />
					<Droppable droppableId="taskTable" type="TASK">
						{provided => (
							<tbody ref={provided.innerRef} {...provided.droppableProps}>
								{taskList.map((task, idx) => (
									<TaskRow
										key={`task-${task.id}`}
										variant={variant}
										task={task.task}
										waste={task.waste}
										ttc={task.ttc}
										eta={task.eta}
										id={task.id}
										status={task.status}
										index={idx} />)
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