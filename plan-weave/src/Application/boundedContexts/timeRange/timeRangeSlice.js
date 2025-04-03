import { createSlice } from "@reduxjs/toolkit"
import { parse } from "date-fns"
import { VALID_TIMERANGE_IDS } from "../../validIDs"
import { dateToToday, endPlusOne } from "../../../Core/utils/helpers"

const timePickerContext = createSlice({
    name: 'timePickerContext',
    initialState: {
        [VALID_TIMERANGE_IDS.START_TIME_PICKER_ID]: { defaultTime: parse('10:00', 'HH:mm', new Date()).toISOString() },
        [VALID_TIMERANGE_IDS.END_TIME_PICKER_ID]: { defaultTime: parse('23:00', 'HH:mm', new Date()).toISOString() },
    }, // { [id]: { defaultTime: 'HH:MM' }}
    reducers: {
        setDefaultTime: (state, action) => {
            const { id, value } = action.payload
            if (Object.values(VALID_TIMERANGE_IDS).includes(id)) { state[id].defaultTime = value }
        },
        refreshTimePickers: (state, action) => { // Update start to be for today and end to be for today if no owl, and end is tomorrow if owl
            const { isOwl } = action.payload
            const { START_TIME_PICKER_ID, END_TIME_PICKER_ID } = VALID_TIMERANGE_IDS
            const oldStart = state[START_TIME_PICKER_ID].defaultTime, oldEnd = state[END_TIME_PICKER_ID].defaultTime
            state[START_TIME_PICKER_ID].defaultTime = dateToToday(oldStart)
            state[END_TIME_PICKER_ID].defaultTime = isOwl ? endPlusOne(oldEnd) : dateToToday(oldEnd)
        }
    }
})
export const { setDefaultTime, refreshTimePickers } = timePickerContext.actions
export default timePickerContext.reducer