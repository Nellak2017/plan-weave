import { addTask, deleteTask, updateTask, deleteTasks, updateTasksBatch, updateTasks, refreshTask, refreshTasks, addTaskDependencies, deleteTaskDependencies, clearTaskDependencies } from './tasks.js'
import { addManyDnD, addDnD, deleteMultipleDnD, deleteDnD } from '../../sessionContexts/dnd.js'
import { setPrevLiveTaskID } from '../../sessionContexts/prevLiveTaskID.js'
import { DEFAULT_FULL_TASK, FULL_TASK_FIELDS, TASK_STATUSES } from '../../../Core/utils/constants.js'
import { toggleTaskStatus, computeUpdatedWaste, computeUpdatedEfficiency, calculateEta, dateToToday, add, } from '../../../Core/utils/helpers.js'
import { toast } from 'react-toastify'
import { refreshTimePickers } from '../../boundedContexts/timeRange/timeRangeSlice.js'
import { addTaskToSupabase as addTaskAPI, updateTaskToSupabase as updateTaskAPI, updateTaskFieldInSupabase as updateTaskFieldAPI, deleteTasksInSupabase as deleteTasksAPI, addTaskDependenciesInSupabase as addTaskDependenciesAPI, deleteTaskDependenciesInSupabase as deleteTaskDependenciesAPI, clearTaskDependenciesInSupabase as clearTaskDependenciesAPI, refreshTaskInSupabase as refreshTaskAPI, refreshAllTasksInSupabase as refreshAllTasksAPI, } from '../../../Infra/Supabase/supabase_controller.js'

export const initialTaskUpdate = ({ taskList }) => dispatch => {
    dispatch(updateTasks(taskList))
    dispatch(addManyDnD(taskList.length))
}
export const addTaskThunkAPI = ({ prevTaskID, insertLocation }) => dispatch => {
    // TODO: Look closer at this task creation, you miss atleast userID upon creation
    const currentTimeMillis = new Date().getTime()
    const addedTask = { ...DEFAULT_FULL_TASK, id: currentTimeMillis, liveTimeStamp: new Date().toISOString() }
    addTaskAPI(addedTask)                                                // 1. POST to API
    dispatch(addTask({ insertLocation, addedTask }))                     // 2. Add task to local reducer to sync state optimistically
    dispatch(addDnD())                                                   // 3. Update the dnd config by adding the next ordinal to the list
    toast.info('You added a New Default Task')                           // 4. Inform user they added a new task
    dispatch(setPrevLiveTaskID(prevTaskID))
} // Reducer + Business Logic + Side-effects
// TODO: Refactor the delete functions into one unifed function and use that instead OR do the general specific split as seen in the update functions
export const playPauseTaskThunkAPI = ({ currentTaskRow: { id, isLive, status } }) => dispatch => {
    if (status === TASK_STATUSES.COMPLETED) return // If it is already complete, play or pause doesn't update
    const update = { taskID: id, field: FULL_TASK_FIELDS.isLive, value: !isLive }
    updateTaskFieldAPI(update)
    dispatch(updateTask(update))
}
export const completeTaskThunkAPI = ({ currentTaskRow }) => dispatch => {
    const { id, status, } = currentTaskRow || {}
    const { lastCompleteTime, lastIncompleteTime } = FULL_TASK_FIELDS
    const updates = {
        [FULL_TASK_FIELDS.status]: toggleTaskStatus(status),
        [status === TASK_STATUSES.INCOMPLETE ? lastCompleteTime : lastIncompleteTime]: new Date().toISOString(),
        [FULL_TASK_FIELDS.isLive]: false, // If a task is complete it is never live
    }
    updateTaskAPI({ ...currentTaskRow, ...updates })    // 1. PUT to API
    dispatch(updateTasksBatch({ id, updates }))         // 2. Update local Redux store to match DB 
    // dispatch(completeTaskDnD(...))                   // 3. Update the dnd config 
}
export const updateDerivedThunkAPI = ({ currentTaskRow, dependencyEtasMillis }) => dispatch => {
    const { id, liveTime, ttc } = currentTaskRow || {}
    const updates = {
        [FULL_TASK_FIELDS.waste]: computeUpdatedWaste({ liveTime, ttc }),
        [FULL_TASK_FIELDS.efficiency]: computeUpdatedEfficiency({ liveTime, ttc }),
        [FULL_TASK_FIELDS.eta]: calculateEta({ liveTime, ttc, dependencyEtasMillis }),
    }
    updateTaskAPI({ ...currentTaskRow, ...updates })    // 1. PUT to API
    dispatch(updateTasksBatch({ id, updates }))         // 2. Update local Redux store to match DB
}
const editTaskFieldThunkAPI = ({ taskID, field, value }) => dispatch => {
    updateTaskFieldAPI({ taskID, field, value })          // 1. PUT to API
    dispatch(updateTask({ taskID, field, value }))        // 2. Local Redux update
}
export const editTaskNameThunkAPI = ({ taskID, taskName }) => editTaskFieldThunkAPI({ taskID, field: 'task', value: taskName })
export const editTtcThunkAPI = ({ taskID, ttc }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.ttc, value: ttc })
export const editDueThunkAPI = ({ taskID, dueDate }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.dueDate, value: dueDate })
export const editWeightThunkAPI = ({ taskID, weight }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.weight, value: weight })
export const editThreadThunkAPI = ({ taskID, newThread }) => editTaskFieldThunkAPI({ taskID, field: 'parentThread', value: newThread.slice(0, 30) })
export const editLiveTimeStampAPI = ({ taskID, liveTimeStamp }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.liveTimeStamp, value: liveTimeStamp })
export const editLiveTimeAPI = ({ taskID, liveTime }) => editTaskFieldThunkAPI({ taskID, field: FULL_TASK_FIELDS.liveTime, value: liveTime })
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
export const refreshTaskThunkAPI = ({ isOwl, taskID, currentTaskRow }) => dispatch => {
    const eta = dateToToday(add(new Date(new Date().toISOString()), currentTaskRow?.ttc || 0).toISOString())
    refreshTaskAPI({ taskID, eta })                           // 1. POST to API 
    dispatch(refreshTimePickers({ isOwl }))                   // 2. Local Redux updates
    dispatch(refreshTask({ taskID }))
}
export const refreshAllTasksThunkAPI = ({ isOwl }) => dispatch => {
    const eta = new Date().toISOString() // TODO: make into eta list eventually on API and this for more accuracy
    refreshAllTasksAPI(eta)                                   // 1. POST to API 
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