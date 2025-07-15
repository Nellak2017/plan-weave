import { createSlice } from "@reduxjs/toolkit"
import { parse } from "date-fns"
import { VALID_TIMERANGE_IDS } from "../../validIDs"
import { dateToToday, endPlusOne } from "../../../Core/utils/helpers"

// TODO: Add feature that lets user update end time and if it is overnight or not and persist it with DB
const timePickerContext = createSlice({
    name: 'timePickerContext',
    initialState: {
        [VALID_TIMERANGE_IDS.END_TIME_PICKER_ID]: { defaultTime: parse('23:00', 'HH:mm', new Date()).toISOString() },
    }, // { [id]: { defaultTime: 'HH:MM' }}
    reducers: {
        setDefaultTime: (state, action) => {
            const { id, value } = action.payload
            if (Object.values(VALID_TIMERANGE_IDS).includes(id)) { state[id].defaultTime = value }
        },
        refreshTimePickers: (state, action) => { // Update end to be for today if no owl, and end is tomorrow if owl
            const { isOwl } = action.payload
            const { END_TIME_PICKER_ID } = VALID_TIMERANGE_IDS
            const oldEnd = state[END_TIME_PICKER_ID].defaultTime
            state[END_TIME_PICKER_ID].defaultTime = isOwl ? endPlusOne(oldEnd) : dateToToday(oldEnd)
        }
    }
})
export const { setDefaultTime, refreshTimePickers } = timePickerContext.actions
export default timePickerContext.reducer