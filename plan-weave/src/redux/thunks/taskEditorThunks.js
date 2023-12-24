import {
  updateTimeRange,
  updateOwl,
  updateSortingAlgorithm,

  addTask,
  deleteTask,
  deleteTasks,
  editTask,
  completeTask,
} from '../reducers/taskEditorSlice'

// Thunks for misc other
export const updateTimeRangeThunk = (start, end) => (dispatch) => {
  // do necessary logic here, like API/DB calls
  dispatch(updateTimeRange({ start, end }))
}

export const updateOwlThunk = () => (dispatch) => {
  dispatch(updateOwl())
}

export const updateSortingAlgorithmThunk = (sortingAlgo) => (dispatch) => {
  dispatch(updateSortingAlgorithm(sortingAlgo))
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
}

export const completedTaskThunk = (taskId, updatedTask, index) => (dispatch) => {
  // Same as updateTaskThunk, but with extra logic for completing tasks, like dnd config updates and source update for taskTable
  dispatch(completeTask({ id: taskId, updatedTask, index }))
}