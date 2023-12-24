import { SORTING_METHODS } from '../../components/utils/constants'
import {
  updateTimeRange,
  updateOwl,
  updateSortingAlgorithm,

  updateTasks,
  addTask,
  deleteTask,
  deleteTasks,
  editTask,
  completeTask,
} from '../reducers/taskEditorSlice.js'

import {
  updateGlobalTasks,
  addGlobalTask,
  deleteGlobalTask,
  deleteGlobalTasks,
  editGlobalTask,
} from '../reducers/globalTasksSlice.js'

// Thunks for misc other
export const updateTimeRangeThunk = (start, end) => (dispatch) => {
  // do necessary logic here, like API/DB calls
  dispatch(updateTimeRange({ start, end }))
}

export const updateOwlThunk = () => (dispatch) => {
  dispatch(updateOwl())
}

export const updateSortingAlgorithmThunk = (sortingAlgo) => (dispatch) => {
  // Potentially PATCH request here
  dispatch(updateSortingAlgorithm(sortingAlgo))
}

// Thunks for tasks
export const addNewTaskThunk = task => (dispatch) => {
  // POST here
  dispatch(addGlobalTask(task))
  dispatch(addTask(task))
}

export const removeTaskThunk = taskId => (dispatch) => {
  // DELETE here
  dispatch(deleteGlobalTask(taskId))
  dispatch(deleteTask(taskId))
}

export const removeTasksThunk = taskIdList => (dispatch) => {
  // DELETE here
  dispatch(deleteGlobalTasks(taskIdList))
  dispatch(deleteTasks(taskIdList))
}

export const updateTaskThunk = (taskId, updatedTask) => (dispatch) => {
  // You can perform any necessary logic here before dispatching the action
  dispatch(editGlobalTask({ id: taskId, updatedTask }))
  dispatch(editTask({ id: taskId, updatedTask }))
}

export const completedTaskThunk = (taskId, updatedTask, index) => (dispatch) => {
  // Same as updateTaskThunk, but with extra logic for completing tasks, like dnd config updates and source update for taskTable
  dispatch(completeTask({ id: taskId, updatedTask, index }))
}