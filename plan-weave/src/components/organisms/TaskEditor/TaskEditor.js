import React, { useContext, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectNonHiddenTasksCoerceToFull } from '../../../redux/selectors'
import { THEMES, SIMPLE_TASK_HEADERS, FULL_TASK_HEADERS, VARIANTS } from '../../utils/constants'
import TaskControl from '../../molecules/TaskControl/TaskControl'
import TaskTable from '../../molecules/TaskTable/TaskTable'
import Pagination from '../../molecules/Pagination/Pagination'
import { StyledTaskEditor, TaskEditorContainer } from './TaskEditor.elements'
import PropTypes from 'prop-types'
import store from '../../../redux/store.js'
import { createTaskEditorServices } from '../../../services/PlanWeavePage/TaskEditorServices'
import { ThemeContext } from 'styled-components' // needed for theme object
import { isInputValid, coerceToSchema } from '../../utils/schema-helpers.mjs'
import { fullTasksSchema } from '../../schemas/taskSchema/taskSchema.js'

const TaskEditor = ({
	services = createTaskEditorServices(store),
	variant = VARIANTS[0],
	maxwidth = 818,
	title = "Today's Tasks"
}) => {
	// --- Input Verification
	const processedVariant = (variant && !THEMES.includes(variant)) ? VARIANTS[0] : variant

	// --- State Objects for Children
	const globalTasks = useSelector(state => state?.globalTasks)
	const taskList = useSelector(selectNonHiddenTasksCoerceToFull)
	const { output, errors } = useMemo(() => coerceToSchema(taskList, fullTasksSchema), [taskList])
	const fullTask = useSelector(state => state?.taskEditor?.fullTask)
	const userId = useSelector(state => state?.taskEditor?.userId)

	// State for TaskControl
	const TaskControlState = {
		globalTasks,
		timeRange: useSelector(state => state?.taskEditor?.timeRange),
		owl: useSelector(state => state?.taskEditor?.owl),
		isHighlighting: useSelector(state => state?.taskEditor?.highlighting),
		taskList:  Array.isArray(taskList) && taskList.length === 0 ? [] : output, // TODO: was just taskList before, simplify
		selectedTasks: useSelector(state => state?.taskEditor?.selectedTasks),
		theme: useContext(ThemeContext),
		fullTask,
		firstLoad: useSelector(state => state?.taskEditor?.firstLoad),
		userId,
	}

	// State for TaskTable 
	const TaskTableState = {
		globalTasks,
		search: useSelector(state => state?.taskEditor?.search),
		dnd: useSelector(state => state?.taskEditor?.dndConfig),
		timeRange: useSelector(state => state?.taskEditor?.timeRange),
		page: useSelector(state => state?.taskEditor?.page),
		tasksPerPage: useSelector(state => state?.taskEditor?.tasksPerPage),
		taskList: Array.isArray(taskList) && taskList.length === 0 ? [] : output, // TODO: was just taskList before, simplify
		sortingAlgo: useSelector(state => state?.taskEditor?.sortingAlgo),
		owl: useSelector(state => state?.taskEditor?.owl),
		taskTransition: useSelector(state => state?.taskEditor?.taskTransition),
		taskRowState: {
			isHighlighting: useSelector(state => state?.taskEditor?.highlighting),
			selectedTasks: useSelector(state => state?.taskEditor?.selectedTasks),
			fullTask,
			availableThreads: useSelector(state => state?.globalThreads?.threads),
			userId,
		},
	}

	// State for Pagination
	const PaginationState = {
		globalTasks,
		taskList,
		pageNumber: useSelector(state => state?.taskEditor?.page),
		tasksPerPage: useSelector(state => state?.taskEditor?.tasksPerPage),
		timeRange: useSelector(state => state?.taskEditor?.timeRange),
	}

	// Effects
	useEffect(() => {
		const { isValid, error } = isInputValid(output, fullTasksSchema) // { isValid: bool, error: string }
		if (errors && Array.isArray(errors) && errors.length > 0) {
			console.warn(errors.join('\n'))
			console.log('old task list before coercion:', taskList)
			console.log('new task list after coercion :', output)
		}
		if (!isValid) {
			console.error(
				`Your coerced tasks fetched failed to be properly coerced. 
The resulting task list has atleast the right shape and types, but are not valid.
This may cause issues in your application. 
Verify the API endpoints and check the tasks in TaskEditor component.`
			)
			console.error(error)
			console.log('old task list before coercion:\n', taskList)
			console.log('new task list after coercion :\n', output)
			// TODO: add toast here too
		}
	}, [taskList.length]) // errors,taskList

	return (
		<TaskEditorContainer variant={processedVariant}>
			<h1>{title}</h1>
			<StyledTaskEditor variant={processedVariant} maxwidth={maxwidth}>
				<TaskControl
					services={{
						...services?.global,
						...services?.taskControl,
					}}
					state={TaskControlState}
					variant={processedVariant}
					clock1Text={''}
					clock2Text={''}
				/>
				<TaskTable
					services={{
						...services?.global,
						...services?.taskTable,
					}}
					state={TaskTableState}
					variant={processedVariant}
					headerLabels={fullTask ? FULL_TASK_HEADERS : SIMPLE_TASK_HEADERS}
					maxwidth={maxwidth}
				/>
				<Pagination
					services={{
						...services?.global,
						...services?.pagination,
					}}
					state={PaginationState}
					variant={processedVariant}
				/>
			</StyledTaskEditor>
		</TaskEditorContainer>
	)
}
TaskEditor.propTypes = {
	services: PropTypes.shape({
		global: PropTypes.shape({
			updateDnD: PropTypes.func.isRequired,
			updateSelectedTasks: PropTypes.func.isRequired,
			updateTasks: PropTypes.func.isRequired,
			timeRange: PropTypes.func.isRequired,
		}).isRequired,
		taskControl: PropTypes.shape({
			search: PropTypes.func.isRequired,
			owl: PropTypes.func.isRequired,
			highlighting: PropTypes.func.isRequired,
			addTask: PropTypes.func.isRequired,
			deleteMany: PropTypes.func.isRequired,
			sort: PropTypes.func.isRequired,
		}).isRequired,
		taskTable: PropTypes.shape({
			taskRow: PropTypes.shape({
				complete: PropTypes.func.isRequired,
				delete: PropTypes.func.isRequired,
				update: PropTypes.func.isRequired,
			}).isRequired,
		}).isRequired,
		pagination: PropTypes.shape({
			updatePage: PropTypes.func.isRequired,
			prevPage: PropTypes.func.isRequired,
			nextPage: PropTypes.func.isRequired,
			refresh: PropTypes.func.isRequired,
			tasksPerPageUpdate: PropTypes.func.isRequired,
		}).isRequired,
	}),
	variant: PropTypes.oneOf(VARIANTS),
	maxwidth: PropTypes.number,
	title: PropTypes.string,
}

export default TaskEditor

