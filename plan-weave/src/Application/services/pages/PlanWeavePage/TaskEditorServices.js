import { updateSelectedTasks, updateDnD, updateTasks, updatePage, prevPage, nextPage, refresh, updateTasksPerPage, updateFirstLoad, } from "../../../redux/reducers/taskEditorSlice.js"
import { removeTaskThunk, updateTaskThunk, completedTaskThunk, addGlobalThreadThunk, } from "../../../redux/thunks/taskEditorThunks.js"

export const createTaskEditorServices = store => {
	const dispatch = store.dispatch
	const services = {
		// Shared between all of TaskEditor sub-components
		global: {
			updateDnD: movePoints => { dispatch(updateDnD(movePoints)) }, // reducer to update dnd config list when drag and drop happens (not DB)
			updateSelectedTasks: newSelectedTasks => { dispatch(updateSelectedTasks(newSelectedTasks)) }, // reducer to update selected tasks for multi-delete feature
			updateTasks: tasks => { dispatch(updateTasks(tasks)) },
			addThread: thread => { dispatch(addGlobalThreadThunk(thread)) }, // thunk to update global threads with the new one
			updateFirstLoad: isFirstLoad => { dispatch(updateFirstLoad(isFirstLoad)) } // Reducer to verify it is first load of TaskEditor, for the life of the application
		},
		taskTable: {
			taskRow: {
				complete: ({ id, updatedTask, index, userId }) => { dispatch(completedTaskThunk({ taskId: id, updatedTask, index, userId })) },
				delete: (id, userId) => { dispatch(removeTaskThunk(id, userId)) },
				update: (id, newTask, userId) => { dispatch(updateTaskThunk(id, newTask, userId)) }
			},
		},
		pagination: {
			updatePage: (newPage) => { dispatch(updatePage(newPage)) }, // reducer to change page to custom page
			prevPage: () => { dispatch(prevPage()) }, // reducer to change page to previous page 
			nextPage: () => { dispatch(nextPage()) }, // reducer to change page to next page 
			refresh: () => { dispatch(refresh()) }, // thunk to refresh the tasks 
			tasksPerPageUpdate: newTasksPerPage => { dispatch(updateTasksPerPage(newTasksPerPage)) }, // reducer to update number of tasks per page
		},
	}
	return services
}