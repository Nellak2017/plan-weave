import { previousPage, nextPage, setPage, setTasksPerPage } from './paginationSlice.js'
import { refreshTasks } from '../../entities/tasks/tasks.js'
import { refreshTimePickers } from '../timeRange/timeRangeSlice.js'

export const previousPageThunk = ({ id, max }) => dispatch => { dispatch(previousPage({ id, max })) } // Reducer + Business Logic
export const nextPageThunk = ({ id, max }) => dispatch => { dispatch(nextPage({ id, max })) } // Reducer + Business Logic
export const setPageThunk = ({ id, value, max }) => dispatch => { dispatch(setPage({ id, value, max })) } // Reducer + Business Logic
export const setTasksPerPageThunk = ({ id, value, min, max }) => dispatch => { dispatch(setTasksPerPage({ id, value, min, max })) } // Reducer + Business Logic
export const refreshPaginationThunk = ({ isOwl }) => dispatch => {
    dispatch(refreshTimePickers({ isOwl }))
    dispatch(refreshTasks())
} // 2 Reducers + Business Logic (No API yet)