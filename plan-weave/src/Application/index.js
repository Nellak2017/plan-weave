import { combineReducers } from '@reduxjs/toolkit'
import { multiDelete, pagination, search, sort, timeRange, toggle, tasks, variant, dnd } from './reducers'

// TODO: simplify, add entities and session contexts
const rootReducer = combineReducers({ tasks, variant, multiDelete, pagination, search, sort, timeRange, toggle, dnd })
export default rootReducer
export { multiDelete, pagination, search, sort, timeRange, toggle, tasks, variant, dnd }