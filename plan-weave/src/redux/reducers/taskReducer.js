// reducers/taskReducer.js
import { createSlice } from '@reduxjs/toolkit'

import { Timestamp } from 'firebase/firestore'
const timestamp = Timestamp.fromDate(new Date()).seconds // used for testing purposes

const initialState = {
	/*
	tasks: [
		{ status: 'completed', task: 'AAA', waste: 2, ttc: null, eta: '15:30', id: 1, timestamp: timestamp },
		{ status: 'incomplete', task: 'CCC', waste: 1, ttc: 2, eta: '18:30', id: 2, timestamp: timestamp + 1 },
		{ status: 'waiting', task: 'DDD', waste: 2, ttc: 5, eta: '23:30', id: 3, timestamp: timestamp + 3 },
		{ status: 'inconsistent', task: 'BBB', waste: 1, ttc: 2, eta: '01:30', id: 4, timestamp: timestamp + 2 },
		{ status: 'completed', task: 'old', waste: 1, ttc: 2, eta: '01:30', id: 5, timestamp: timestamp - 86400 },
		{ status: 'completed', task: 'AAA', waste: 2, ttc: 5, eta: '15:30', id: 6, timestamp: timestamp },
		{ status: 'incomplete', task: 'CCC', waste: 1, ttc: 2, eta: '18:30', id: 7, timestamp: timestamp + 1 },
		{ status: 'waiting', task: 'DDD', waste: 2.1, ttc: 5, eta: '23:30', id: 8, timestamp: timestamp + 3 },
		{ status: 'inconsistent', task: 'BBB', waste: 1, ttc: 2, eta: '01:30', id: 9, timestamp: timestamp + 2 },
		{ status: 'completed', task: 'old', waste: 1, ttc: 2, eta: '01:30', id: 10, timestamp: timestamp - 86400 },
	], // Initial state for tasks
	*/
	tasks: [
		{ status: 'incomplete', task: 'Small Git', ttc: .75, id: 1, timestamp: timestamp }, 
		{ status: 'incomplete', task: 'Cyber - Study, Lab (review)', ttc: .5, id: 2, timestamp: timestamp - 1 }, 
		{ status: 'incomplete', task: 'Ethics - Lib', ttc: 1.5, id: 3, timestamp: timestamp - 2 },
		{ status: 'incomplete', task: 'SE II - Discord Plan, Study', ttc: .75, id: 4, timestamp: timestamp - 3 },
		{ status: 'incomplete', task: 'break', ttc: .75, id: 5, timestamp: timestamp - 4 },
		{ status: 'incomplete', task: 'Span - Mindtap, Disc, Study', ttc: 1.5, id: 6, timestamp: timestamp - 5 },
		{ status: 'incomplete', task: 'ML - A4, Study', ttc: 1.5, id: 7, timestamp: timestamp - 6 },
		{ status: 'incomplete', task: 'break', ttc: .75, id: 9, timestamp: timestamp - 9 },
		{ status: 'incomplete', task: 'Driving', ttc: 1.75, id: 10, timestamp: timestamp - 10 },
		{ status: 'incomplete', task: '', ttc: 1, id: 11, timestamp: timestamp - 11 },
		
		{ status: 'incomplete', task: '', ttc: 1.5, id: 12, timestamp: timestamp - 12 },
		/*
		{ status: 'incomplete', task: '', ttc: .5, id: 13, timestamp: timestamp - 13 },
		{ status: 'incomplete', task: '', ttc: .5, id: 14, timestamp: timestamp - 14 },
		{ status: 'incomplete', task: '', ttc: 1, id: 15, timestamp: timestamp - 15 },
		{ status: 'incomplete', task: '', ttc: 1, id: 16, timestamp: timestamp - 16 },
		{ status: 'incomplete', task: '', ttc: 1, id: 17, timestamp: timestamp - 17 },
		{ status: 'incomplete', task: '', ttc: 2, id: 18, timestamp: timestamp - 18 },
		*/
	]
}

// TODO: Test this reducer 
const taskSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		addTask: (state, action) => {
			state.tasks?.push(action.payload) // Add a new task to the state
		},
		deleteTask: (state, action) => {
			//state.tasks = state?.tasks?.filter(task => task?.id !== action?.payload) // Remove a task by ID
			state.tasks = state?.tasks?.map(task => task?.id && task?.id === action.payload ? {...task, hidden: true} : task)
		},
		deleteTasks: (state, action) => {
			const idsToDelete = action.payload
			state.tasks = state?.tasks?.map(task => task?.id && idsToDelete.includes(task?.id) ? {...task, hidden: true} : task)
		},
		editTask: (state, action) => {
			const { id, updatedTask } = action?.payload
			const taskIndex = state?.tasks?.findIndex(task => task?.id === id)
			if (taskIndex !== -1) {
				state.tasks[taskIndex] = updatedTask // Edit a task by ID
			}
		},
	},
})

export const { addTask, deleteTask, deleteTasks, editTask } = taskSlice.actions
export default taskSlice.reducer