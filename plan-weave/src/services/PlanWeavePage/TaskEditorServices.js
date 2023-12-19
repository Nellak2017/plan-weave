import {
	updateSearch
} from "../../redux/reducers/taskEditorReducer.js"
import {
	updateTimeRangeThunk,
	updateOwlThunk,
	addNewTaskThunk,
} from "../../redux/thunks/taskEditorThunks.js"


export const createTaskEditorServices = (store) => {

	const dispatch = store.dispatch

	const services = {
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
			addTask: (task) => {
				dispatch(addNewTaskThunk(task))
			} // thunk to add task
			/*
			deleteMany: // thunk to delete many
			sort: // thunk to update sorting method
		  },
		  taskTable: {
			dragNdrop: // reducer to update store when drag and drop happens (not DB)
			taskRow: {
			  delete: // thunk to delete task
			  update: // thunk to update task, includes checkbox, name, ttc
			},
		  },
		  pagination: {
			refresh: // thunk to apply refresh logic to all tasks
			currentPage: // reducer to change displayed page, initially 1 always
			tasksPerPage: // thunk to change tasks per page, initially 10 unless defined otherwise by DB
		  */
		},
	}

	return services
}

// Currently this approach doesn't work well as it infinitely re-renders. 
// Further research needed to implement this 
export const createStateObject = (state) => {
	const newState = {
		global: {
			getStore: () => state,
			getTasks: () => state?.tasks,
		},
		taskControl: {
			getSearch: () => state?.search,
			getTimeRange: () => {
				const timeRange = state?.timeRange
				console.log(timeRange)
				return {
					start: timeRange?.start,
					end: timeRange?.end,
				}
			},
			getOwl: () => state?.owl
			// Convert the below comments into getters for State slices
			/* 
			addTask: // thunk to add task
			deleteMany: // thunk to delete many
			sort: // thunk to update sorting method
		  },
		  taskTable: {
			dragNdrop: // reducer to update store when drag and drop happens (not DB)
			taskRow: {
			  delete: // thunk to delete task
			  update: // thunk to update task, includes checkbox, name, ttc
			},
		  },
		  pagination: {
			refresh: // thunk to apply refresh logic to all tasks
			currentPage: // reducer to change displayed page, initially 1 always
			tasksPerPage: // thunk to change tasks per page, initially 10 unless defined otherwise by DB
		  */
		},
	}

	return newState
}