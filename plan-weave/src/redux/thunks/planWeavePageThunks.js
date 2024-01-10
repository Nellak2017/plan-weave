// Thunks that are for all Organisms on PlanWeave
import { toast } from 'react-toastify'
import {
	updateGlobalTasks
} from '../reducers/globalTasksSlice.js'
import {
	updateTasks,
	updateUserId
} from '../reducers/taskEditorSlice.js'

// Used for Initial Fetch of Task Data
export const initialTaskUpdate = (tasks) => (dispatch) => {
	try {
		dispatch(updateGlobalTasks(tasks))
		dispatch(updateTasks(tasks))
	} catch (e) {
		console.error(e)
		toast.error('Failed to do the initial Task Update')
	}
}

// Used to update the userId stored in the store, used in initial load of Plan-Weave
export const initialUserIdUpdate = (userId) => (dispatch) => {
	try {
		dispatch(updateUserId(userId))
	} catch (e) {
		console.error(e)
		toast.error('Failed to update the initial userId in the Redux store')
	}
}