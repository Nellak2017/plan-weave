import { createContext, useState, useEffect } from 'react'
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

/*
	Easy: 	
		TODO: Add Test coverage to new helpers

	Medium:
		TODO: Figure out how to reset the minutes left every day. Maybe add a Recycle task button?
		TODO: Fix the Next Day highlight bug. Since we use dates to highlight, the 'isNextDay' function doesn't work as expected when next day, look at this
		TODO: Limit the Tasks fetched to be 1000 and the user created tasks to be 1000 as well
		TODO: Config Support for Complete Tasks
		TODO: Config Support for Delete Multiple Tasks
		TODO: Refresh Tasks Button
		TODO: Sort icons
		TODO: Refactor the form in task row to be like formik (When you make Full Task)
		TODO: The x in the (n of x page) display doesn't update
		TODO: Finish up the Pagination component
		TODO: Refactor all functions to make use of Railway oriented design (for example the Maybe monad). Look at the validation helper

	Hard: 
		TODO: Solve the Pagination Problem (The one where you efficiently use pagination with memos and stuff)
	
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
	startEndTimes = { 'start': parse('16:40', 'HH:mm', new Date()), 'end': parse('00:30', 'HH:mm', new Date()) },
	paginationOptions = { 'tasksPerPage': 10, 'page': 1 },
	title = "Today's Tasks"
}) => {
	// --- Input Verification
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (sortingAlgorithm && !Object.keys(SORTING_METHODS_NAMES).includes(sortingAlgorithm)) sortingAlgorithm = 'timestamp'

	// --- Tasks and TaskControl State needed for proper functioning of Features, Passed down in Context, some obtained from Redux Store

	// State for the Pagination feature
	const [tasksPerPage, setTasksPerPage] = useState(isInt(paginationOptions?.tasksPerPage) ? paginationOptions.tasksPerPage : 10)
	const [page, setPage] = useState(isInt(paginationOptions?.page) ? paginationOptions.page : 1) // default page #

	// Auto Calculation State
	const [timeRange, setTimeRange] = useState(startEndTimes) // value of start, end time for tasks to be done today
	const { start, end } = { ...timeRange } // Destructure timeRange
	const [owl, setOwl] = useState(true)
	const [taskUpdated, setTaskUpdated] = useState(false) // Used to help the waste update every second feature. Ugly but it works

	// Task Data (Redux), Task View (Context), Searching, Sorting, DnD, and Algorithm Change State
	const tasksFromRedux = useSelector(selectNonHiddenTasks) // useValidateTasks() causes issues for some reason
	const [sortingAlgo, setSortingAlgo] = useState(sortingAlgorithm?.toLowerCase().trim() || '')
	const [dnd, setDnd] = useState(tasksFromRedux.map((_, i) => i)) // list that tells mapping of task list. ex: [1,3,2] - taskList:[a,b,c] -> [a,c,b] 
	const [taskList, setTaskList] = useState(validateTasks({ taskList: completedOnTopSorted(tasksFromRedux, tasks, start) }))
	const [search, setSearch] = useState('') // value of searchbar, for filtering tasks
	const [newDropdownOptions, setNewDropdownOptions] = useState(options)

	// State for multiple delete feature
	const [selectedTasks, setSelectedTasks] = useState(taskList.map(() => false)) // initializes with false list for each task
	const [isHighlighting, setIsHighlighting] = useState(false) // Are we using the multiple delete feature?

	// --- Ensure Sorted List when tasks and sorting algo change Feature
	useEffect(() => {
		setTaskList((!sortingAlgo && sortingAlgo !== '') ? tasksFromRedux : completedOnTopSorted(tasksFromRedux, tasks, start))
	}, [tasksFromRedux])
	useEffect(() => {
		if (tasksFromRedux) setTaskList(old => (!sortingAlgo && sortingAlgo !== '') ? tasksFromRedux : completedOnTopSorted(old, tasks, start, [
			SORTING_METHODS[sortingAlgo], 
			t => transform(t, tasksFromRedux.map((_,i) => i)), 
			t => calculateWaste({ start, taskList: t, time: new Date() })
		]))
		setDnd(tasksFromRedux.map((_, i) => i)) // reset dnd whenever sorting algorithm changes
	}, [sortingAlgo])

	// --- Change Sorting Algorithm Feature
	useEffect(() => {
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
	const update = () => setTaskList(old => old.length > 0 ? calculateWaste({ start, taskList: old, time: new Date() }) : old)
	useEffect(() => update(), [timeRange, owl, dnd])
	useEffect(() => {
		if (taskUpdated) { update() }
		const interval = setInterval(() => { if (!taskUpdated) update() }, 500)
		return () => { if (interval) clearInterval(interval); setTaskUpdated(false) }
	}, [taskList]) // this is needed to update waste every second, unfortunately

	return (
		<TaskEditorContext.Provider value={{
			taskList, setTaskList, search, setSearch, timeRange, setTimeRange,
			owl, setOwl, taskUpdated, setTaskUpdated,
			selectedTasks, setSelectedTasks, isHighlighting, setIsHighlighting,
			tasksPerPage, page, dnd, setDnd
		}}>
			<button onClick={() => {
				console.log(sortingAlgo)
			}}>Show Sorting Algo</button>
			<button onClick={() => {
				console.log(taskList)
			}}>Show Task View</button>
			<button onClick={() => {
				console.log(tasksFromRedux)
			}}>Show Redux Store</button>
			<button onClick={() => { console.log(`page: ${page}, tasks per page: ${tasksPerPage}\nstartRange = ${startRange}, endRange = ${endRange}`) }}>Show Page Number</button>
			<button onClick={() => console.log(`Dnd Config: ${dnd}`)}>Show DnD Config</button>


			<TaskEditorContainer>
				<h1>{title}</h1>
				<StyledTaskEditor variant={variant} maxwidth={maxwidth}>
					<TaskControl
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