import { createContext, useState, useMemo, useContext } from 'react'
import { useSelector } from 'react-redux'
import { selectNonHiddenTasks } from '../../../redux/selectors'
import { THEMES, SIMPLE_TASK_HEADERS } from '../../utils/constants'
import { isInt } from '../../utils/helpers.js'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import Pagination from '../../molecules/Pagination/Pagination'
import { StyledTaskEditor, TaskEditorContainer } from './TaskEditor.elements'
import PropTypes from 'prop-types'

import store from '../../../redux/store.js'
import { createTaskEditorServices } from '../../../services/PlanWeavePage/TaskEditorServices'
import { ThemeContext } from 'styled-components' // needed for theme object
/*
	Easy: 	
		TODO: Validate incoming local tasks with schema: validateTasks({ taskList: completedOnTopSorted(tasksFromRedux, tasks, start) })
		TODO: Add Test coverage to new helpers and extract all helper functions to helper.js
		TODO: Fine tune the spacing of the row items to make it more natural. Especially the icons.

	Medium:
		TODO: Refator CompletedTimestamp to be an ISO String (Including all changes in code base)
		TODO: Add Schema prop for TaskRow so that it can handle the Full Task
		TODO: Sort icons
		
	Hard: 
		TODO: Solve the Pagination Problem (The one where you efficiently use pagination with memos and stuff)
		TODO: Solve the Refresh Problem (If you refresh, it alters components inline potentially harming Analytics. 
			  What should be done is sent tasks to store and hide them, then generate a copy based on old)
		TODO: Full Task Schema + Tests

*/
export const TaskEditorContext = createContext()
const TaskEditor = ({
	services = createTaskEditorServices(store),
	variant = 'dark',
	maxwidth = 818,
	paginationOptions = { 'tasksPerPage': 10, 'page': 1 },
	title = "Today's Tasks"
}) => {
	// --- Input Verification
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	// State for the Pagination feature
	const [tasksPerPage, setTasksPerPage] = useState(isInt(paginationOptions?.tasksPerPage) ? paginationOptions.tasksPerPage : 10)
	const [page, setPage] = useState(isInt(paginationOptions?.page) ? paginationOptions.page : 1) // default page #

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

	// Memo for context
	const memoizedContext = useMemo(() => ({
		tasksPerPage, page
	}), [
		tasksPerPage, page
	])

	return (
		<TaskEditorContext.Provider value={memoizedContext}>
			<button onClick={() => { console.log(`page: ${page}, tasks per page: ${tasksPerPage}`) }}>Show Page Number</button>

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

export default TaskEditor