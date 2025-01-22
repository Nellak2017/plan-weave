import { createSlice } from '@reduxjs/toolkit'

const globalTasksSlice = createSlice({
	name: 'globalTasks',
	initialState: { tasks: [] }, // TODO: Remove this
	reducers: {
		updateGlobalTasks: (state, action) => { state.tasks = action.payload }, // lets you change all global tasks at once
		addGlobalTask: (state, action) => { state.tasks = [action.payload, ...state.tasks] },// Add a new task to the state
		deleteGlobalTask: (state, action) => { state.tasks = state?.tasks?.map(task => task?.id && task?.id === action.payload ? { ...task, hidden: true } : task) },
		deleteGlobalTasks: (state, action) => { state.tasks = state?.tasks?.map(task => task?.id && action.payload.includes(task?.id) ? { ...task, hidden: true } : task) },
		editGlobalTask: (state, action) => {
			if (state.tasks.length >= 1000) {
				console.warn('You cant make more than 1000 tasks')
				return
			}
			const { id, updatedTask } = action?.payload || { 0: -1, 1: -1 }
			const taskIndex = state?.tasks?.findIndex(task => task?.id === id)
			if (taskIndex !== -1) state.tasks[taskIndex] = updatedTask // Edit a task by ID
		},
	},
})
export const { updateGlobalTasks, addGlobalTask, deleteGlobalTask, deleteGlobalTasks, editGlobalTask, } = globalTasksSlice.actions
export default globalTasksSlice.reducer