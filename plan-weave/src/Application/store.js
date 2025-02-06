import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './index.js'
const store = configureStore({ reducer: rootReducer, })
export const setupStore = (preloadedState = {}) => configureStore({ reducer: rootReducer, preloadedState })
export default store