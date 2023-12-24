import { createContext, useState, useMemo, useContext } from 'react'
import { useSelector } from 'react-redux'
import { selectNonHiddenTasks } from '../../../redux/selectors'
import { THEMES, SIMPLE_TASK_HEADERS } from '../../utils/constants'
import { validateTasks, isInt, completedOnTopSorted } from '../../utils/helpers.js'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import Pagination from '../../molecules/Pagination/Pagination'
import { StyledTaskEditor, TaskEditorContainer } from './TaskEditor.elements'
import { parse } from 'date-fns'
import PropTypes from 'prop-types'

import store from '../../../redux/store.js'
import { createTaskEditorServices } from '../../../services/PlanWeavePage/TaskEditorServices'
import { ThemeContext } from 'styled-components' // needed for theme object
/*
	Easy: 	
		TODO: Add Test coverage to new helpers and extract all helper functions to helper.js
		
	Medium:
		TODO: Sort icons
		TODO: Fix the Dnd config not updating properly when multiple updates applied
		TODO: Fix the Dnd bug where dragging an item to somewhere then completing it will cause it to not go to top as expected (completed not on top error!)
		TODO: Refactor all functions to make use of Railway oriented design (for example the Maybe monad). Look at the validation helper
		TODO: Refactor the form in task row to be like formik (When you make Full Task)
		TODO: Completed Highlight bug. When it is the next day (owl on), and you swap a task using dnd to 1st completed and complete it, it displays as old instead of completed.
		
	Hard: 
		TODO: Solve the Pagination Problem (The one where you efficiently use pagination with memos and stuff)
		TODO: Solve the Refresh Problem (If you refresh, it alters components inline potentially harming Analytics. 
			  What should be done is sent tasks to store and hide them, then generate a copy based on old)

	Super Hard:
		TODO: Full Task Schema
*/
export const TaskEditorContext = createContext()
const TaskEditor = ({
	variant = 'dark',
	tasks = [],
	maxwidth = 818,
	startEndTimes = { 'start': parse('00:00', 'HH:mm', new Date()), 'end': parse('17:00', 'HH:mm', new Date()) },
	paginationOptions = { 'tasksPerPage': 10, 'page': 1 },
	title = "Today's Tasks"
}) => {
	// --- Input Verification
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const services = createTaskEditorServices(store)
	const reduxStore = useSelector(state => state?.taskEditor)
	// --- Tasks and TaskControl State needed for proper functioning of Features, Passed down in Context, some obtained from Redux Store

	// State for the Pagination feature
	const [tasksPerPage, setTasksPerPage] = useState(isInt(paginationOptions?.tasksPerPage) ? paginationOptions.tasksPerPage : 10)
	const [page, setPage] = useState(isInt(paginationOptions?.page) ? paginationOptions.page : 1) // default page #

	// Auto Calculation State
	const [timeRange, setTimeRange] = useState({ ...startEndTimes }) // starts off in possibly incorrect state, but TaskControl fixes it (to avoid races, and ensure integrity)
	const start = useMemo(() => timeRange['start'], [timeRange]) // destructure timerange, only start (we don't use end here)
	const [taskUpdated, setTaskUpdated] = useState(false) // Used to help the waste update every second feature. Ugly but it works

	// Task Data (Redux), Task View (Context), Searching, Sorting, DnD, and Algorithm Change State
	const tasksFromRedux = useSelector(selectNonHiddenTasks) // useValidateTasks() causes issues for some reason
	const [taskList, setTaskList] = useState(validateTasks({ taskList: completedOnTopSorted(tasksFromRedux, tasks, start) }))

	// --- State Objects for Children

	const globalTasks = useSelector(state => state?.globalTasks)

	// State for TaskControl
	const TaskControlState = {
		globalTasks,
		timeRange: useSelector(state => state?.taskEditor?.timeRange),
		owl: useSelector(state => state?.taskEditor?.owl),
		isHighlighting: useSelector(state => state?.taskEditor?.highlighting),
		taskList: useSelector(selectNonHiddenTasks),
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
		taskList: useSelector(selectNonHiddenTasks),
		sortingAlgo: useSelector(state => state?.taskEditor?.sortingAlgo),
		owl: useSelector(state => state?.taskEditor?.owl),
		taskTransition: useSelector(state => state?.taskEditor?.taskTransition),
		taskRowState: {
			isHighlighting: useSelector(state => state?.taskEditor?.highlighting),
			selectedTasks: useSelector(state => state?.taskEditor?.selectedTasks),
		}
	}

	// Memo for context
	const memoizedContext = useMemo(() => ({
		taskList, setTaskList, timeRange, setTimeRange,
		taskUpdated, setTaskUpdated,
		tasksPerPage, page
	}), [
		taskList, setTaskList, timeRange, setTimeRange,
		taskUpdated, setTaskUpdated,
		tasksPerPage, page
	])

	return (
		<TaskEditorContext.Provider value={memoizedContext}>
			<button onClick={() => {
				console.log(taskList)
			}}>Show Task View</button>
			<button onClick={() => {
				console.log(tasksFromRedux)
			}}>Show Redux Store tasks only</button>
			<button onClick={() => {
				console.log(reduxStore)
			}}>Show whole redux store</button>
			<button onClick={() => {
				console.log(globalTasks)
			}}>Show global tasks</button>
			<button onClick={() => { console.log(`page: ${page}, tasks per page: ${tasksPerPage}`) }}>Show Page Number</button>
			<button onClick={() => console.log(`start: ${timeRange['start']}\nend: ${timeRange['end']}`)}>Show timerange</button>
			<button onClick={() => console.log(`start: ${start}`)}>Show memoized start</button>

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
						variant={variant}
						total={taskList?.length}
						onTasksPerPageChange={setTasksPerPage}
						onPageChange={setPage}
					/>
				</StyledTaskEditor>
			</TaskEditorContainer>
		</TaskEditorContext.Provider>
	)
}

TaskEditor.propTypes = {
	options: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		listener: PropTypes.func.isRequired,
		algorithm: PropTypes.string.isRequired,
	})).isRequired
}

export default TaskEditor