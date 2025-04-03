/*eslint-disable  react-hooks/exhaustive-deps*/
import { useMemo, useEffect } from 'react'
import { parseISO } from 'date-fns'
import { userID as userIDSelector, isOwl, isFullTask, fsmControlledState, timeRange, properlyOrderedTasks } from '../../selectors.js'
import { searchThunk, sortThunk, toggleThunk, updateTimeRangeThunk, addTaskThunkAPI, updateMultiDeleteFSMThunk } from '../../thunks.js'
import { VALID_SEARCH_IDS, VALID_SORT_IDS, VALID_TIMERANGE_IDS, VALID_TOGGLE_IDS, VALID_MULTI_DELETE_IDS } from '../../validIDs.js'
import store from '../../store.js'
import { firstIncompleteIndex } from '../../../Core/utils/helpers.js'
import { toast } from 'react-toastify'
import { setDefaultTime } from '../../boundedContexts/timeRange/timeRangeSlice.js'

const dispatch = store.dispatch
export const useTopSlot = () => {
    const { startTaskEditor, endTaskEditor } = timeRange()
    const owl = isOwl()
    const start = startTaskEditor?.defaultTime, end = endTaskEditor?.defaultTime
    const startMillis = parseISO(start).getTime(), endMillis = parseISO(end).getTime()
    useEffect(() => {
        if ((endMillis < startMillis) && !owl) {
            dispatch(setDefaultTime({ id: VALID_TIMERANGE_IDS.END_TIME_PICKER_ID, value: start }))
            toast.warn('End time cannot be less than start time. End time is set to start time.')
        }
    }, [endTaskEditor?.defaultTime])
    useEffect(() => {
        if ((endMillis < startMillis) && !owl) {
            dispatch(setDefaultTime({ id: VALID_TIMERANGE_IDS.START_TIME_PICKER_ID, value: end }))
            toast.warn('End time cannot be less than start time. Start time is set to end time.')
        }
    }, [startTaskEditor?.defaultTime])
    const childState = { isOwl: owl, startTime: useMemo(() => parseISO(start), [startTaskEditor?.defaultTime]), endTime: useMemo(() => parseISO(end), [endTaskEditor?.defaultTime]), }
    const childServices = {
        search: ({ value, id = VALID_SEARCH_IDS?.SEARCH_TASK_EDITOR_ID }) => { dispatch(searchThunk({ id, value })) },
        updateTimeRange: ({ id, value }) => { dispatch(updateTimeRangeThunk({ id, value })) },
        toggleOwl: () => { dispatch(toggleThunk({ id: VALID_TOGGLE_IDS.OWL_ID })) },
    }
    return { childState, childServices }
}

export const useBottomSlot = () => {
    const { endTaskEditor } = timeRange()
    const userID = userIDSelector()
    const taskList = properlyOrderedTasks(), firstIncomplete = useMemo(() => firstIncompleteIndex(taskList), [taskList])
    const prevTaskID = taskList?.[firstIncomplete]?.id || 0
    const childState = {
        isFullTask: isFullTask(), fsmControlledState: fsmControlledState(), isOwl: isOwl(),
        endTime: useMemo(() => endTaskEditor?.defaultTime ? parseISO(endTaskEditor?.defaultTime) : new Date(), [endTaskEditor?.defaultTime]),
    }
    const childServices = {
        addTask: () => { dispatch(addTaskThunkAPI({ userID, prevTaskID })) },
        fullTaskToggle: () => { dispatch(toggleThunk({ id: VALID_TOGGLE_IDS.FULL_TASK_ID })) },
        setMultiDeleteFSMState: value => { dispatch(updateMultiDeleteFSMThunk({ id: VALID_MULTI_DELETE_IDS.MULTI_DELETE_TASK_EDITOR_ID, value })) },
        sort: ({ value, id = VALID_SORT_IDS?.SORT_TASK_EDITOR }) => { dispatch(sortThunk({ id, value })) },
    }
    return { childState, childServices }
}