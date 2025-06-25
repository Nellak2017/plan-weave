import { addTask, deleteTask, updateTask, deleteTasks, updateTasksBatch, updateTasks, refreshTasks } from './tasks.js'
import { addManyDnD, addDnD, deleteMultipleDnD, deleteDnD } from '../../sessionContexts/dnd.js'
import { setPrevLiveTaskID } from '../../sessionContexts/prevLiveTaskID.js'
import { DEFAULT_FULL_TASK, FULL_TASK_FIELDS, TASK_STATUSES } from '../../../Core/utils/constants.js'
import { toggleTaskStatus, calculateLiveTime, calculateWaste, calculateEfficiency } from '../../../Core/utils/helpers.js'
import { toast } from 'react-toastify'
import { deleteTasks as deleteTasksAPI } from '../../../Infra/firebase/firebase_controller.js'
import { refreshTimePickers } from '../../boundedContexts/timeRange/timeRangeSlice.js'
import { addTaskToSupabase as addTaskAPI, updateTaskToSupabase as updateTaskAPI } from '../../../Infra/Supabase/supabase_controller.js'

const { lastCompleteTime, task, parentThread, liveTimeStamp, liveTime, waste, efficiency, dependencies } = FULL_TASK_FIELDS
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
// TODO: Refactor 'updateTask' to have this signature instead: (taskID, {[field]: value}) which will match the API closer
export const completeTaskThunkAPI = ({ currentTaskRow, taskOrderPipeOptions, currentTime }) => dispatch => {
    const { id, status, } = currentTaskRow || {}
    // -- calculations on incoming task for batched update below
    updateTaskAPI({ ...currentTaskRow, status: TASK_STATUSES.COMPLETED }) // 1. PATCH to API
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
export const editTaskFieldThunkAPI = ({ taskID, field, value, currentTaskRow }) => dispatch => {
    updateTaskAPI({ ...currentTaskRow, [field]: value })  // PATCH to API
    dispatch(updateTask({ taskID, field, value }))        // Local Redux update
}
export const editTaskNameThunkAPI = ({ taskID, taskName, currentTaskRow }) => editTaskFieldThunkAPI({ taskID, field: 'task', value: taskName, currentTaskRow })
export const editTtcThunkAPI = ({ taskID, ttc, currentTaskRow }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.ttc, value: ttc, currentTaskRow })
export const editDueThunkAPI = ({ taskID, dueDate, currentTaskRow }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.dueDate, value: dueDate, currentTaskRow })
export const editWeightThunkAPI = ({ taskID, weight, currentTaskRow }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.weight, value: weight, currentTaskRow })
export const editThreadThunkAPI = ({ taskID, newThread, currentTaskRow }) => editTaskFieldThunkAPI({ taskID, field: 'parentThread', value: newThread.slice(0, 30), currentTaskRow })
export const editDependenciesThunkAPI = ({ taskID, newDependencies, currentTaskRow }) => editTaskFieldThunkAPI({ taskID, field: 'dependencies', value: newDependencies, currentTaskRow })
export const deleteTasksThunkAPI = ({ taskInfos }) => dispatch => { // taskInfos => [{ index, id }]
    // Possibly some analytics collection stuff before deletion too..
    const IDs = taskInfos.map(info => info?.id), indices = taskInfos.map(info => info?.index)
    deleteTasksAPI(IDs, userID) // 1. DELETE to API using list of taskIDs
    dispatch(deleteTasks())
    dispatch(deleteMultipleDnD({ indices }))
    dispatch(setPrevLiveTaskID(0))
    // NOTE: Pagination likely does not need to be touched since max page is a selector and will naturally push the user back to a previous page if all tasks are deleted on the second or higher page
}
export const deleteTaskThunkAPI = ({ taskInfo }) => dispatch => { // taskInfo => { index, id }
    // Possibly some analytics collection stuff before deletion too..
    const ID = taskInfo?.id, index = taskInfo?.index
    deleteTasksAPI(ID, userID) // 1. DELETE to API using taskID and userID
    dispatch(deleteTask({ taskID: ID }))
    dispatch(deleteDnD({ index }))
    dispatch(setPrevLiveTaskID(0))
}
export const refreshTasksThunkAPI = ({ isOwl, currentTaskRow }) => dispatch => {
    // updateTaskAPI(currentTaskRow?.map(task => ({
    //     ...task,
    //     eta: dateToToday(new Date(task.timestamp).toISOString()),
    //     timestamp: parseISO(dateToToday(new Date(task.timestamp).toISOString())).getTime() / 1000
    // })),
    //     userID
    // )
    // TODO: Make refresh tasks a thunk so it is reflected
    dispatch(refreshTimePickers({ isOwl }))
    dispatch(refreshTasks())
}