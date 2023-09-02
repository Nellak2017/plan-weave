import { addTask, deleteTask, deleteTasks, editTask } from '../reducers/taskReducer'

// Thunks for tasks
export const addNewTask = task => (dispatch) => {
  // You can perform any necessary logic here before dispatching the action
  dispatch(addTask(task))
}

export const removeTask = taskId => (dispatch) => {
  // You can perform any necessary logic here before dispatching the action
  dispatch(deleteTask(taskId))
}

export const removeTasks = taskIdList => (dispatch) => {
  dispatch(deleteTasks(taskIdList))
}

export const updateTask = (taskId, updatedTask) => (dispatch) => {
  // You can perform any necessary logic here before dispatching the action
  dispatch(editTask({ id: taskId, updatedTask }))
}