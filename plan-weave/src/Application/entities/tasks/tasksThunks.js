import { addTask, deleteTask, updateTask, deleteTasks, updateTasksBatch } from './tasks.js'
import { addDnD, deleteMultipleDnD, deleteDnD } from '../../sessionContexts/dnd.js'
import { setPrevLiveTaskID } from '../../sessionContexts/prevLiveTaskID.js'
import { DEFAULT_FULL_TASK, FULL_TASK_FIELDS, TASK_STATUSES } from '../../../Core/utils/constants.js'
import { toggleTaskStatus, calculateLiveTime, calculateWaste, calculateEfficiency } from '../../../Core/utils/helpers.js'
import { toast } from 'react-toastify'

const { completedTimeStamp, task, parentThread, liveTimeStamp, liveTime, waste, efficiency } = FULL_TASK_FIELDS
// TODO: API + Other
export const addTaskThunkAPI = ({ userID, prevTaskID }) => dispatch => {
    const currentTimeMillis = new Date().getTime()
    // addTaskAPI({task, userID}) // 1. POST to API
    dispatch(addTask({ ...DEFAULT_FULL_TASK, id: currentTimeMillis, liveTimeStamp: new Date().toISOString(), timestamp: currentTimeMillis / 1000 })) // 2. Add task to local reducer to sync state optimistically
    dispatch(addDnD()) // 3. Update the dnd config by adding the next ordinal to the list
    toast.info('You added a New Default Task') // 4. Inform user they added a new task
    dispatch(setPrevLiveTaskID(prevTaskID))
} // Reducer + Business Logic + Side-effects
export const completeTaskThunkAPI = ({ userID, currentTaskRow, taskOrderPipeOptions, currentTime }) => dispatch => {
    const { id, status, } = currentTaskRow || {}
    // -- calculations on incoming task for batched update below
    // updateTaskAPI({updatedTask, userID}) // 1. POST to API
    dispatch(updateTasksBatch([
        { taskID: id, field: FULL_TASK_FIELDS.status, value: toggleTaskStatus(status) },
        { taskID: id, field: completedTimeStamp, value: new Date().getTime() / 1000 },
        { taskID: id, field: liveTimeStamp, value: new Date().toISOString() },
        { taskID: id, field: liveTime, value: calculateLiveTime(currentTaskRow, taskOrderPipeOptions, currentTime) },
        { taskID: id, field: waste, value: calculateWaste(currentTaskRow, taskOrderPipeOptions, currentTime) },
        { taskID: id, field: efficiency, value: calculateEfficiency(currentTaskRow, taskOrderPipeOptions, currentTime) },
        // NOTE: liveTime, waste, efficiency, and eta are NOT controlled by the useEffects in TaskTable hook. Otherwise it will lead to double update bugs! 
    ]))
    if (status === TASK_STATUSES.INCOMPLETE) { dispatch(setPrevLiveTaskID(id)) } // prevLiveTaskID = skip if (complete->incomplete) else id
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
export const deleteTasksThunkAPI = ({ userID, taskInfos }) => dispatch => { // taskInfos => [{ index, id }]
    // Possibly some analytics collection stuff before deletion too..
    const IDs = taskInfos.map(info => info?.id), indices = taskInfos.map(info => info?.index)
    // 1. DELETE to API using list of taskIDs with form [{ index, id }]
    dispatch(deleteTasks())
    dispatch(deleteMultipleDnD({ indices }))
    dispatch(setPrevLiveTaskID(0))
    // NOTE: Pagination likely does not need to be touched since max page is a selector and will naturally push the user back to a previous page if all tasks are deleted on the second or higher page
}
export const deleteTaskThunkAPI = ({ userID, taskInfo }) => dispatch => { // taskInfo => { index, id }
    // Possibly some analytics collection stuff before deletion too..
    const ID = taskInfo?.id, index = taskInfo?.index
    // 1. DELETE to API using taskID and userID
    dispatch(deleteTask({ taskID: ID }))
    dispatch(deleteDnD({ index }))
    dispatch(setPrevLiveTaskID(0))
}
export const editThreadThunkAPI = ({ userID, taskID, newThread }) => dispatch => { // newThread => string max len 30 chars
    // 1. PATCH for the parentThread
    dispatch(updateTask({ taskID, field: parentThread, value: newThread.slice(0, 30) }))
}