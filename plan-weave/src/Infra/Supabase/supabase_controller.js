import { supabase } from './supabaseClient.js'
import wretch from 'wretch' // used for DX only. If it is too bloated remove for manual version
import { toast } from 'react-toastify'

const defaultTaskSerialize = task => ({
    // simple task fields
    id: task?.ID, userId: task?.UserID,
    status: task?.Status, task: task?.Task, waste: task?.Waste, ttc: task?.Ttc, eta: task?.Eta,
    liveTime: task?.LiveTime, selected: task?.Selected, liveTimeStamp: task?.LiveTimeStamp?.Time,

    // full task fields
    efficiency: task?.Efficiency, parentThread: task?.ParentThread, dueDate: task?.DueDate,
    dependencies: [], // TODO: fix dependencies in backend code
    weight: task?.Weight,
    // new fields
    lastCompleteTime: task?.LastCompleteTime, lastIncompleteTime: task?.LastIncompleteTime, isLive: task?.IsLive,
})
const defaultTaskDeserialize = task => ({
    ID: task.id, UserID: task.userId,
    Status: task.status, Task: task.task, Waste: task.waste, Ttc: task.ttc, Eta: task.eta,
    LiveTime: task.liveTime, Selected: task.selected, LiveTimeStamp: task.liveTimeStamp,
    Efficiency: task.efficiency, ParentThread: task.parentThread, DueDate: task.dueDate,
    // dependencies not included
    Weight: task.weight, LastCompleteTime: task.lastCompleteTime, LastIncompleteTime: task.lastIncompleteTime, IsLive: task.isLive
})
const defaultTaskSerializeList = taskList => taskList.map(defaultTaskSerialize)
const defaultTaskDeserializeList = taskList => taskList.map(defaultTaskDeserialize)
const displayError = (consoleErrorMessage = 'Failed to fetch tasks:', toastError = 'Failed to fetch tasks') => consoleError => { console.error(consoleErrorMessage, consoleError); toast.error(toastError); }

export const fetchTasksFromSupabase = async (serialize = defaultTaskSerializeList) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return (error || !session)
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch('https://backend-summer-frog-7467.fly.dev/tasks/')
            .auth(`Bearer ${session.access_token}`).get().json().then(serialize).catch(displayError())
}
export const addTaskToSupabase = async (task, deserialize = defaultTaskDeserialize) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return (error || !session)
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch('https://backend-summer-frog-7467.fly.dev/tasks/')
            .auth(`Bearer ${session.access_token}`)
            .post(deserialize(task))
            .res(response => response?.ok ? response.json() : displayError('Add task failed: ', 'Add task failed')(response?.statusText))
            .catch(displayError('Failed to add task:', 'Failed to save task to server'))
}