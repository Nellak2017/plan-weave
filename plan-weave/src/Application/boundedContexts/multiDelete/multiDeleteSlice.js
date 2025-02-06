import { createSlice } from "@reduxjs/toolkit"
import { VALID_MULTI_DELETE_IDS } from '../../validIDs.js'
import { getDefaultState } from '../../../UI/molecules/MultipleDeleteButton/MultipleDeleteButton.fsm.js'
// TODO: Move FSM logic to app so linear dependencies are preserved

const multiDeleteContext = createSlice({ // component internal fsm handles business logic so all we need is valid initial state
    name: 'multiDeleteContext',
    initialState: { [VALID_MULTI_DELETE_IDS.MULTI_DELETE_TASK_EDITOR_ID]: { fsmControlledState: getDefaultState() }, },
    reducers: {
        updateFsmControlledState: (state, action) => {
            const { id, value } = action.payload
            if (Object.values(VALID_MULTI_DELETE_IDS).includes(id)) { state[id].fsmControlledState = value }
        }
    }
})
export const { updateFsmControlledState } = multiDeleteContext.actions
export default multiDeleteContext.reducer