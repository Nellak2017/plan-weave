import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/index' 

// Create the Redux store using your taskReducer
const store = configureStore({
	reducer: rootReducer, // Pass the combined reducers object
})

export default store