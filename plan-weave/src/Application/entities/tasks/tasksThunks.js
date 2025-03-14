import { addTask, updateTask, deleteTasks, updateTasksBatch } from './tasks.js'
import { addDnD, deleteMultipleDnD } from '../../sessionContexts/dnd.js'
import { DEFAULT_FULL_TASK, FULL_TASK_FIELDS } from '../../../Core/utils/constants.js'
import { toggleTaskStatus, calculateWaste, calculateLiveTime, calculateEta } from '../../../Core/utils/helpers.js'
import { toast } from 'react-toastify'

const {  completedTimeStamp, waste, liveTime, eta, task, ttc, dueDate, weight } = FULL_TASK_FIELDS
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
    dispatch(updateTasksBatch([
        { taskID: id, field: FULL_TASK_FIELDS.status, value: toggleTaskStatus(status) },
        { taskID: id, field: completedTimeStamp, value: new Date().getTime() / 1000 },
        { taskID: id, field: waste, value: calculateWaste(currentTaskRow, taskOrderPipeOptions, currentTime) },
        { taskID: id, field: liveTime, value: calculateLiveTime(currentTaskRow, taskOrderPipeOptions, currentTime) },
        { taskID: id, field: eta, value: calculateEta(currentTaskRow, taskOrderPipeOptions, currentTime) },
        // update the Efficiency value of the task (calculated)
        // ... basically all the read only values get updated on complete to be inline with the calculations
    ]))
    // dispatch(completeTaskDnD(...)) // 4. Update the dnd config 
} // Reducer + Business Logic + Side-effects
export const editTaskNameThunkAPI = ({ userID, taskID, taskName }) => dispatch => {
    // updateTaskAPI({updatedTask, userID}) // 1. POST to API
    dispatch(updateTask({ taskID, field: task, value: taskName })) // 2. Update task by editing the name
}
export const editTtcThunkAPI = ({ userID, taskID, ttc }) => dispatch => {
    // 1. POST to API
    dispatch(updateTask({ taskID, field: FULL_TASK_FIELDS.ttc, value: ttc }))
}
export const editDueThunkAPI = ({ userID, taskID, dueDate }) => dispatch => {
    // 1. POST to API
    dispatch(updateTask({ taskID, field: FULL_TASK_FIELDS.dueDate, value: dueDate }))
}
export const editWeightThunkAPI = ({ userID, taskID, weight }) => dispatch => {
    // 1. POST to API
    dispatch(updateTask({ taskID, field: FULL_TASK_FIELDS.weight, value: weight }))
}
export const deleteTasksThunkAPI = ({ userID, taskIDs }) => dispatch => {
    // 1. DELETE to API using list of taskIDs with form [{ index, id }]
    const IDs = taskIDs.map(info => info?.id), indices = taskIDs.map(info => info?.index)
    dispatch(deleteTasks())
    dispatch(deleteMultipleDnD({ indices }))
    // NOTE: Pagination likely does not need to be touched since max page is a selector and will naturally push the user back to a previous page if all tasks are deleted on the second or higher page
}