import { useState } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import TaskRow from '../TaskRow/TaskRow'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

const TaskTable = ({ variant, headerLabels, tasks, maxwidth = 818 }) => {
	const [taskList, setTaskList] = useState(tasks)
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