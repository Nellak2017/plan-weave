/* eslint-disable camelcase */
import { supabase } from './supabaseClient.js'
import wretch from 'wretch' // used for DX only. If it is too bloated remove for manual version
import { toast } from 'react-toastify'

// NOTE: we omit liveTimeStamp since it is useless, we will remove from backend in the future
const WEB_SERVER_URL = process.env.NEXT_PUBLIC_WEB_SERVER_URL
const defaultTaskSerialize = task => ({
    // simple task fields
    id: task?.ID, userId: task?.UserID,
    status: task?.Status, task: task?.Task, waste: task?.Waste, ttc: task?.Ttc, eta: task?.Eta,
    liveTime: task?.LiveTime, selected: task?.Selected,
    liveTimeStamp: task?.LiveTimeStamp?.Valid ? task?.LiveTimeStamp?.Time : new Date().toISOString(),

    // full task fields
    efficiency: task?.Efficiency, parentThread: task?.ParentThread, dueDate: task?.DueDate,
    dependencies: task?.Dependencies || [],
    weight: task?.Weight,
    // new fields
    lastCompleteTime: task?.LastCompleteTime, lastIncompleteTime: task?.LastIncompleteTime, isLive: task?.IsLive,
})
const defaultTaskDeserialize = task => ({
    ID: task?.id, //UserID: task?.userId,
    Status: task?.status, Task: task?.task, Waste: task?.waste, Ttc: task?.ttc, Eta: task?.eta,
    LiveTime: task?.liveTime, Selected: task?.selected,
    Efficiency: task?.efficiency, ParentThread: task?.parentThread, DueDate: task?.dueDate,
    // dependencies not included
    Weight: task?.weight, LastCompleteTime: task?.lastCompleteTime, LastIncompleteTime: task?.lastIncompleteTime, IsLive: task?.isLive
})
const defaultTaskSerializeList = taskList => taskList.map(defaultTaskSerialize)
const displayError = (consoleErrorMessage = 'Failed to fetch tasks:', toastError = 'Failed to fetch tasks') => consoleError => { console.error(consoleErrorMessage, consoleError); toast.error(toastError); }

// TODO: When a runtime error is thrown, it crashes the app, figure out how to make an error boundary for them
export const fetchTasksFromSupabase = async (serialize = defaultTaskSerializeList) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return (error || !session)
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/`)
            .auth(`Bearer ${session.access_token}`).get().json().then(serialize).catch(displayError())
}
export const addTaskToSupabase = async (task, deserialize = defaultTaskDeserialize) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return (error || !session)
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/`)
            .auth(`Bearer ${session.access_token}`)
            .post(deserialize(task))
            .res(response => response?.ok ? response.json() : displayError('Add task failed: ', 'Add task failed')(response?.statusText))
            .catch(displayError('Failed to add task:', 'Failed to save task to server'))
}
export const updateTaskToSupabase = async (task, deserialize = defaultTaskDeserialize) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return (error || !session)
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/`)
            .auth(`Bearer ${session.access_token}`)
            .put(deserialize(task))
            .res(response => response?.ok ? response.json() : displayError('Update task failed: ', 'Update task failed')(response?.statusText))
            .catch(displayError('Failed to update task:', 'Failed to update task on server'))
}
export const updateTaskFieldInSupabase = async ({ taskID, field, value }) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return (error || !session)
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/`)
            .auth(`Bearer ${session.access_token}`)
            .patch({ task_id: taskID, field, value: typeof value === 'string' ? value : JSON.stringify(value), })
            .res(response => response?.ok ? response.json() : displayError('Update task field failed:', 'Failed to update field')(response?.statusText))
            .catch(displayError('Failed to patch task field:', 'Failed to update task field'))
}
export const deleteTasksInSupabase = async (taskIDs = []) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return error || !session
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/`)
            .auth(`Bearer ${session.access_token}`)
            .headers({ 'Content-Type': 'application/json' })
            .body(JSON.stringify(taskIDs))
            .delete()
            .res(response => response?.ok ? response.json() : displayError('Delete task(s) failed:', 'Could not delete selected tasks')(response?.statusText))
            .catch(displayError('Failed to delete task(s):', 'Server error while deleting tasks'))
}
export const addTaskDependenciesInSupabase = async ({ taskID, dependencies }) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return error || !session
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/task_dependencies/`)
            .auth(`Bearer ${session.access_token}`)
            .post({ task_id: taskID, dependencies })
            .res(response => response?.ok ? response.json() : displayError('Add task dependency failed:', 'Could not add task dependencies')(response?.statusText))
            .catch(displayError('Failed to add task dependencies:', 'Server error while adding task dependencies'))
}
export const deleteTaskDependenciesInSupabase = async ({ taskID, dependencies }) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return error || !session
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/task_dependencies/`)
            .auth(`Bearer ${session.access_token}`)
            .headers({ 'Content-Type': 'application/json' })
            .body(JSON.stringify({ task_id: taskID, dependencies }))
            .delete()
            .res(response => response?.ok ? response.json() : displayError('Delete task dependency failed:', 'Could not delete task dependencies')(response?.statusText))
            .catch(displayError('Failed to delete task dependencies:', 'Server error while deleting task dependencies'))
}
export const clearTaskDependenciesInSupabase = async ({ taskID }) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return error || !session
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/clear_dependencies/`)
            .auth(`Bearer ${session.access_token}`)
            .post({ task_id: taskID })
            .res(response => response?.ok ? response.json() : displayError('Clear task dependencies failed:', 'Could not clear task dependencies')(response?.statusText))
            .catch(displayError('Failed to clear task dependencies:', 'Server error while clearing task dependencies'))
}
export const refreshTaskInSupabase = async ({ taskID, eta }) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return error || !session
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/refresh/`)
            .auth(`Bearer ${session.access_token}`)
            .post({ task_id: taskID, eta })
            .res(response => response?.ok ? response.json() : displayError('Refresh task failed:', 'Could not refresh task')(response?.statusText))
            .catch(displayError('Failed to refresh task:', 'Server error while refreshing task'))
}
export const refreshAllTasksInSupabase = async (eta) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return error || !session
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch(`${WEB_SERVER_URL}/tasks/refresh_all/`)
            .auth(`Bearer ${session.access_token}`)
            .post({ eta })
            .res(response => response?.ok ? response.json() : displayError('Refreshing all tasks failed:', 'Could not refresh all tasks')(response?.statusText))
            .catch(displayError('Failed to refresh all tasks:', 'Server error while refreshing all tasks'))
}