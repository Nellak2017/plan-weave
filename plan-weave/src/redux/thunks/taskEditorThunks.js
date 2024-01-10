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

import {
  updateGlobalThreads,
	addGlobalThread,
	deleteGlobalThread,
	deleteGlobalThreads,
} from '../reducers/globalThreadsSlice.js'

import { 
  addTask as addTaskAPI,
  updateTask as updateTaskAPI,
  deleteTasks as deleteTasksAPI,
} from '../../../firebase/firebase_controller.js'

// --- Thunks for manipulating all the Threads
export const updateGlobalThreadsThunk = (threads) => (dispatch) => {
  try {
    dispatch(updateGlobalThreads(threads))
  } catch (e) {
    console.error(e)
    toast.error('Failed to update global threads')
  }
}

export const addGlobalThreadThunk = (thread) => (dispatch) => {
  try {
    dispatch(addGlobalThread(thread))
  } catch (e) {
    console.error(e)
    toast.error('Failed to add global thread')
  }
}

export const deleteGlobalThreadThunk = (thread) => (dispatch) => {
  try {
    dispatch(deleteGlobalThread(thread))
  } catch (e) {
    console.error(e)
    toast.error('Failed to delete global thread')
  }
}

export const deleteGlobalThreadsThunk = (threads) => (dispatch) => {
  try {
    dispatch(deleteGlobalThreads(threads))
  } catch (e) {
    console.error(e)
    toast.error('Failed to delete global threads')
  }
}

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
export const addNewTaskThunk = (task, userId) => (dispatch) => {
  try {
    addTaskAPI(task, userId) // POST here
    dispatch(addGlobalTask(task))
    dispatch(addTask(task))
    toast.info('You added a New Default Task')
  } catch (e) {
    console.error(e)
    toast.error('Failed to add new task')
  }
}

export const removeTaskThunk = (taskId, userId) => (dispatch) => {
  try {
    deleteTasksAPI(taskId, userId) // DELETE here
    dispatch(deleteGlobalTask(taskId))
    dispatch(deleteTask(taskId))
    toast.info('This Task was deleted')
  } catch (e) {
    console.error(e)
    toast.error('The Task failed to be deleted')
  }
}

export const removeTasksThunk = (taskIdList, userId) => (dispatch) => {
  try {
    deleteTasksAPI(taskIdList, userId) // DELETE here
    dispatch(deleteGlobalTasks(taskIdList))
    dispatch(deleteTasks(taskIdList))
    toast.info('The tasks were deleted')
  } catch (e) {
    console.error(e)
    toast.error('The Tasks failed to be deleted')
  }
}

export const updateTaskThunk = (taskId, updatedTask, userId) => (dispatch) => {
  try {
    updateTaskAPI(updatedTask, userId) // PATCH here
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
    // PATCH here
    dispatch(completeTask({ id: taskId, updatedTask, index }))
  } catch (e) {
    console.error(e)
    toast.error('The Task failed to complete or incomplete')
  }
}