import { createSlice } from "@reduxjs/toolkit"
import { VALID_SEARCH_IDS } from '../../validIDs.js'
const searchContext = createSlice({
    name: 'searchContext', initialState: {[VALID_SEARCH_IDS.SEARCH_TASK_EDITOR_ID] : { searchValue: '' }},
    reducers: {
        setSearchValue: (state, action) => {
            const { id, value } = action.payload
            if (Object.values(VALID_SEARCH_IDS).includes(id)) { state[id].searchValue = value }
        }
    }
})
export const { setSearchValue } = searchContext.actions
export default searchContext.reducer