import { useState } from 'react'
import { useInterval } from '../../hooks/useInterval.js'
import { VARIANTS, TASK_EDITOR_WIDTH } from '../../../Core/utils/constants.js'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import { TaskTableDefault } from '../../molecules/TaskTable/TaskTable.js'
import Pagination from '../../molecules/Pagination/Pagination'
import { StyledTaskEditor, TaskEditorContainer } from './TaskEditor.elements'

const TaskEditor = ({ customHook }) => {
	const [currentTime, setCurrentTime] = useState(new Date()) // Actual Time of day, Date object
	useInterval(() => setCurrentTime(new Date()), 33, [currentTime])
	const variant = VARIANTS[0] // TODO: use hook instead
	const title = "Today's Tasks" // TODO: use hook instead
	return (
		<TaskEditorContainer variant={variant}>
			<h1>{title}</h1>
			<StyledTaskEditor variant={variant} maxwidth={TASK_EDITOR_WIDTH}>
				<TaskControl currentTime={currentTime} />
				<TaskTableDefault currentTime={currentTime} />
				<Pagination />
			</StyledTaskEditor>
		</TaskEditorContainer>
	)
}
export default TaskEditor