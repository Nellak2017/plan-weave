import { supabase } from './supabaseClient.js'
import wretch from 'wretch' // used for DX only. If it is too bloated remove for manual version
import { toast } from 'react-toastify'

const defaultTaskSerialize = taskList => taskList.map(task => ({
    // simple task fields
    id: task?.ID,
    userId: task?.UserID,
    status: task?.Status,
    task: task?.Task,
    waste: task?.Waste,
    ttc: task?.Ttc,
    eta: task?.Eta,
    liveTime: task?.LiveTime,
    selected: task?.Selected,
    liveTimeStamp: task?.LiveTimeStamp?.Time,

    // full task fields
    efficiency: task?.Efficiency,
    parentThread: task?.ParentThread,
    dueDate: task?.DueDate,
    dependencies: [], // TODO: fix dependencies
    weight: task?.Weight,
    // new fields
    lastCompleteTime: task?.LastCompleteTime,
    lastIncompleteTime: task?.LastIncompleteTime,
    isLive: task?.IsLive,
}))

const displayError = (consoleErrorMessage = 'Failed to fetch tasks:', toastError = 'Failed to fetch tasks') => consoleError => { console.error(consoleErrorMessage, consoleError); toast.error(toastError); }
export const fetchTasksFromSupabase = async (serialize = defaultTaskSerialize) => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return (error || !session)
        ? displayError('Failed to get Supabase session:', 'Not authenticated. Please log in again.')(error)
        : wretch('https://backend-summer-frog-7467.fly.dev/tasks/')
            .auth(`Bearer ${session.access_token}`).get().json().then(serialize).catch(displayError())
}