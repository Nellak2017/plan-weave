import { createSlice } from "@reduxjs/toolkit"
import { clamp } from '../../../Core/utils/helpers.js'
import { VALID_PAGINATION_IDS } from '../../validIDs.js'

const paginationContext = createSlice({
    name: 'paginationContext',
    initialState: { [VALID_PAGINATION_IDS.PAGINATION_TASK_EDITOR]: { pageNumber: 1, tasksPerPage: 10, }, },
    reducers: { // We assume the min is 1 for the whole app
        previousPage: (state, action) => {
            const { id, max } = action.payload
            if (Object.values(VALID_PAGINATION_IDS).includes(id)) { state[id].pageNumber = clamp(state[id].pageNumber - 1, 1, max) }
        },
        nextPage: (state, action) => {
            const { id, max } = action.payload
            if (Object.values(VALID_PAGINATION_IDS).includes(id)) { state[id].pageNumber = clamp(state[id].pageNumber + 1, 1, max) }
        },
        setPage: (state, action) => {
            const { id, value, max } = action.payload
            if (Object.values(VALID_PAGINATION_IDS).includes(id)) { state[id].pageNumber = clamp(value, 1, max) }
        },
        setTasksPerPage: (state, action) => {
            const { id, value, min = 10, max } = action.payload
            if (Object.values(VALID_PAGINATION_IDS).includes(id)) { state[id].tasksPerPage = clamp(value, min, max) }
        }
    }
})
export const { previousPage, nextPage, setPage, setTasksPerPage } = paginationContext.actions
export default paginationContext.reducer