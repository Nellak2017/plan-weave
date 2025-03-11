import { TASK_EDITOR_WIDTH } from '../../../Core/utils/constants.js'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import { TaskTableDefault } from '../../molecules/TaskTable/TaskTable.js'
import Pagination from '../../molecules/Pagination/Pagination'
import { StyledTaskEditor, TaskEditorContainer } from './TaskEditor.elements'
import { useTaskEditor } from '../../../Application/hooks/TaskEditor/useTaskEditor.js'

const TaskEditor = ({ customHook = useTaskEditor }) => {
	const { currentTime, title } = customHook?.() || {}
	return (
		<TaskEditorContainer>
			<h1>{title}</h1>
			<StyledTaskEditor maxwidth={TASK_EDITOR_WIDTH}>
				<TaskControl currentTime={currentTime} />
				<TaskTableDefault currentTime={currentTime} />
				<Pagination />
			</StyledTaskEditor>
		</TaskEditorContainer>
	)
}
export default TaskEditor