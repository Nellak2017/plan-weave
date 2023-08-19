import { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector, Provider } from 'react-redux'
import { THEMES, SORTING_METHODS, SORTING_METHODS_NAMES, SIMPLE_TASK_HEADERS } from '../../utils/constants'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import { StyledTaskEditor } from './TaskEditor.elements'
import {
	filterTaskList, pureTaskAttributeUpdate, isTimestampFromToday,
	highlightDefaults, hoursToMillis
} from '../../utils/helpers.js'
import { format, parse, getTime } from 'date-fns'

/*
	TODO: Add Schema validation for the input Options for the Drop-down menu
	TODO: Extract the Drop Down logic into custom hook that will return an enhanced options file
	TODO: Add tests and JSDOCS to searchFilter function in helpers.js 
	TODO: Convert Start/End Time Auto Calculation Feature to Functional version
	TODO: Test Highlight Defaults
	TODO: Fix the Bug where the dnd is reset when store is updated and the list is sorted
	TODO: Fix the display bug where when the checkmark is clicked, it is not updated
		-> I think the way to do that is to update the task in the taskList from taskRow, while also checking if store len != taskList len
		   This will fix the bug where dnd doesn't stay put when the row is updated.
	TODO: Make a Completed at Timestamp, to record when it was completed!
	TODO: Make a Hidden field, to indicate whether the task is hidden or showing. 
	TODO: Only retrieve non-hidden tasks with selector, and Axios API request later.
	TODO: Completed tasks should disable all fields and simply display it, also be fixed
	TODO: When Sorting list with Completed Tasks, the Eta/Waste/TTC Calculations should be impervious to Completed Tasks
	TODO: When Sorting list, split completed/not completed into 2 lists, and apply sorting algos to both, then combine with completed on top always

*/

export const TaskEditorContext = createContext()

const TaskEditor = ({ variant = 'dark', tasks, sortingAlgorithm = 'timestamp', maxwidth = 818, options }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (sortingAlgorithm && !Object.keys(SORTING_METHODS_NAMES).includes(sortingAlgorithm)) sortingAlgorithm = 'timestamp'

	// Tasks and TaskControl State needed for proper functioning of Features, Passed down in Context
	const tasksFromRedux = useSelector(state => state?.tasks?.tasks)
	const [sortingAlgo, setSortingAlgo] = useState(sortingAlgorithm?.toLowerCase().trim() || '')
	const [taskList, setTaskList] = useState(tasksFromRedux ? SORTING_METHODS[sortingAlgo](tasksFromRedux) : tasks)
	const [search, setSearch] = useState('') // value of searchbar, for filtering tasks
	const [timeRange, setTimeRange] = useState({
		start: parse('10:30', 'HH:mm', new Date()),
		end: parse('23:30', 'HH:mm', new Date())
	}) // value of start, end time for tasks to be done today
	const { start, end } = { ...timeRange } // Destructure timeRange
	const [owl, setOwl] = useState(false)
	const [highlights, setHighlights] = useState(highlightDefaults(taskList, start, end, owl)) // fill w/ default highlights based on taskList

	// Ensure Sorted List when tasks and sorting algo change Feature
	useEffect(() => {
		// We want to maintain ordering when the user simply updates a field in the task, so check if len changed!
		if (tasksFromRedux && tasksFromRedux.length != taskList.length) {
			setTaskList(!sortingAlgo ? tasksFromRedux : SORTING_METHODS[sortingAlgo](tasksFromRedux))
		}
	}, [tasksFromRedux])
	useEffect(() => {
		if (tasksFromRedux) setTaskList(old => !sortingAlgo ? tasksFromRedux : SORTING_METHODS[sortingAlgo](old))
	}, [sortingAlgo])

	// Search Filter Feature
	useEffect(() => {
		if (search?.length > 0) {
			const temp = SORTING_METHODS[sortingAlgo](tasksFromRedux)
			setTaskList(filterTaskList({ list: temp, filter: search, attribute: 'task' }))
		}
		if (search?.length === 0 && search.trim() === '') {
			setTaskList(tasksFromRedux ? SORTING_METHODS[sortingAlgo](tasksFromRedux) : tasks)
		}
	}, [search])

	// TODO: Inject Custom Dropdown options listeners from this component

	// Change Sorting Algorithm Feature
	// 1. Define the Middleware for Dropdown options, to build on top of original provided
	const handleSortingAlgoChange = algorithm => { setSortingAlgo(algorithm) }

	// 2. Verify the options via schema, fill with defaults if invalid

	// 3. With validated options list, construct new dropdown options with middleware applied
	const newDropdownOptions = options.map(option => ({
		...option,
		listener: () => {
			option.listener()
			handleSortingAlgoChange(option.algorithm)
		}
	}))

	// Start/End Time Auto Calculation Feature
	useEffect(() => {
		(() => {
			const newTaskList = taskList
			let currentTime = getTime(start)
			for (let i = 0; i < Object.values(taskList).length; i++) {
				currentTime = currentTime + hoursToMillis(taskList[i] ? taskList[i]?.ttc : 0)
				if (newTaskList[i].eta) newTaskList[i] = { ...newTaskList[i], eta: format(currentTime, 'HH:mm') }
			}
			setTaskList(newTaskList)
			setHighlights(highlightDefaults(taskList, new Date(start), new Date(end), owl))
		})()
	}, [taskList, timeRange, owl])
	
	/*
	useEffect(() => {
		// This function has side-effects. It will update the taskList with proper updated times
		// It is also an Imperative Version of what could be done functionally 
		(() => {
			const hoursToMillis = hours => hours * 60000 * 60

			console.log(new Date(1692390600000))
			console.log(isTimestampFromToday(new Date(), 1692390600000, 84600))
			console.log(highlightDefaults(taskList, new Date(getTime(start)), new Date(getTime(end)), false))
			console.log('')

			// 1. Calculate important variables
			const initialTimeMillis = getTime(start) // converted to millis passed since 1970
			const endTimeMillis = owl ? getTime(end) + hoursToMillis(24) : getTime(end)
			const startOfDayMillis = new Date(initialTimeMillis).setHours(0, 0, 0, 0)
			const timeFromStartToInit = initialTimeMillis - startOfDayMillis // time between beginning of day and start, millis
			const secondsElapsedFromEnd = ((endTimeMillis - initialTimeMillis) + timeFromStartToInit) / 1000
			const newTaskList = taskList

			// 2. The next task will be previous task + ttc of current task
			let currentTime = initialTimeMillis
			for (let i = 0; i < Object.values(taskList).length; i++) {
				currentTime = currentTime + hoursToMillis(taskList[i] ? taskList[i]?.ttc : 0)
				const loopCurrentTime = currentTime // store a constant reference to currentTime, no more fucky-wucky shit here!
				
				if (newTaskList[i].eta) newTaskList[i] = { ...newTaskList[i], eta: format(currentTime, 'HH:mm') }

				// 3. If a task goes beyond end time, then gray it out (using new highlight prop)
				setHighlights(prevHighlights => {
					const updatedHighlights = [...prevHighlights] // Create a shallow copy of the array
					const isInTimeRange = isTimestampFromToday(new Date(initialTimeMillis), loopCurrentTime / 1000, secondsElapsedFromEnd)
					updatedHighlights[i] = isInTimeRange ? ' ' : 'old'
					return updatedHighlights
				})
			}
			setTaskList(newTaskList)
		})()
	}, [timeRange, owl])
	*/


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

export default TaskEditor