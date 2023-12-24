// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit'
import globalTasks from './globalTasksSlice.js'
import taskEditor from './taskEditorSlice.js' 

const rootReducer = combineReducers({
  taskEditor: taskEditor, 
  globalTasks: globalTasks,
})

export default rootReducer