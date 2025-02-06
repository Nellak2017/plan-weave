import { createSlice } from "@reduxjs/toolkit"
import { parse } from "date-fns"
import { VALID_TIMERANGE_IDS } from "../../validIDs"

const timePickerContext = createSlice({
    name: 'timePickerContext',
    initialState: {
        [VALID_TIMERANGE_IDS.START_TIME_PICKER_ID]: { defaultTime: parse('14:20', 'HH:mm', new Date()).toISOString() },
        [VALID_TIMERANGE_IDS.END_TIME_PICKER_ID]: { defaultTime: parse('01:00', 'HH:mm', new Date()).toISOString() },
    }, // { [id]: { defaultTime: 'HH:MM' }}
    reducers: {
        setDefaultTime: (state, action) => {
            const { id, value } = action.payload
            if (Object.values(VALID_TIMERANGE_IDS).includes(id)) { state[id].defaultTime = value }
        },
    }
})
export const { setDefaultTime } = timePickerContext.actions
export default timePickerContext.reducer