import { createSlice } from "@reduxjs/toolkit"
import { SORTING_METHODS } from "../../../Core/utils/constants"
import { VALID_SORT_IDS } from '../../validIDs.js'

const sortContext = createSlice({
    name: 'sortContext', initialState: {[VALID_SORT_IDS.SORT_TASK_EDITOR]: { sortAlgorithm: ''},},
    reducers: {
        updateSortingAlgorithm: (state, action) => {
            const { id, value } = action.payload
            if (Object.values(VALID_SORT_IDS).includes(id) && Object.keys(SORTING_METHODS).includes(value)) { state[id].sortAlgorithm = value }
        }
    }
})
export const { updateSortingAlgorithm } = sortContext.actions
export default sortContext.reducer