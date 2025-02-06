import { setDefaultTime } from './timeRangeSlice.js'
import { VALID_TIMERANGE_IDS } from '../../validIDs.js'
import { getTime } from 'date-fns'

// TODO: Implement the check time range thing properly
export const checkTimeRangeThunk = ({ startTime, endTime, isOwl, toast, id = VALID_TIMERANGE_IDS.END_TIME_PICKER_ID, }) => dispatch => {
    if ((getTime(endTime) < getTime(startTime)) && !isOwl) {
        dispatch(setDefaultTime({ id, value: startTime.toISOString() }))
        toast.warn('End time cannot be less than start time. End time is set to start time.')
    }
} // Reducer + Business Logic + Side-effects
export const updateTimeRangeThunk = ({ id, value }) => dispatch => { dispatch(setDefaultTime({ id, value: value.toISOString() })) } // Reducer + Business Logic