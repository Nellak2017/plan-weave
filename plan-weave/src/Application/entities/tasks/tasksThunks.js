import { addTask, deleteTask, updateTask, deleteTasks, updateTasksBatch, updateTasks, refreshTasks, addTaskDependencies, deleteTaskDependencies, clearTaskDependencies } from './tasks.js'
import { addManyDnD, addDnD, deleteMultipleDnD, deleteDnD } from '../../sessionContexts/dnd.js'
import { setPrevLiveTaskID } from '../../sessionContexts/prevLiveTaskID.js'
import { DEFAULT_FULL_TASK, FULL_TASK_FIELDS, TASK_STATUSES } from '../../../Core/utils/constants.js'
import { toggleTaskStatus, calculateLiveTime, calculateWaste, calculateEfficiency } from '../../../Core/utils/helpers.js'
import { toast } from 'react-toastify'
import { refreshTimePickers } from '../../boundedContexts/timeRange/timeRangeSlice.js'
import {
    addTaskToSupabase as addTaskAPI,
    updateTaskFieldInSupabase as updateTaskFieldAPI,
    deleteTasksInSupabase as deleteTasksAPI,
    addTaskDependenciesInSupabase as addTaskDependenciesAPI,
    deleteTaskDependenciesInSupabase as deleteTaskDependenciesAPI,
    clearTaskDependenciesInSupabase as clearTaskDependenciesAPI,
    refreshTaskInSupabase as refreshTaskAPI,
    refreshAllTasksInSupabase as refreshAllTasksAPI,
} from '../../../Infra/Supabase/supabase_controller.js'

const { lastCompleteTime, liveTimeStamp, liveTime, waste, efficiency } = FULL_TASK_FIELDS
export const initialTaskUpdate = ({ taskList }) => dispatch => {
    dispatch(updateTasks(taskList))
    dispatch(addManyDnD(taskList.length))
}
export const addTaskThunkAPI = ({ prevTaskID }) => dispatch => {
    const currentTimeMillis = new Date().getTime()
    const addedTask = { ...DEFAULT_FULL_TASK, id: currentTimeMillis, liveTimeStamp: new Date().toISOString() }
    addTaskAPI(addedTask) // 1. POST to API
    dispatch(addTask(addedTask)) // 2. Add task to local reducer to sync state optimistically
    dispatch(addDnD()) // 3. Update the dnd config by adding the next ordinal to the list
    toast.info('You added a New Default Task') // 4. Inform user they added a new task
    dispatch(setPrevLiveTaskID(prevTaskID))
} // Reducer + Business Logic + Side-effects
// TODO: Refactor 'updateTasksBatch' to have this signature instead: (taskID, {[field]: value}) which will match the API closer
// TODO: Refactor the delete functions into one unifed function and use that instead OR do the general specific split as seen in the update functions
export const playPauseTaskThunkAPI = ({ taskID, isLive, previousLiveTime, liveTimeStamp }) =>  dispatch => {
    // const newLiveTime = previousLiveTime + (new Date() - liveTimeStamp) // convert to real code
    // const updateFields = play -> paused ? [{ taskID, field: FULL_TASK_FIELDS.isLive, value: !isLive }, { taskID, field: FULL_TASK_FIELDS.liveTimeStamp, value: newLiveTime },] : [{ taskID, field: FULL_TASK_FIELDS.isLive, value: !isLive }]
    updateTaskFieldAPI({ taskID, field: FULL_TASK_FIELDS.isLive, value: !isLive })
    // if play -> paused then do this batch update
    // else do a solo update to only update one field
    dispatch(updateTasksBatch([
        { taskID, field: FULL_TASK_FIELDS.isLive, value: !isLive },
        // { taskID, field: FULL_TASK_FIELDS.liveTimeStamp, value: newLiveTime },
        // TODO: liveTimeStamp trick
    ]))
    /* 
      liveTimeStamp trick:
      # Calculate these values at the Thunk time, not continuously

      liveTime = previous liveTime + (now - liveTimeStamp) # The continuous version of the isLive state will be addressed later
      if Play -> Paused:
        liveTimeStamp = now
    */
}

