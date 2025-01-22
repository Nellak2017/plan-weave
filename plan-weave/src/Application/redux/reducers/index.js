// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit'
import globalTasks from './globalTasksSlice.js'
import taskEditor from './taskEditorSlice.js'
import globalThreads from './globalThreadsSlice.js'

const rootReducer = combineReducers({
  taskEditor: taskEditor,
  globalTasks: globalTasks,
  globalThreads: globalThreads,
})

export default rootReducer