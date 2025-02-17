import { addTask, updateTask } from './tasks.js'
import { addDnD } from '../../sessionContexts/dnd.js'
import { DEFAULT_FULL_TASK } from '../../../Core/utils/constants.js'
import { toggleTaskStatus } from '../../../Core/utils/helpers.js'
import { toast } from 'react-toastify'
export const addTaskThunkAPI = ({ userID }) => dispatch => { 
    // addTaskAPI({task, userID}) // 1. POST to API
    console.log({ ...DEFAULT_FULL_TASK, id: new Date().getTime() })
    dispatch(addTask({ ...DEFAULT_FULL_TASK, id: new Date().getTime() })) // 2. Add task to local reducer to sync state optimistically
    dispatch(addDnD()) // 3. Update the dnd config by adding the next ordinal to the list
    toast.info('You added a New Default Task') // 4. Inform user they added a new task
} // Reducer + Business Logic + Side-effects
export const completeTaskThunkAPI = ({ userID, taskID, oldStatus }) => dispatch => {
    // updateTaskAPI({updatedTask, userID}) // 1. POST to API
    dispatch(updateTask({ taskID , field: 'status', value: toggleTaskStatus(oldStatus) })) // 2. Update task by toggling between complete and incomplete status
    // dispatch(completeTaskDnD(...)) // 3. Update the dnd config 
    toast.info('You changed the status of a task') // TODO: Remove
} // Reducer + Business Logic + Side-effects