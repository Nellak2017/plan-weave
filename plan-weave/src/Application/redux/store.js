import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/index'
const store = configureStore({ reducer: rootReducer,})
export const setupStore = (preloadedState = {}) => configureStore({ reducer: rootReducer, preloadedState})
export default store