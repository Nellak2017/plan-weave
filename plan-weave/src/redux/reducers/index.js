// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit'
import taskReducer from './taskReducer' // Import the taskReducer
// Import other reducers here

const rootReducer = combineReducers({
  tasks: taskReducer, // Assign the taskReducer to the 'tasks' key
  // Assign other reducers here
})

export default rootReducer