import { toast } from 'react-toastify'
import {
  updateTimeRange,
  updateOwl,
  updateSortingAlgorithm,

  addTask,
  deleteTask,
  deleteTasks,
  editTask,
  completeTask,
} from '../reducers/taskEditorSlice.js'

import {
  addGlobalTask,
  deleteGlobalTask,
  deleteGlobalTasks,
  editGlobalTask,
} from '../reducers/globalTasksSlice.js'

// Thunks for misc other
export const updateTimeRangeThunk = (start, end) => (dispatch) => {
  try {
    // do necessary logic here, like API/DB calls
    dispatch(updateTimeRange({ start, end }))
  } catch (e) {
    console.error(e)
    toast.error('Failed to update Time Range')
  }

}

export const updateOwlThunk = (prev = false) => (dispatch) => {
  // prev is optional for the thunk only. It lets you easily have the text for either case
  try {

    if (prev) {
      toast.info('Overnight Mode is off: Tasks must be scheduled between 12 pm and 12 am. End time must be after the start time.', {
        autoClose: 5000,
      })
    } else {
      toast.info('Overnight Mode is on: You can schedule tasks overnight, and end time can be before the start time.', {
        autoClose: 5000,
      })
    }
    dispatch(updateOwl())
  } catch (e) {
    console.error(e)
    toast.error('Failed to update Owl')
  }
}

export const updateSortingAlgorithmThunk = (sortingAlgo) => (dispatch) => {
  // Potentially PATCH request here
  try {
    dispatch(updateSortingAlgorithm(sortingAlgo))
  } catch (e) {
    console.error(e)
    toast.error('Failed to update sorting algorithm')
  }
}

// Thunks for tasks
export const addNewTaskThunk = task => (dispatch) => {
  try {
    // POST here
    dispatch(addGlobalTask(task))
    dispatch(addTask(task))
    toast.info('You added a New Default Task')
  } catch (e) {
    console.error(e)
    toast.error('Failed to add new task')
  }
}

export const removeTaskThunk = taskId => (dispatch) => {
  try {
    // DELETE here
    dispatch(deleteGlobalTask(taskId))
    dispatch(deleteTask(taskId))
    toast.info('This Task was deleted')
  } catch (e) {
    console.error(e)
    toast.error('The Task failed to be deleted')
  }
}

export const removeTasksThunk = taskIdList => (dispatch) => {
  try {
    // DELETE here
    dispatch(deleteGlobalTasks(taskIdList))
    dispatch(deleteTasks(taskIdList))
    toast.info('The tasks were deleted')
  } catch (e) {
    console.error(e)
    toast.error('The Tasks failed to be deleted')
  }
}

export const updateTaskThunk = (taskId, updatedTask) => (dispatch) => {
  try {
    // You can perform any necessary logic here before dispatching the action
    dispatch(editGlobalTask({ id: taskId, updatedTask }))
    dispatch(editTask({ id: taskId, updatedTask }))
  } catch (e) {
    console.error(e)
    toast.error('The Task failed to update')
  }
}

export const completedTaskThunk = (taskId, updatedTask, index) => (dispatch) => {
  // Same as updateTaskThunk, but with extra logic for completing tasks, like dnd config updates and source update for taskTable
  try {
    dispatch(completeTask({ id: taskId, updatedTask, index }))
    //toast.info('This Task was Completed')
  } catch (e) {
    console.error(e)
    toast.error('The Task failed to complete or incomplete')
  }
}