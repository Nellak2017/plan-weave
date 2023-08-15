// reducers/taskReducer.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	tasks: [
		{ status: 'completed', waste: 2, ttc: 5, eta: '15:30', id: 1 },
		{ status: 'incomplete', task: 'Example Task 2', waste: 1, ttc: 2, eta: '18:30', id: 2 },
		{ status: 'waiting', waste: 2, ttc: 5, eta: '23:30', id: 3 },
		{ status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 4 },
	], // Initial state for tasks
	//tasks: []
}

// TODO: Test this reducer 
const taskSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		addTask: (state, action) => {
			state.tasks.push(action.payload) // Add a new task to the state
		},
		deleteTask: (state, action) => {
			state.tasks = state.tasks.filter(task => task.id !== action.payload) // Remove a task by ID
		},
		editTask: (state, action) => {
			const { id, updatedTask } = action.payload
			const taskIndex = state.tasks.findIndex(task => task.id === id)
			if (taskIndex !== -1) {
				state.tasks[taskIndex] = updatedTask // Edit a task by ID
			}
		},
	},
})

export const { addTask, deleteTask, editTask } = taskSlice.actions
export default taskSlice.reducer