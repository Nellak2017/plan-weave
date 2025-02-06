import { createSlice } from "@reduxjs/toolkit"
import { VALID_TOGGLE_IDS } from '../../validIDs.js'

const toggleContext = createSlice({
    name: 'toggleContext',
    initialState: { [VALID_TOGGLE_IDS.OWL_ID]: { toggleState: false }, [VALID_TOGGLE_IDS.FULL_TASK_ID]: { toggleState: false }, },
    reducers: {
        toggleState: (state, action) => {
            const { id } = action.payload
            if (Object.values(VALID_TOGGLE_IDS).includes(id)) { state[id].toggleState = !state[id].toggleState }
        },
    }
})
export const { toggleState } = toggleContext.actions
export default toggleContext.reducer