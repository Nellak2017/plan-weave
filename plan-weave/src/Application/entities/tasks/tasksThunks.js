import { addTask, updateTask } from './tasks.js'
import { addDnD } from '../../sessionContexts/dnd.js'
import { DEFAULT_FULL_TASK } from '../../../Core/utils/constants.js'
import { toggleTaskStatus, calculateWaste, calculateLiveTime, calculateEta } from '../../../Core/utils/helpers.js'
import { toast } from 'react-toastify'

// TODO: Stop hard coding the fields
// TODO: API + Other
export const addTaskThunkAPI = ({ userID }) => dispatch => {
    // addTaskAPI({task, userID}) // 1. POST to API
    dispatch(addTask({ ...DEFAULT_FULL_TASK, id: new Date().getTime() })) // 2. Add task to local reducer to sync state optimistically
    dispatch(addDnD()) // 3. Update the dnd config by adding the next ordinal to the list
    toast.info('You added a New Default Task') // 4. Inform user they added a new task
} // Reducer + Business Logic + Side-effects
export const completeTaskThunkAPI = ({ userID, currentTaskRow, taskOrderPipeOptions, currentTime }) => dispatch => {
    const { id, status } = currentTaskRow || {}

    // -- calculations on incoming task for batched update below

    // updateTaskAPI({updatedTask, userID}) // 1. POST to API
    dispatch(updateTask({ taskID: id, field: 'status', value: toggleTaskStatus(status) })) // 2. update the status value of the task by toggling between incomplete/complete
    dispatch(updateTask({ taskID: id, field: 'completedTimeStamp', value: new Date().getTime() / 1000 })) // 2.1 update the completedTimeStamp value of the task
    dispatch(updateTask({ taskID: id, field: 'waste', value: calculateWaste(currentTaskRow, taskOrderPipeOptions, currentTime) })) // 2.2 update the waste value of the task (calculated)
    dispatch(updateTask({ taskID: id, field: 'liveTime', value: calculateLiveTime(currentTaskRow, taskOrderPipeOptions, currentTime) }))
    dispatch(updateTask({ taskID: id, field: 'eta', value: calculateEta(currentTaskRow, taskOrderPipeOptions, currentTime) })) // update the ETA value of the task (calculated)
    // update the Efficiency value of the task (calculated)
    // ... basically all the read only values get updated on complete to be inline with the calculations
    // TODO: Batch these value updates instead of individually updating each
    // dispatch(completeTaskDnD(...)) // 4. Update the dnd config 
} // Reducer + Business Logic + Side-effects
export const editTaskNameThunkAPI = ({ userID, taskID, taskName }) => dispatch => {
    // updateTaskAPI({updatedTask, userID}) // 1. POST to API
    dispatch(updateTask({ taskID, field: 'task', value: taskName })) // 2. Update task by editing the name
}
export const editTtcThunkAPI = ({ userID, taskID, ttc }) => dispatch => {
    // 1. POST to API
    dispatch(updateTask({ taskID, field: 'ttc', value: ttc }))
}
export const editDueThunkAPI = ({ userID, taskID, dueDate }) => dispatch => {
    // 1. POST to API
    dispatch(updateTask({ taskID, field: 'dueDate', value: dueDate }))
}
export const editWeightThunkAPI = ({ userID, taskID, weight }) => dispatch => {
    // 1. POST to API
    dispatch(updateTask({taskID, field: 'weight', value: weight}))
}