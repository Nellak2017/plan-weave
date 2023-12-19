import { createContext, useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectNonHiddenTasks } from '../../../redux/selectors'
import { THEMES, SORTING_METHODS_NAMES, SORTING_METHODS, SIMPLE_TASK_HEADERS } from '../../utils/constants'
import { calculateWaste, validateTasks, transform, isInt, completedOnTopSorted } from '../../utils/helpers.js'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import Pagination from '../../molecules/Pagination/Pagination'
import { StyledTaskEditor, TaskEditorContainer } from './TaskEditor.elements'
import { parse } from 'date-fns'
import PropTypes from 'prop-types'
import { taskEditorOptionsSchema, fillWithOptionDefaults } from '../../schemas/options/taskEditorOptionsSchema'

import store from '../../../redux/store.js'
import {
	createTaskEditorServices,
	createStateObject
} from '../../../services/PlanWeavePage/TaskEditorServices'
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
		TODO: Add full test coverage for this component
		TODO: Add visual tests for this component in storybook
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
	sortingAlgorithm = 'timestamp',
	maxwidth = 818,
	options,
	startEndTimes = { 'start': parse('00:00', 'HH:mm', new Date()), 'end': parse('17:00', 'HH:mm', new Date()) },
	paginationOptions = { 'tasksPerPage': 10, 'page': 1 },
	title = "Today's Tasks"
}) => {
	// --- Input Verification
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (sortingAlgorithm && !Object.keys(SORTING_METHODS_NAMES).includes(sortingAlgorithm)) sortingAlgorithm = 'timestamp'

	const services = createTaskEditorServices(store)
	const reduxStore = useSelector(state => state?.tasks)
	// --- Tasks and TaskControl State needed for proper functioning of Features, Passed down in Context, some obtained from Redux Store

	// State for the Pagination feature
	const [tasksPerPage, setTasksPerPage] = useState(isInt(paginationOptions?.tasksPerPage) ? paginationOptions.tasksPerPage : 10)
	const [page, setPage] = useState(isInt(paginationOptions?.page) ? paginationOptions.page : 1) // default page #

	// Auto Calculation State
	const [owl, setOwl] = useState(true)
	const [timeRange, setTimeRange] = useState({ ...startEndTimes }) // starts off in possibly incorrect state, but TaskControl fixes it (to avoid races, and ensure integrity)
	const start = useMemo(() => timeRange['start'], [timeRange]) // destructure timerange, only start (we don't use end here)
	const [taskUpdated, setTaskUpdated] = useState(false) // Used to help the waste update every second feature. Ugly but it works

	// Task Data (Redux), Task View (Context), Searching, Sorting, DnD, and Algorithm Change State
	const tasksFromRedux = useSelector(selectNonHiddenTasks) // useValidateTasks() causes issues for some reason
	const [sortingAlgo, setSortingAlgo] = useState(sortingAlgorithm?.toLowerCase().trim() || '')
	const [dnd, setDnd] = useState(tasksFromRedux.map((_, i) => i)) // list that tells mapping of task list. ex: [1,3,2] - taskList:[a,b,c] -> [a,c,b] 
	const [taskList, setTaskList] = useState(validateTasks({ taskList: completedOnTopSorted(tasksFromRedux, tasks, start) }))
	const [newDropdownOptions, setNewDropdownOptions] = useState(options)

	// State for multiple delete feature
	const [selectedTasks, setSelectedTasks] = useState(taskList.map(() => false)) // initializes with false list for each task
	const [isHighlighting, setIsHighlighting] = useState(false) // Are we using the multiple delete feature?

	// Memo for context
	const memoizedContext = useMemo(() => ({
		taskList, setTaskList, timeRange, setTimeRange,
		owl, setOwl, taskUpdated, setTaskUpdated,
		selectedTasks, setSelectedTasks, isHighlighting, setIsHighlighting,
		tasksPerPage, page, dnd, setDnd
	}), [
		taskList, setTaskList, timeRange, setTimeRange,
		owl, setOwl, taskUpdated, setTaskUpdated,
		selectedTasks, setSelectedTasks, isHighlighting, setIsHighlighting,
		tasksPerPage, page, dnd, setDnd
	])

	// --- Ensure Sorted List when tasks change Feature
	useEffect(() => {
		const transforms = [
			t => transform(t, dnd), // apply dnd config
			t => calculateWaste({ start, taskList: t, time: new Date() }) // calculate waste/eta
		]
		setTaskList((!sortingAlgo && sortingAlgo !== '')
			? tasksFromRedux
			: completedOnTopSorted(tasksFromRedux, tasks, start, transforms, SORTING_METHODS[sortingAlgo])
		)
	}, [tasksFromRedux])

	// --- Change Sorting Algorithm Feature
	useEffect(() => {
		// Apply transformations to ensure correctly sorted and other calculations applied
		const transforms = [
			t => transform(t, tasksFromRedux.map((_, i) => i)), // apply DEFAULT dnd config
			t => calculateWaste({ start, taskList: t, time: new Date() }) // calculate waste/eta
		]
		if (tasksFromRedux) {
			setTaskList(old => (!sortingAlgo && sortingAlgo !== '')
				? tasksFromRedux
				: completedOnTopSorted(old, tasks, start, transforms, SORTING_METHODS[sortingAlgo])
			)
			// reset dnd whenever sorting algorithm changes
			setDnd(tasksFromRedux.map((_, i) => i))
		}

		// 0. Apply this middleware, (listener in option + setSortingAlgo(...)), to the dropdown options whenever the algorithm changes
		(async () => {
			// 1. Verify the options via schema, fill with defaults if invalid
			const validateAndFillOptions = async options => {
				const isValid = await taskEditorOptionsSchema.isValid(options)
				if (!isValid) return options.map(fillWithOptionDefaults)
				return options
			}

			// 2. With validated options list, construct new dropdown options with middleware applied
			const validatedOptions = await validateAndFillOptions(options)

			// 3. Set the newDropdownOptions with the middleware applied
			setNewDropdownOptions(validatedOptions.map(option => ({
				...option,
				listener: () => {
					option.listener()
					setSortingAlgo(option.algorithm)
				}
			})))
		})()
	}, [sortingAlgo])

	// --- ETA + Waste Auto Calculation Feature
	const update = () => setTaskList(old => calculateWaste({ start: start, taskList: old, time: new Date() }) || old)
	useEffect(() => update(), [timeRange, start, owl, dnd])
	useEffect(() => {
		if (taskUpdated) { update() }
		const interval = setInterval(() => { if (!taskUpdated) update() }, 50)
		return () => { if (interval) { clearInterval(interval); setTaskUpdated(false) } }
	}, [taskList]) // this is needed to update waste every second, unfortunately

	return (
		<TaskEditorContext.Provider value={memoizedContext}>
			<button onClick={() => {
				console.log(sortingAlgo)
			}}>Show Sorting Algo</button>
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
				console.log(reduxStore?.timeRange)
			}}>Show timerange Redux</button>
			<button onClick={() => { console.log(`page: ${page}, tasks per page: ${tasksPerPage}`) }}>Show Page Number</button>
			<button onClick={() => console.log(`Dnd Config: ${dnd}`)}>Show DnD Config</button>
			<button onClick={() => console.log(`start: ${timeRange['start']}\nend: ${timeRange['end']}`)}>Show timerange</button>
			<button onClick={() => console.log(`start: ${start}`)}>Show memoized start</button>

			<TaskEditorContainer variant={variant}>
				<h1>{title}</h1>
				<StyledTaskEditor variant={variant} maxwidth={maxwidth}>
					<TaskControl
						services={services?.taskControl}
						variant={variant}
						options={newDropdownOptions}
						clock1Text={''}
						clock2Text={''}
					/>
					<TaskTable
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