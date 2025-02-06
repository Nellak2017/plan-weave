import { addTask } from './tasks.js'
import { DEFAULT_FULL_TASK } from '../../../Core/utils/constants.js'
import { toast } from 'react-toastify'
export const addTaskThunkAPI = ({ userID }) => dispatch => { 
    // addTaskAPI({task, userID}) // 1. POST to API
    console.log({ ...DEFAULT_FULL_TASK, id: new Date().getTime() })
    dispatch(addTask({ ...DEFAULT_FULL_TASK, id: new Date().getTime() })) // 2. Add task to local reducer to sync state optimistically
    toast.info('You added a New Default Task') // 3. Inform user they added a new task
} // Reducer + Business Logic + Side-effects