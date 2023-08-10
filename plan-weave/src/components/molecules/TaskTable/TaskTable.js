import React from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import TaskRow from '../TaskRow/TaskRow'
import { TaskTableContainer } from './TaskTable.elements'

const TaskTable = ({ variant, headerLabels, tasks }) => {
	return (
		<TaskTableContainer>
			<table>
				<TableHeader variant={variant} labels={headerLabels} />
				{tasks.map((task, index) => (
					<TaskRow
						key={index}
						variant={variant}
						task={task.task}
						waste={task.waste}
						ttc={task.ttc}
						eta={task.eta}
					/>
				))}
			</table>
		</TaskTableContainer>
	)
}
export default TaskTable