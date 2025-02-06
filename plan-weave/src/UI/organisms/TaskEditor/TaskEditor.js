import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useInterval } from '../../hooks/useInterval.js'
import { selectNonHiddenTasksCoerceToFull } from '../../../Application/redux/selectors.js'
import { SIMPLE_TASK_HEADERS, FULL_TASK_HEADERS, VARIANTS } from '../../../Core/utils/constants.js'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import Pagination from '../../molecules/Pagination/Pagination'
import { StyledTaskEditor, TaskEditorContainer } from './TaskEditor.elements'
import store from '../../../Application/store.js'
import { createTaskEditorServices } from '../../../Application/services/pages/PlanWeavePage/TaskEditorServices.js'

const TaskEditor = ({ services = createTaskEditorServices(store), variant = VARIANTS[0], maxwidth = 818, title = "Today's Tasks" }) => {
	const [currentTime, setCurrentTime] = useState(new Date()) // Actual Time of day, Date object
	useInterval(() => setCurrentTime(new Date()), 33, [currentTime])

	// --- State Objects for Children
	const globalTasks = useSelector(state => state?.globalTasks)
	const taskList = useSelector(selectNonHiddenTasksCoerceToFull)
	const fullTask = useSelector(state => state?.taskEditor?.fullTask)
	const userId = useSelector(state => state?.taskEditor?.userId)
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
			fullTask,
			availableThreads: useSelector(state => state?.globalThreads?.threads),
			userId,
		},
	}
	return (
		<TaskEditorContainer variant={variant}>
			<h1>{title}</h1>
			<StyledTaskEditor variant={variant} maxwidth={maxwidth}>
				<TaskControl currentTime={currentTime} />
				<TaskTable
					services={{ ...services?.global, ...services?.taskTable, }}
					state={TaskTableState}
					variant={variant}
					headerLabels={fullTask ? FULL_TASK_HEADERS : SIMPLE_TASK_HEADERS}
					maxwidth={maxwidth}
				/>
				<Pagination />
			</StyledTaskEditor>
		</TaskEditorContainer>
	)
}
export default TaskEditor