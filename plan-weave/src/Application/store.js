import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { reducers } from './reducers.js'

const reducer = combineReducers(reducers)
const store = configureStore({ reducer })
export const setupStore = (preloadedState = {}) => configureStore({ reducer, preloadedState })
export default store