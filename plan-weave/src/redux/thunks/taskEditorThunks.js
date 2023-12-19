import {
  updateTimeRange,
  updateOwl,

  addTask,
  deleteTask,
  deleteTasks,
  editTask
} from '../reducers/taskEditorReducer'

// Thunks for misc other
export const updateTimeRangeThunk = (start, end) => (dispatch) => {
  // do necessary logic here, like API/DB calls
  dispatch(updateTimeRange({ start, end }))
}

export const updateOwlThunk = () => (dispatch) => {
  dispatch(updateOwl())
}

// Thunks for tasks
export const addNewTaskThunk = task => (dispatch) => {
  // You can perform any necessary logic here before dispatching the action
  dispatch(addTask(task))
}

export const removeTaskThunk = taskId => (dispatch) => {
  // You can perform any necessary logic here before dispatching the action
  dispatch(deleteTask(taskId))
}

export const removeTasksThunk = taskIdList => (dispatch) => {
  dispatch(deleteTasks(taskIdList))
}

export const updateTaskThunk = (taskId, updatedTask) => (dispatch) => {
  // You can perform any necessary logic here before dispatching the action
  dispatch(editTask({ id: taskId, updatedTask }))
  console.log("task updated")
}