import {
	updateSearch,
	updateHighlighting,
	updateSelectedTasks,
	updateDnD,
	updateTasks,
	updatePage,
	prevPage,
	nextPage,
	refresh,
	updateTasksPerPage,
	fullToggle,
	updateFirstLoad,
} from "../../redux/reducers/taskEditorSlice.js"
import {
	updateTimeRangeThunk,
	updateOwlThunk,
	addNewTaskThunk,
	removeTaskThunk,
	removeTasksThunk,
	updateTaskThunk,
	updateSortingAlgorithmThunk,
	completedTaskThunk,

	addGlobalThreadThunk,
} from "../../redux/thunks/taskEditorThunks.js"


export const createTaskEditorServices = (store) => {

	const dispatch = store.dispatch

	const services = {
		// Shared between all of TaskEditor sub-components
		global: {
			updateDnD: (movePoints) => {
				dispatch(updateDnD(movePoints))
			}, // reducer to update dnd config list when drag and drop happens (not DB)
			updateSelectedTasks: (newSelectedTasks) => {
				dispatch(updateSelectedTasks(newSelectedTasks))
			}, // reducer to update selected tasks for multi-delete feature
			updateTasks: (tasks) => {
				dispatch(updateTasks(tasks))
			},
			timeRange: (newStart, newEnd) => {
				dispatch(updateTimeRangeThunk(newStart, newEnd))
			}, // thunk to update start/end
			addThread: (thread) => {
				dispatch(addGlobalThreadThunk(thread))
			}, // thunk to update global threads with the new one
			updateFirstLoad: (isFirstLoad) => {
				dispatch(updateFirstLoad(isFirstLoad))
			} // Reducer to verify it is first load of TaskEditor, for the life of the application
		},
		taskControl: {
			search: (newSearchValue) => {
				dispatch(updateSearch(newSearchValue.trim()))
			}, // reducer for updating search in the store associated with that section
			owl: (prev = false) => {
				dispatch(updateOwlThunk(prev))
			}, // thunk to update owl
			highlighting: () => {
				dispatch(updateHighlighting())
			}, // reducer to update highlighting bool for delete many tasks
			addTask: (task) => {
				dispatch(addNewTaskThunk(task))
			}, // thunk to add task (simple or full)
			deleteMany: (selectedIds) => {
				dispatch(removeTasksThunk(selectedIds))
			}, // thunk to delete many
			sort: (sortingAlgo) => {
				dispatch(updateSortingAlgorithmThunk(sortingAlgo))
			}, // thunk to update sorting method
			fullToggle: () => {
				dispatch(fullToggle())
			} // reducer to toggle between full and simple tasks
		},
		taskTable: {
			taskRow: {
				complete: (id, updatedTask, index) => {
					dispatch(completedTaskThunk(id, updatedTask, index))
				},
				delete: (id) => {
					dispatch(removeTaskThunk(id))
				},
				update: (id, newTask) => {
					dispatch(updateTaskThunk(id, newTask))
				}
			},
		},
		pagination: {
			updatePage: (newPage) => {
				dispatch(updatePage(newPage))
			}, // reducer to change page to custom page
			prevPage: () => {
				dispatch(prevPage())
			}, // reducer to change page to previous page 
			nextPage: () => {
				dispatch(nextPage())
			}, // reducer to change page to next page 
			refresh: () => {
				dispatch(refresh())
			}, // thunk to refresh the tasks 
			tasksPerPageUpdate: (newTasksPerPage) => {
				dispatch(updateTasksPerPage(newTasksPerPage))
			}, // reducer to update number of tasks per page
		},
	}
	return services
}
