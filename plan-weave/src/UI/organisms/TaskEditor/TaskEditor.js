import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useInterval } from '../../hooks/useInterval.js'
import { selectNonHiddenTasksCoerceToFull } from '../../../Application/redux/selectors.js'
import { FULL_TASK_HEADERS, VARIANTS, TASK_EDITOR_WIDTH } from '../../../Core/utils/constants.js'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import { TaskTableDefault } from '../../molecules/TaskTable/TaskTable.slots.js'
import Pagination from '../../molecules/Pagination/Pagination'
import { StyledTaskEditor, TaskEditorContainer } from './TaskEditor.elements'
import store from '../../../Application/store.js'
import { createTaskEditorServices } from '../../../Application/services/pages/PlanWeavePage/TaskEditorServices.js'

const TaskEditor = ({ services = createTaskEditorServices(store), variant = VARIANTS[0], title = "Today's Tasks" }) => {
	const [currentTime, setCurrentTime] = useState(new Date()) // Actual Time of day, Date object
	useInterval(() => setCurrentTime(new Date()), 33, [currentTime])
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