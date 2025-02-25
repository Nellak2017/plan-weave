import { useMemo } from 'react'
import { parseISO } from 'date-fns'
import { toast as reactToast } from 'react-toastify'
import { userID as userIDSelector, variant, isOwl, isFullTask, fsmControlledState, timeRange } from '../../selectors.js'
import { searchThunk, sortThunk, checkTimeRangeThunk, toggleThunk, updateTimeRangeThunk, addTaskThunkAPI, updateMultiDeleteFSMThunk } from '../../thunks.js'
import { VALID_SEARCH_IDS, VALID_SORT_IDS, VALID_TIMERANGE_IDS, VALID_TOGGLE_IDS, VALID_MULTI_DELETE_IDS } from '../../validIDs.js'
import store from '../../store.js'

// TODO: Implement time range checking feature that makes TimePicker Redux controlled (uses checkTimeRange function)
export const useTaskControl = () => {
    const dispatch = store.dispatch
    const { startTaskEditor, endTaskEditor } = timeRange(), timeRangeState = { startTaskEditor, endTaskEditor }
    const userID = userIDSelector()

    const childState = {
        variant: variant(), isOwl: isOwl(), isFullTask: isFullTask(), fsmControlledState: fsmControlledState(),
        startTime: useMemo(() => startTaskEditor?.defaultTime ? parseISO(startTaskEditor?.defaultTime) : new Date(), [timeRangeState]),
        endTime: useMemo(() => endTaskEditor?.defaultTime ? parseISO(endTaskEditor?.defaultTime) : new Date(), [timeRangeState]),
    }
    const childServices = {
        search: ({ value, id = VALID_SEARCH_IDS?.SEARCH_TASK_EDITOR_ID }) => { dispatch(searchThunk({ id, value })) },
        sort: ({ value, id = VALID_SORT_IDS?.SORT_TASK_EDITOR }) => { dispatch(sortThunk({ id, value })) },
        checkTimeRange: ({ endTime, startTime, isOwl, id = VALID_TIMERANGE_IDS.END_TIME_PICKER_ID, toast = reactToast, }) => { dispatch(checkTimeRangeThunk({ id, toast, endTime, startTime, isOwl })) },
        toggleOwl: () => { 
            dispatch(toggleThunk({ id: VALID_TOGGLE_IDS.OWL_ID })) 
            // TODO: properly implement this
            // if (prev) {
            //     toast.info('Overnight Mode is off: Tasks must be scheduled between 12 pm and 12 am. End time must be after the start time.', {
            //       autoClose: 5000,
            //     })
            //   } else {
            //     toast.info('Overnight Mode is on: You can schedule tasks overnight, and end time can be before the start time.', {
            //       autoClose: 5000,
            //     })
            //   }
            // const shiftEndTime = (services, shift, startTime, endTime, maxDifference) => {
            //     const newDate = new Date(endTime.getTime() + hoursToMillis(shift))
            //     const startEndDifference = differenceInHours(newDate, startTime)
            //     if (startEndDifference <= maxDifference) services?.updateTimeRange(undefined, newDate.toISOString())
            // }
            // shiftEndTime(services, owl ? -24 : 24, startTime, endTime, owl ? 24 : 2 * 24)
        },
        fullTaskToggle: () => { dispatch(toggleThunk({ id: VALID_TOGGLE_IDS.FULL_TASK_ID })) },
        updateTimeRange: ({ id, value }) => { dispatch(updateTimeRangeThunk({ id, value })) },
        setMultiDeleteFSMState: value => { dispatch(updateMultiDeleteFSMThunk({ id: VALID_MULTI_DELETE_IDS.MULTI_DELETE_TASK_EDITOR_ID, value })) },
        addTask: () => { dispatch(addTaskThunkAPI({ userID })) },
    }
    return { childState, childServices }
}
export default useTaskControl