import { createContext, useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectNonHiddenTasks } from '../../../redux/selectors'
import { THEMES, SORTING_METHODS, SORTING_METHODS_NAMES, SIMPLE_TASK_HEADERS, TASK_STATUSES } from '../../utils/constants'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import { StyledTaskEditor } from './TaskEditor.elements'
import {
	filterTaskList, highlightDefaults, calculateWaste, validateTasks, millisToHours
} from '../../utils/helpers.js'
import { parse } from 'date-fns'
import PropTypes from 'prop-types'
import { taskEditorOptionsSchema, fillWithOptionDefaults } from '../../schemas/options/taskEditorOptionsSchema'

import Pagination from '../../molecules/Pagination/Pagination'

/*
	TODO: Convert Start/End Time Auto Calculation Feature to Functional version
	TODO: Fix the Bug where the dnd is reset when store is updated and the list is sorted
	TODO: Fix the display bug where when the checkmark is clicked, and it resets view
		-> Use Timestamp swapping technique and keep using store for updates
	TODO: Make a Completed at Timestamp, to record when it was completed!
	TODO: Make a Hidden field, to indicate whether the task is hidden or showing. 
	TODO: Only retrieve non-hidden tasks with selector, and Axios API request later.
	TODO: Completed tasks should disable all fields and simply display it, also be fixed
	TODO: When Sorting list, split completed/not completed into 2 lists, and apply sorting algos to both, then combine with completed on top always
	TODO: Have Gray out tasks check every so often, to deal with the edge case for when it goes out of bounds of start,end and no user inputs
	TODO: Investigate why ETA Twitches when you update the status fast
	TODO: Decouple the styling in task row
	TODO: Move the timeRange up to a prop, and pass down to TaskControl with respect to Context/No Context (flexibility)
	TODO: Re-assess usage of useValidateTask(s) hooks and validation functions, I sense simplification and inefficiencies

	*/

export const TaskEditorContext = createContext()

// TODO: When sort by timestamp, ensure the completed tasks are sorted by ETA so that order is Correctly maintained!
// TODO: Extract out the Pagination thing into a molecule
// TODO: Figure out how to reset the minutes left every day. Maybe add a Recycle task button?
// TODO: Fix the pagination highlight bug. Maybe add a highlight field to the tasks?
const TaskEditor = ({ variant = 'dark', tasks, sortingAlgorithm = 'timestamp', maxwidth = 818, options }) => {
	// --- Input Verification
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (sortingAlgorithm && !Object.keys(SORTING_METHODS_NAMES).includes(sortingAlgorithm)) sortingAlgorithm = 'timestamp'

	// --- Tasks and TaskControl State needed for proper functioning of Features, Passed down in Context, some obtained from Redux Store

	// State for the Pagination feature
	// TODO: This implementation is inefficient, it selects ALL tasks from the store then filters.
	const [tasksPerPage, setTasksPerPage] = useState(10) // 10 is a placeholder, use a prop or something for actual default
	const [page, setPage] = useState(1) // default page, 1 is a placeholder, use a prop or something for actual default

	// Task Data (Redux), Task View (Context), Searching, Sorting, and Algorithm Change State
	const tasksFromRedux = useSelector(selectNonHiddenTasks) // useValidateTasks() causes issues for some reason
	const [sortingAlgo, setSortingAlgo] = useState(sortingAlgorithm?.toLowerCase().trim() || '')
	const [taskList, setTaskList] = useState(validateTasks({ taskList: completedOnTopSorted(tasksFromRedux, tasks) }))
	const [search, setSearch] = useState('') // value of searchbar, for filtering tasks
	const [newDropdownOptions, setNewDropdownOptions] = useState(options)

	// Auto Calculation State
	const [timeRange, setTimeRange] = useState({ start: parse('18:00', 'HH:mm', new Date()), end: parse('00:30', 'HH:mm', new Date()) }) // value of start, end time for tasks to be done today
	const { start, end } = { ...timeRange } // Destructure timeRange
	const [owl, setOwl] = useState(true)
	const [highlights, setHighlights] = useState(highlightDefaults(taskList, start, end, owl)) // fill w/ default highlights based on taskList
	const [taskUpdated, setTaskUpdated] = useState(false) // Used to help the waste update every second feature. Ugly but it works

	// State for multiple delete feature
	const [selectedTasks, setSelectedTasks] = useState(taskList.map(() => false)) // initializes with false list for each task
	const [isHighlighting, setIsHighlighting] = useState(false) // Are we using the multiple delete feature?


	// --- Ensure Sorted List when tasks and sorting algo change Feature
	useEffect(() => {
		setTaskList((!sortingAlgo && sortingAlgo !== '') ? tasksFromRedux : completedOnTopSorted(tasksFromRedux, tasks))
	}, [tasksFromRedux])
	useEffect(() => {
		if (tasksFromRedux) setTaskList(old => (!sortingAlgo && sortingAlgo !== '') ? tasksFromRedux : completedOnTopSorted(old, tasks))
	}, [sortingAlgo])

	// --- Search Filter Feature
	useEffect(() => {
		// These 2 conditionals let you have proper functioning search feature in all cases
		if (search?.length > 0) {
			const temp = SORTING_METHODS[sortingAlgo](tasksFromRedux)
			setTaskList(filterTaskList({ list: temp, filter: search, attribute: 'task' }))
		} if (search?.length === 0 && search.trim() === '') {
			setTaskList(tasksFromRedux ? SORTING_METHODS[sortingAlgo](tasksFromRedux) : tasks)
		}
	}, [search])

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
	const update = () => {
		const updated = calculateWaste({ start, taskList, time: new Date() })
		setTaskList(updated); setHighlights(highlightDefaults(updated, new Date(start), new Date(end), owl))
	}
	useEffect(() => update(), [timeRange, owl])
	useEffect(() => {
		if (taskUpdated) update()
		const interval = setInterval(() => update(), 500)
		return () => {
			if (interval) clearInterval(interval)
			setTaskUpdated(false)
		}
	}, [taskList]) // this is needed to update waste every second, unfortunately

	// --- Completed Tasks On Top Feature
	function completedOnTopSorted(reduxTasks, tasks) {
		if (!reduxTasks) return SORTING_METHODS[sortingAlgo](tasks)
		const completedTasks = reduxTasks.filter(task => task?.status === TASK_STATUSES.COMPLETED)
		const remainingTasks = reduxTasks.filter(task => task?.status !== TASK_STATUSES.COMPLETED)
		return [...SORTING_METHODS[sortingAlgo](completedTasks), ...SORTING_METHODS[sortingAlgo](remainingTasks)]
	}

	return (
		<TaskEditorContext.Provider value={{
			taskList, setTaskList, search, setSearch, timeRange, setTimeRange,
			highlights, setHighlights, owl, setOwl, taskUpdated, setTaskUpdated,
			selectedTasks, setSelectedTasks, isHighlighting, setIsHighlighting,
			tasksPerPage, page
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
			<button onClick={() => console.log(highlights)}>Show Highlights</button>
			<button onClick={() => {console.log(`page: ${page}, tasks per page: ${tasksPerPage}\nstartRange = ${startRange}, endRange = ${endRange}`)}}>Show Page Number</button>
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
					total={tasksFromRedux?.length}
					onTasksPerPageChange={setTasksPerPage}
					onPageChange={setPage}
				/>
			</StyledTaskEditor>
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