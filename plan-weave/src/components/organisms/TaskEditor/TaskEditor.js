import { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector, Provider } from 'react-redux'
import { THEMES, SORTING_METHODS, SORTING_METHODS_NAMES, SIMPLE_TASK_HEADERS } from '../../utils/constants'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import { StyledTaskEditor } from './TaskEditor.elements'

/*
	TODO: Add Schema validation for the input Options for the Drop-down menu
	TODO: Extract the Drop Down logic into custom hook that will return an enhanced options file
	TODO: Extract searchFilter function to helpers and provide tests and JSDOCS 
*/

export const TaskEditorContext = createContext()

const TaskEditor = ({ variant = 'dark', tasks, sortingAlgorithm = 'timestamp', maxwidth = 818, options }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (sortingAlgorithm && !Object.keys(SORTING_METHODS_NAMES).includes(sortingAlgorithm)) sortingAlgorithm = 'timestamp'

	const tasksFromRedux = useSelector(state => state?.tasks?.tasks)
	const [sortingAlgo, setSortingAlgo] = useState(sortingAlgorithm?.toLowerCase().trim() || '')
	const [taskList, setTaskList] = useState(tasksFromRedux ? SORTING_METHODS[sortingAlgo](tasksFromRedux) : tasks)
	const [search, setSearch] = useState('') // value of searchbar, for filtering tasks

	useEffect(() => {
		if (tasksFromRedux) setTaskList(!sortingAlgo ? tasksFromRedux : SORTING_METHODS[sortingAlgo](tasksFromRedux))
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

	// Search Filter Function
	const filterTaskList = ({ filter, list, attribute }) => {
		if (!filter || !attribute) return list
		if (!list) return []
		return list.filter(item => {
			if (item[attribute].length < filter.length) return false
			else return item[attribute]?.toLowerCase()?.includes(filter?.toLowerCase())
		}
		)
	}

	return (
		<TaskEditorContext.Provider value={{ taskList, setTaskList, search, setSearch }}>
			<button onClick={() => {
				console.log(sortingAlgo)
			}}>Show Sorting Algo</button>
			<button onClick={() => {
				console.log(taskList)
			}}>Show Task View</button>
			<button onClick={() => {
				console.log(tasksFromRedux)
			}}>Show Redux Store</button>
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