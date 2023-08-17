// reducers/taskReducer.js
import { createSlice } from '@reduxjs/toolkit'

import { Timestamp } from 'firebase/firestore'
const timestamp = Timestamp.fromDate(new Date()).seconds // used for testing purposes

const initialState = {
	tasks: [
		{ status: 'completed', task: 'AAA', waste: 2, ttc: 5, eta: '15:30', id: 1, timestamp: timestamp },
		{ status: 'incomplete', task: 'CCC', waste: 1, ttc: 2, eta: '18:30', id: 2, timestamp: timestamp + 1 },
		{ status: 'waiting', task: 'DDD', waste: 2, ttc: 5, eta: '23:30', id: 3, timestamp: timestamp + 3 },
		{ status: 'inconsistent', task: 'BBB', waste: 1, ttc: 2, eta: '01:30', id: 4, timestamp: timestamp + 2 },
		{ status: 'completed', task: 'old', waste: 1, ttc: 2, eta: '01:30', id: 5, timestamp: timestamp - 86400 },
		{ status: 'completed', task: 'AAA', waste: 2, ttc: 5, eta: '15:30', id: 6, timestamp: timestamp },
		{ status: 'incomplete', task: 'CCC', waste: 1, ttc: 2, eta: '18:30', id: 7, timestamp: timestamp + 1 },
		{ status: 'waiting', task: 'DDD', waste: 2, ttc: 5, eta: '23:30', id: 8, timestamp: timestamp + 3 },
		{ status: 'inconsistent', task: 'BBB', waste: 1, ttc: 2, eta: '01:30', id: 9, timestamp: timestamp + 2 },
		{ status: 'completed', task: 'old', waste: 1, ttc: 2, eta: '01:30', id: 10, timestamp: timestamp - 86400 },
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