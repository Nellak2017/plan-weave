import { createSlice } from "@reduxjs/toolkit"

const VALID_PAGINATION_IDS = { PAGINATION_TASK_EDITOR: 'paginationTaskEditor' }

const paginationContext = createSlice({
    name: 'paginationContext',
    initialState: {
        [VALID_PAGINATION_IDS.PAGINATION_TASK_EDITOR]: { pageNumber: 1, tasksPerPage: 10, },
    },
    reducers: {
        previousPage: (state, action) => {
            const { id } = action.payload
            if (Object.keys(VALID_PAGINATION_IDS).includes(id)) { state[id].pageNumber = state[id].pageNumber - 1 }
        },
        nextPage: (state, action) => {
            const { id } = action.payload
            if (Object.keys(VALID_PAGINATION_IDS).includes(id)) { state[id].pageNumber = state[id].pageNumber + 1 }
        },
        setPage: (state, action) => {
            const { id, value } = action.payload
            if (Object.keys(VALID_PAGINATION_IDS).includes(id)) { state[id].pageNumber = value }
        },
        setTasksPerPage: (state, action) => {
            const { id, value } = action.payload
            if (Object.keys(VALID_PAGINATION_IDS).includes(id)) { state[id].tasksPerPage = value }
        }
    }
})
export const { previousPage, nextPage, setPage, setTasksPerPage } = paginationContext.actions
export default paginationContext.reducer