/*eslint-disable  react-hooks/exhaustive-deps*/
import { useMemo } from 'react'
import { parseISO } from 'date-fns'
import { isOwl, isFullTask, fsmControlledState, timeRange, properlyOrderedTasks, tasksPerPage as tasksPerPageSelector, pageNumber as pageNumberSelector, tasks as tasksSelector, userID as userIDSelector } from '../../selectors.js'
import { searchThunk, sortThunk, toggleThunk, updateTimeRangeThunk, addTaskThunkAPI, updateMultiDeleteFSMThunk } from '../../thunks.js'
import { VALID_SEARCH_IDS, VALID_SORT_IDS, VALID_TOGGLE_IDS, VALID_MULTI_DELETE_IDS } from '../../validIDs.js'
import store from '../../store.js'
import { firstIncompleteIndex, getInsertionIndex } from '../../../Core/utils/helpers.js'

const dispatch = store.dispatch
export const useTopSlot = () => {
    const { endTaskEditor } = timeRange(), owl = isOwl(), end = endTaskEditor?.defaultTime
    const childState = { isOwl: owl, endTime: useMemo(() => parseISO(end), [endTaskEditor?.defaultTime]), }
    const childServices = {
        search: ({ value, id = VALID_SEARCH_IDS?.SEARCH_TASK_EDITOR_ID }) => { dispatch(searchThunk({ id, value })) },
        updateTimeRange: ({ id, value }) => { dispatch(updateTimeRangeThunk({ id, value })) },
        toggleOwl: () => { dispatch(toggleThunk({ id: VALID_TOGGLE_IDS.OWL_ID })) },
    }
    return { childState, childServices }
}
export const useBottomSlot = () => {
    const { endTaskEditor } = timeRange(), taskList = properlyOrderedTasks(), firstIncomplete = useMemo(() => firstIncompleteIndex(taskList), [taskList]), prevTaskID = taskList?.[firstIncomplete]?.id || 0
    const tasksPerPage = tasksPerPageSelector(), pageNumber = pageNumberSelector(), fullTaskList = tasksSelector(), insertLocation = getInsertionIndex({ tasksPerPage, pageNumber, taskList: fullTaskList }) // location to insert the added task
    const userID = userIDSelector()
    const childState = {
        isFullTask: isFullTask(), fsmControlledState: fsmControlledState(), isOwl: isOwl(),
        endTime: useMemo(() => endTaskEditor?.defaultTime ? parseISO(endTaskEditor?.defaultTime) : new Date(), [endTaskEditor?.defaultTime]),
    }
    const childServices = {
        addTask: () => { dispatch(addTaskThunkAPI({ prevTaskID, insertLocation, userID })) },
        fullTaskToggle: () => { dispatch(toggleThunk({ id: VALID_TOGGLE_IDS.FULL_TASK_ID })) },
        setMultiDeleteFSMState: value => { dispatch(updateMultiDeleteFSMThunk({ id: VALID_MULTI_DELETE_IDS.MULTI_DELETE_TASK_EDITOR_ID, value })) },
        sort: ({ value, id = VALID_SORT_IDS?.SORT_TASK_EDITOR }) => { dispatch(sortThunk({ id, value })) },
    }
    return { childState, childServices }
}