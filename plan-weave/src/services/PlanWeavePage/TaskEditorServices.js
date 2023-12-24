import {
	updateSearch,
	updateHighlighting,
	updateSelectedTasks,
	updateDnD,
	updatePage,
	updateTasks,
} from "../../redux/reducers/taskEditorSlice.js"
import {
	updateTimeRangeThunk,
	updateOwlThunk,
	addNewTaskThunk,
	removeTasksThunk,
	updateSortingAlgorithmThunk,
} from "../../redux/thunks/taskEditorThunks.js"


export const createTaskEditorServices = (store) => {

	const dispatch = store.dispatch

	const services = {
		// Shared between all of TaskEditor sub-components
		global: {
			updateDnDConfig: (newConfig) => {
				dispatch(updateDnD(newConfig))
			}, // reducer to update dnd config list when drag and drop happens (not DB)
			updateSelectedTasks: (newSelectedTasks) => {
				dispatch(updateSelectedTasks(newSelectedTasks))
			}, // reducer to update selected tasks for multi-delete feature

			updateTasks: (tasks) => {
				dispatch(updateTasks(tasks))
			},
		},
		taskControl: {
			search: (newSearchValue) => {
				dispatch(updateSearch(newSearchValue.trim()))
			}, // reducer for updating search in the store associated with that section
			timeRange: (newStart, newEnd) => {
				dispatch(updateTimeRangeThunk(newStart, newEnd))
			}, // thunk to update start/end
			owl: () => {
				dispatch(updateOwlThunk())
			}, // thunk to update owl
			highlighting: () => {
				dispatch(updateHighlighting())
			}, // reducer to update highlighting bool for delete many tasks
			addTask: (task) => {
				dispatch(addNewTaskThunk(task))
			}, // thunk to add task
			deleteMany: (selectedIds) => {
				dispatch(removeTasksThunk(selectedIds))
			}, // thunk to delete many
			sort: (sortingAlgo) => {
				dispatch(updateSortingAlgorithmThunk(sortingAlgo))
			} // thunk to update sorting method

		},
		taskTable: {
			taskRow: {
				/*
				  delete: // thunk to delete task
				  update: // thunk to update task, includes name, ttc
				  complete: // thunk to specifically update the task w/ checkbox (so special logic applies)
				*/
			},
		},

		pagination: {
			updatePage: (page) => {
				dispatch(updatePage(page))
			}, // reducer to change displayed page, initially 1 always
			/*
			refresh: // thunk to apply refresh logic to all tasks
			tasksPerPage: // thunk to change tasks per page, initially 10 unless defined otherwise by DB
			*/
		},

	}

	return services
}
