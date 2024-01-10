// Thunks that are for all Organisms on PlanWeave
import { toast } from 'react-toastify'
import {
	updateGlobalTasks
} from '../reducers/globalTasksSlice.js'
import {
	updateTasks
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