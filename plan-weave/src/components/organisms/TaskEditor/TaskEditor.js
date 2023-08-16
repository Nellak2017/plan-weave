import { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector, Provider } from 'react-redux'
import { THEMES, SORTING_METHODS } from '../../utils/constants'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'

const TaskEditorContext = createContext()

const TaskEditor = ({ variant = 'dark', tasks, sortingAlgorithm = '', maxwidth = 818, useReduxData = true }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const tasksFromRedux = useSelector(state => state.tasks.tasks)
	const [sortingAlgo, setSortingAlgo] = useState(sortingAlgorithm.toLowerCase().trim() || '')
	const [taskList, setTaskList] = useState(SORTING_METHODS[sortingAlgo](tasksFromRedux))

	useEffect(() => {
		setTaskList(SORTING_METHODS[sortingAlgo](tasksFromRedux))
	}, [tasksFromRedux])

	useEffect(() => {
		setTaskList(old => SORTING_METHODS[sortingAlgo](old))
	}, [sortingAlgo])

	const handleSortingAlgoChange = algorithm => {
		setSortingAlgo(algorithm)
	}

	// Will be used to define the switching of sorting algorithms
	const options = [
		{ name: 'Option 1', listener: () => console.log('Option 1 clicked') },
		{ name: 'Option 2', listener: () => console.log('Option 2 clicked') },
		{ name: 'Option 3', listener: () => console.log('Option 3 clicked') },
	]

	return (
		<TaskEditorContext.Provider value={{}}>
			<TaskControl
				variant={variant}
				options={options}
				clock1Text={''}
				clock2Text={''}
			/>
			<TaskTable
				variant={variant}
				headerLabels={['Task', 'Waste', 'TTC', 'ETA']}
				tasks={taskList}
			/>
		</TaskEditorContext.Provider>
	)
}

export default TaskEditor