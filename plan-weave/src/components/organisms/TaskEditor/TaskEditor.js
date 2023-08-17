import { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector, Provider } from 'react-redux'
import { THEMES, SORTING_METHODS, SORTING_METHODS_NAMES, SIMPLE_TASK_HEADERS } from '../../utils/constants'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'

/*
	TODO: Add Schema validation for the input Options for the Drop-down menu
	TODO: Extract the Drop Down logic into custom hook that will return an enhanced options file
*/

export const TaskEditorContext = createContext()

const TaskEditor = ({ variant = 'dark', tasks, sortingAlgorithm = '', maxwidth = 818, options, useReduxData = true }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (sortingAlgorithm && !Object.keys(SORTING_METHODS_NAMES).includes(sortingAlgorithm)) sortingAlgorithm = ''

	const tasksFromRedux = useSelector(state => state.tasks.tasks)
	const [sortingAlgo, setSortingAlgo] = useState(sortingAlgorithm.toLowerCase().trim() || '')
	const [taskList, setTaskList] = useState(useReduxData ? SORTING_METHODS[sortingAlgo](tasksFromRedux) : tasks)

	useEffect(() => {
		setTaskList(!sortingAlgo ? tasksFromRedux : SORTING_METHODS[sortingAlgo](tasksFromRedux))
	}, [tasksFromRedux])
	useEffect(() => {
		setTaskList(old => !sortingAlgo ? tasksFromRedux : SORTING_METHODS[sortingAlgo](old))
	}, [sortingAlgo])


	// Inject Custom Dropdown options listeners from this component

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

	return (
		<TaskEditorContext.Provider value={{ taskList, setTaskList }}>
			<button onClick={() => {
				console.log(sortingAlgo)
			}}>Show Sorting Algo</button>
			<button onClick={() => {
				console.log(taskList)
			}}>Show Task View</button>
			<button onClick={() => {
				console.log(tasksFromRedux)
			}}>Show Redux Store</button>
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
		</TaskEditorContext.Provider>
	)
}

export default TaskEditor