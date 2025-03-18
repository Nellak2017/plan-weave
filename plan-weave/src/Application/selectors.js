import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { tryCatchSyncFlat, isStatusChecked, getAvailableThreads } from '../Core/utils/helpers.js'
import { SORTING_METHODS } from '../Core/utils/constants.js'
import { CHOOSE, CHOSEN } from './finiteStateMachines/MultipleDeleteButton.fsm.js'
// TODO: Add more business constraints here for these selectors
export const tasks = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.tasks), () => [])
export const task = (taskID, selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.tasks).filter(task => task?.id === taskID)?.[0], () => { })
export const userID = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.auth?.userID), () => '')
export const isOwl = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.toggle?.owlTaskEditor?.toggleState), () => false)
export const isFullTask = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.toggle?.fullTaskTaskEditor?.toggleState), () => false)
export const fsmControlledState = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.multiDelete?.multiDeleteTaskEditor?.fsmControlledState), () => 'default')
export const timeRange = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.timeRange), () => ({ startTaskEditor: { defaultTime: "" }, endTaskEditor: { defaultTime: "" } }))
export const pageNumber = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.pagination?.paginationTaskEditor?.pageNumber), () => 1)
export const tasksPerPage = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.pagination?.paginationTaskEditor?.tasksPerPage), () => 10)
export const dnd = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.dnd), () => [])
const taskEditorSearch = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.search?.searchTaskEditor?.searchValue), () => '')
const taskEditorSort = (selector = useSelector) => tryCatchSyncFlat(() => selector(state => state?.sort?.sortTaskEditor?.sortAlgorithm), () => '')
export const taskOrderPipeOptions = () => {
    const pageNum = pageNumber(), perPage = tasksPerPage()
    return {
        oldTaskList: tasks(), dnd: dnd(), filter: taskEditorSearch(), sortAlgo: SORTING_METHODS[taskEditorSort()],
        paginationRange: { start: ((pageNum * perPage) - perPage) + 1, end: pageNum * perPage },
    }
}
export const isHighlighting = () => {
    const fsmState = fsmControlledState()
    return fsmState === CHOOSE || fsmState === CHOSEN
}
export const isChecked = taskID => isHighlighting() ? task(taskID)?.selected : isStatusChecked(task(taskID)?.status)
export const isAtleastOneTaskSelected = () => tasks().filter(task => task?.selected)?.length > 0
export const isZeroTasksSelected = () => tasks().filter(task => task?.selected)?.length === 0
export const taskIDsToDelete = () => tasks().map((task, index) => ({ ...task, index })).filter(task => task?.selected).map(task => ({ index: task?.index, id: task?.id }))
export const getAllThreadOptionsAvailable = (selector = useSelector) => tryCatchSyncFlat(() => selector(createSelector([state => state?.tasks], tasks => getAvailableThreads(tasks))), () => [])