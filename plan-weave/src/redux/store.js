import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/index'

// Create the Redux store using your taskReducer
const store = configureStore({
	reducer: rootReducer, // Pass the combined reducers object
})

export function setupStore(preloadedState = {}) {
	return configureStore({
		reducer: rootReducer,
		preloadedState
	})
}

export default store