export const completeTaskThunkAPI = ({ currentTaskRow, taskOrderPipeOptions, currentTime }) => dispatch => {
    const { id, status, } = currentTaskRow || {}
    // -- calculations on incoming task for batched update below
    updateTaskFieldAPI({ taskID: id, field: FULL_TASK_FIELDS.COMPLETED, value: TASK_STATUSES.COMPLETED }) // 1. PUT to API
    dispatch(updateTasksBatch([
        { taskID: id, field: FULL_TASK_FIELDS.status, value: toggleTaskStatus(status) },
        { taskID: id, field: lastCompleteTime, value: new Date().getTime() / 1000 },
        { taskID: id, field: liveTimeStamp, value: new Date().toISOString() },
        { taskID: id, field: liveTime, value: calculateLiveTime(currentTaskRow, taskOrderPipeOptions, currentTime) },
        { taskID: id, field: waste, value: calculateWaste(currentTaskRow, taskOrderPipeOptions, currentTime) },
        { taskID: id, field: efficiency, value: calculateEfficiency(currentTaskRow, taskOrderPipeOptions, currentTime) },
        // NOTE: liveTime, waste, efficiency, and eta are NOT controlled by the useEffects in TaskTable hook. Otherwise it will lead to double update bugs! 
    ]))
    if (status === TASK_STATUSES.INCOMPLETE) { dispatch(setPrevLiveTaskID(id)) } // prevLiveTaskID = skip if (complete->incomplete) else id
    // dispatch(completeTaskDnD(...)) // 4. Update the dnd config 
} // Reducer + Business Logic + Side-effects
export const editTaskFieldThunkAPI = ({ taskID, field, value }) => dispatch => {
    updateTaskFieldAPI({ taskID, field, value })          // 1. PUT to API
    dispatch(updateTask({ taskID, field, value }))        // 2. Local Redux update
}
export const editTaskNameThunkAPI = ({ taskID, taskName }) => editTaskFieldThunkAPI({ taskID, field: 'task', value: taskName })
export const editTtcThunkAPI = ({ taskID, ttc }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.ttc, value: ttc })
export const editDueThunkAPI = ({ taskID, dueDate }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.dueDate, value: dueDate })
export const editWeightThunkAPI = ({ taskID, weight }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.weight, value: weight })
export const editThreadThunkAPI = ({ taskID, newThread }) => editTaskFieldThunkAPI({ taskID, field: 'parentThread', value: newThread.slice(0, 30) })
export const deleteTasksThunkAPI = ({ taskInfos }) => dispatch => { // taskInfos => [{ index, id }]
    // Possibly some analytics collection stuff before deletion too..
    const IDs = taskInfos.map(info => info?.id), indices = taskInfos.map(info => info?.index)
    deleteTasksAPI(IDs) // 1. DELETE to API using list of taskIDs
    dispatch(deleteTasks())
    dispatch(deleteMultipleDnD({ indices }))
    dispatch(setPrevLiveTaskID(0))
    // NOTE: Pagination likely does not need to be touched since max page is a selector and will naturally push the user back to a previous page if all tasks are deleted on the second or higher page
}
export const deleteTaskThunkAPI = ({ taskInfo }) => dispatch => { // taskInfo => { index, id }
    // Possibly some analytics collection stuff before deletion too..
    const ID = taskInfo?.id, index = taskInfo?.index
    deleteTasksAPI([ID]) // 1. DELETE to API using taskID and userID
    dispatch(deleteTask({ taskID: ID }))
    dispatch(deleteDnD({ index }))
    dispatch(setPrevLiveTaskID(0))
}
// TODO: Make refreshTaskThunkAPI
/* 
export const refreshAllTasksThunkAPI = ({ isOwl, taskID }) => dispatch => {
    refreshTaskAPI({ taskID })                                // 1. POST to API 
    dispatch(refreshTimePickers({ isOwl }))                   // 2. Local Redux updates
    dispatch(refreshTask({ taskID }))                         // TODO: create this reducer
}
*/
export const refreshAllTasksThunkAPI = ({ isOwl }) => dispatch => {
    refreshAllTasksAPI()                                      // 1. POST to API 
    dispatch(refreshTimePickers({ isOwl }))                   // 2. Local Redux updates
    dispatch(refreshTasks())
}
export const addTaskDependencyAPI = ({ taskID, dependencies }) => dispatch => {
    addTaskDependenciesAPI({ taskID, dependencies })           // 1. POST to API using taskID and dependencies list
    dispatch(addTaskDependencies({ taskID, dependencies }))    // 2. Local Redux update
}
export const deleteTaskDependencyAPI = ({ taskID, dependencies }) => dispatch => {
    deleteTaskDependenciesAPI({ taskID, dependencies })        // 1. DELETE to API using taskID and dependencies list
    dispatch(deleteTaskDependencies({ taskID, dependencies })) // 2. Local Redux update
}
export const clearTaskDependencyAPI = ({ taskID }) => dispatch => {
    clearTaskDependenciesAPI({ taskID })                       // 1. POST to API using taskID
    dispatch(clearTaskDependencies({ taskID }))                // 2. Local Redux update
}
export const editDependenciesThunkAPI = ({ taskID, reason, details }) => dispatch => {
    const dependencies = [details?.option?.value] // details?: { option?: { value, label }}
    const possibleReasons = { // blur and createOption ignored
        'removeOption': () => dispatch(deleteTaskDependencyAPI({ taskID, dependencies })),
        'selectOption': () => dispatch(addTaskDependencyAPI({ taskID, dependencies })),
        'clear': () => dispatch(clearTaskDependencyAPI({ taskID })),
    }
    possibleReasons?.[reason]?.() // call possible reasons or do nothing
}