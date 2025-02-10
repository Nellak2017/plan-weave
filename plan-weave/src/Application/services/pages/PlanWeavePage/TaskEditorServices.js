import { updateSelectedTasks, updateDnD, updateTasks, updateFirstLoad, } from "../../../redux/reducers/taskEditorSlice.js"
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
	}
	return services
}