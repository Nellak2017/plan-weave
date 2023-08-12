import { useState } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import TaskRow from '../TaskRow/TaskRow'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { pureTaskAttributeUpdate } from '../../utils/helpers'
import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../../schemas/simpleTaskSchema/simpleTaskSchema'

/* 
 TODO: Add a parent to pass down props to this
 TODO: Verify that prop drilling works
*/

const TaskTable = ({ variant, headerLabels, tasks, maxwidth = 818, onTasksUpdate }) => {
	const [taskList, setTaskList] = useState(tasks)

	const handleTaskAttributeUpdate = async (index = 1, attribute = 'waste', value = 4, taskList) => {
		try {
			const updatedTaskList = await pureTaskAttributeUpdate(index, attribute, value, taskList, simpleTaskSchema, fillDefaultsForSimpleTask)
			setTaskList(updatedTaskList)
		} catch (updateError) {
			console.error(updateError.message)
			toast.error('Your Tasks are messed up and things might not display right. Check Dev Tools for more info.')
		}
		//onTasksUpdate(updatedTaskList) // Notify parent about the change
	}
	const onDragEnd = (result) => {
		if (!result.destination) {
			return // Drag was canceled or dropped outside the list
		}
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
						{(provided) => (
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
										index={idx} />
								))}
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