import { useSelector } from 'react-redux'
import { tryCatchSyncFlat } from '../Core/utils/helpers.js' // for returning defaults if no redux used
// TODO: Add more business constraints here for these selectors
// TODO: Use constants and getters for the defaults instead of hard coded values
export const tasks = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.tasks), () => [])
export const task = (taskID, selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.tasks).filter(task => task?.id === taskID)?.[0], () => { })
export const userID = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.auth?.userID), () => '')
export const variant = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.variant), () => 'dark')
export const isOwl = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.toggle?.owlTaskEditor?.toggleState), () => false)
export const isFullTask = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.toggle?.fullTaskTaskEditor?.toggleState), () => false)
export const fsmControlledState = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.multiDelete?.multiDeleteTaskEditor?.fsmControlledState), () => 'default')
export const timeRange = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.timeRange), () => ({ startTaskEditor: { defaultTime: "" }, endTaskEditor: { defaultTime: "" } }))
export const pageNumber = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.pagination?.paginationTaskEditor?.pageNumber), () => 1)
export const tasksPerPage = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.pagination?.paginationTaskEditor?.tasksPerPage), () => 10)
export const dnd = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.dnd), () => [])
// TODO: Add a selector for the Task Transformation pipeline options!
export const taskOrderPipeOptions = () => {
    return {
        oldTaskList: tasks(),
        dnd: dnd(),
    }
}