import { createContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { THEMES, SORTING_METHODS, SORTING_METHODS_NAMES, SIMPLE_TASK_HEADERS } from '../../utils/constants'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import { StyledTaskEditor } from './TaskEditor.elements'
import {
	filterTaskList, highlightDefaults, hoursToMillis
} from '../../utils/helpers.js'
import { format, parse, getTime } from 'date-fns'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { taskEditorOptionsSchema, fillWithOptionDefaults } from '../../schemas/options/taskEditorOptionsSchema'

/*
	TODO: Extract the Drop Down logic into custom hook that will return an enhanced options file
	TODO: Add tests and JSDOCS to searchFilter function in helpers.js 
	TODO: Convert Start/End Time Auto Calculation Feature to Functional version
	TODO: Test Highlight Defaults
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
	*/

export const TaskEditorContext = createContext()

const TaskEditor = ({ variant = 'dark', tasks, sortingAlgorithm = 'timestamp', maxwidth = 818, options }) => {
	// --- Input Verification
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (sortingAlgorithm && !Object.keys(SORTING_METHODS_NAMES).includes(sortingAlgorithm)) sortingAlgorithm = 'timestamp'

	// --- Tasks and TaskControl State needed for proper functioning of Features, Passed down in Context, some obtained from Redux Store

	// Task Data (Redux), Task View (Context) State
	const tasksFromRedux = useSelector(state => state?.tasks?.tasks)
	const [taskList, setTaskList] = useState(tasksFromRedux ? SORTING_METHODS[sortingAlgo](tasksFromRedux) : tasks)

	// Sorting, Search, and Changing Sorting Method State
	const [sortingAlgo, setSortingAlgo] = useState(sortingAlgorithm?.toLowerCase().trim() || '')
	const [search, setSearch] = useState('') // value of searchbar, for filtering tasks
	const [newDropdownOptions, setNewDropdownOptions] = useState(options)

	// Auto Calculation State
	const [timeRange, setTimeRange] = useState({ start: parse('15:00', 'HH:mm', new Date()), end: parse('23:30', 'HH:mm', new Date()) }) // value of start, end time for tasks to be done today
	const { start, end } = { ...timeRange } // Destructure timeRange
	const [owl, setOwl] = useState(false)
	const [highlights, setHighlights] = useState(highlightDefaults(taskList, start, end, owl)) // fill w/ default highlights based on taskList

	// --- Ensure Sorted List when tasks and sorting algo change Feature
	useEffect(() => {
		// We want to maintain ordering when the user simply updates a field in the task, so check if len changed!
		//if (tasksFromRedux && tasksFromRedux.length != taskList.length) {
		setTaskList(!sortingAlgo ? tasksFromRedux : SORTING_METHODS[sortingAlgo](tasksFromRedux))
		//}
	}, [tasksFromRedux])
	useEffect(() => {
		if (tasksFromRedux) setTaskList(old => !sortingAlgo ? tasksFromRedux : SORTING_METHODS[sortingAlgo](old))
	}, [sortingAlgo])

	// --- Search Filter Feature
	useEffect(() => {
		// These 2 conditionals let you have proper functioning search feature in all cases
		if (search?.length > 0) {
			const temp = SORTING_METHODS[sortingAlgo](tasksFromRedux)
			setTaskList(filterTaskList({ list: temp, filter: search, attribute: 'task' }))
		}
		if (search?.length === 0 && search.trim() === '') {
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

	// --- Start/End Time Auto Calculation Feature
	useEffect(() => {
		// Calculate Task List and Highlight list, then set them if you can
		(() => {
			let currentTime = getTime(start)
			const updatedTaskList = [...taskList].map(task => {
				if (task.eta) {
					currentTime += hoursToMillis(task.ttc || 0)
					return { ...task, eta: format(currentTime, 'HH:mm') }
				} else { return task }
			})

			// Without this Guard, it will infinitely loop 
			if (!isEqual(updatedTaskList, taskList)) {
				setTaskList(updatedTaskList)
				setHighlights(highlightDefaults(taskList, new Date(start), new Date(end), owl))
			}
		})()
	}, [taskList, timeRange, owl])

	return (
		<TaskEditorContext.Provider value={{
			taskList, setTaskList, search, setSearch, timeRange, setTimeRange,
			highlights, setHighlights, owl, setOwl
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