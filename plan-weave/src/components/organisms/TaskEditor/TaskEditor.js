import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { selectNonHiddenTasks } from '../../../redux/selectors'
import { THEMES, SIMPLE_TASK_HEADERS } from '../../utils/constants'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import Pagination from '../../molecules/Pagination/Pagination'
import { StyledTaskEditor, TaskEditorContainer } from './TaskEditor.elements'
import PropTypes from 'prop-types'
import store from '../../../redux/store.js'
import { createTaskEditorServices } from '../../../services/PlanWeavePage/TaskEditorServices'
import { ThemeContext } from 'styled-components' // needed for theme object

const TaskEditor = ({
	services = createTaskEditorServices(store),
	variant = 'dark',
	maxwidth = 818,
	title = "Today's Tasks"
}) => {
	// --- Input Verification
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	// --- State Objects for Children
	const globalTasks = useSelector(state => state?.globalTasks)
	const taskList = useSelector(selectNonHiddenTasks)

	// State for TaskControl
	const TaskControlState = {
		globalTasks,
		timeRange: useSelector(state => state?.taskEditor?.timeRange),
		owl: useSelector(state => state?.taskEditor?.owl),
		isHighlighting: useSelector(state => state?.taskEditor?.highlighting),
		taskList,
		selectedTasks: useSelector(state => state?.taskEditor?.selectedTasks),
		theme: useContext(ThemeContext),
	}

	// State for TaskTable 
	const TaskTableState = {
		globalTasks,
		search: useSelector(state => state?.taskEditor?.search),
		dnd: useSelector(state => state?.taskEditor?.dndConfig),
		timeRange: useSelector(state => state?.taskEditor?.timeRange),
		page: useSelector(state => state?.taskEditor?.page),
		tasksPerPage: useSelector(state => state?.taskEditor?.tasksPerPage),
		taskList,
		sortingAlgo: useSelector(state => state?.taskEditor?.sortingAlgo),
		owl: useSelector(state => state?.taskEditor?.owl),
		taskTransition: useSelector(state => state?.taskEditor?.taskTransition),
		taskRowState: {
			isHighlighting: useSelector(state => state?.taskEditor?.highlighting),
			selectedTasks: useSelector(state => state?.taskEditor?.selectedTasks),
		}
	}

	// State for Pagination
	const PaginationState = {
		globalTasks,
		taskList,
		pageNumber: useSelector(state => state?.taskEditor?.page),
		tasksPerPage: useSelector(state => state?.taskEditor?.tasksPerPage),
		timeRange: useSelector(state => state?.taskEditor?.timeRange),
	}

	return (
		<TaskEditorContainer variant={variant}>
			<h1>{title}</h1>
			<StyledTaskEditor variant={variant} maxwidth={maxwidth}>
				<TaskControl
					services={{
						...services?.global,
						...services?.taskControl,
					}}
					state={TaskControlState}
					variant={variant}
					clock1Text={''}
					clock2Text={''}
				/>
				<TaskTable
					services={{
						...services?.global,
						...services?.taskTable,
					}}
					state={TaskTableState}
					variant={variant}
					headerLabels={SIMPLE_TASK_HEADERS}
					maxwidth={maxwidth}
				/>
				<Pagination
					services={{
						...services?.global,
						...services?.pagination,
					}}
					state={PaginationState}
					variant={variant}
				/>
			</StyledTaskEditor>
		</TaskEditorContainer>
	)
}
TaskEditor.propTypes = {
	services: PropTypes.shape({
		global: PropTypes.shape({
			updateDnD: PropTypes.func.isRequired,
			updateSelectedTasks: PropTypes.func.isRequired,
			updateTasks: PropTypes.func.isRequired,
			timeRange: PropTypes.func.isRequired,
		}).isRequired,
		taskControl: PropTypes.shape({
			search: PropTypes.func.isRequired,
			owl: PropTypes.func.isRequired,
			highlighting: PropTypes.func.isRequired,
			addTask: PropTypes.func.isRequired,
			deleteMany: PropTypes.func.isRequired,
			sort: PropTypes.func.isRequired,
		}).isRequired,
		taskTable: PropTypes.shape({
			taskRow: PropTypes.shape({
				complete: PropTypes.func.isRequired,
				delete: PropTypes.func.isRequired,
				update: PropTypes.func.isRequired,
			}).isRequired,
		}).isRequired,
		pagination: PropTypes.shape({
			updatePage: PropTypes.func.isRequired,
			prevPage: PropTypes.func.isRequired,
			nextPage: PropTypes.func.isRequired,
			refresh: PropTypes.func.isRequired,
			tasksPerPageUpdate: PropTypes.func.isRequired,
		}).isRequired,
	}),
	variant: PropTypes.string,
	maxwidth: PropTypes.number,
	title: PropTypes.string,
}

export default TaskEditor