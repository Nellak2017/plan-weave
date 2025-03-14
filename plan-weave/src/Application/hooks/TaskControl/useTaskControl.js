import { useMemo } from 'react'
import { parseISO } from 'date-fns'
import { toast as reactToast } from 'react-toastify'
import { userID as userIDSelector, isOwl, isFullTask, fsmControlledState, timeRange } from '../../selectors.js'
import { searchThunk, sortThunk, checkTimeRangeThunk, toggleThunk, updateTimeRangeThunk, addTaskThunkAPI, updateMultiDeleteFSMThunk } from '../../thunks.js'
import { VALID_SEARCH_IDS, VALID_SORT_IDS, VALID_TIMERANGE_IDS, VALID_TOGGLE_IDS, VALID_MULTI_DELETE_IDS } from '../../validIDs.js'
import store from '../../store.js'

// TODO: Implement time range checking feature that makes TimePicker Redux controlled (uses checkTimeRange function)
const dispatch = store.dispatch
export const useTopSlot = () => {
    const { startTaskEditor, endTaskEditor } = timeRange()
    const childState = {
        isOwl: isOwl(),
        startTime: useMemo(() => startTaskEditor?.defaultTime ? parseISO(startTaskEditor?.defaultTime) : new Date(), [startTaskEditor?.defaultTime]),
        endTime: useMemo(() => endTaskEditor?.defaultTime ? parseISO(endTaskEditor?.defaultTime) : new Date(), [endTaskEditor?.defaultTime]),
    }
    const childServices = {
        search: ({ value, id = VALID_SEARCH_IDS?.SEARCH_TASK_EDITOR_ID }) => { dispatch(searchThunk({ id, value })) },
        updateTimeRange: ({ id, value }) => { dispatch(updateTimeRangeThunk({ id, value })) },
        toggleOwl: () => {
            dispatch(toggleThunk({ id: VALID_TOGGLE_IDS.OWL_ID }))
            // TODO: properly implement this
            // if (prev) { toast.info('Overnight Mode is off: Tasks must be scheduled between 12 pm and 12 am. End time must be after the start time.', {autoClose: 5000,}) } 
            // else { toast.info('Overnight Mode is on: You can schedule tasks overnight, and end time can be before the start time.', {autoClose: 5000,}) }
            // const newDate = new Date(endTime.getTime() + hoursToMillis(owl ? -24 : 24))
            // if (differenceInHours(newDate, startTime) <= owl ? 24 : 2 * 24) services?.updateTimeRange(undefined, newDate.toISOString())
        },
    }
    return { childState, childServices }
}

export const useBottomSlot = () => {
    const { startTaskEditor, endTaskEditor } = timeRange()
    const userID = userIDSelector()
    const childState = {
        isFullTask: isFullTask(), fsmControlledState: fsmControlledState(), isOwl: isOwl(),
        endTime: useMemo(() => endTaskEditor?.defaultTime ? parseISO(endTaskEditor?.defaultTime) : new Date(), [endTaskEditor?.defaultTime]),
    }
    const childServices = {
        addTask: () => { dispatch(addTaskThunkAPI({ userID })) },
        fullTaskToggle: () => { dispatch(toggleThunk({ id: VALID_TOGGLE_IDS.FULL_TASK_ID })) },
        setMultiDeleteFSMState: value => { dispatch(updateMultiDeleteFSMThunk({ id: VALID_MULTI_DELETE_IDS.MULTI_DELETE_TASK_EDITOR_ID, value })) },
        sort: ({ value, id = VALID_SORT_IDS?.SORT_TASK_EDITOR }) => { dispatch(sortThunk({ id, value })) },
    }
    return { childState, childServices }
}