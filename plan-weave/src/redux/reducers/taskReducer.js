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
	tasks: [
		{ status: 'incomplete', task: 'Plan Weave (66-62) / 400', waste: 0, ttc: 2, eta: '15:30', id: 1, timestamp: timestamp},
		{ status: 'incomplete', task: 'Gym', waste: 0, ttc: 1, eta: '18:30', id: 2, timestamp: timestamp - 1 },
		{ status: 'incomplete', task: 'Shower -', waste: 0, ttc: .5, eta: '01:30', id: 3, timestamp: timestamp - 2 },
		{ status: 'incomplete', task: 'Meal Prep - Stir Fry', waste: 0, ttc: 1, eta: '01:30', id: 5, timestamp: timestamp - 4 },
		{ status: 'incomplete', task: 'Spanish - CH P, HW, Duo ', waste: 0, ttc: 1.75, eta: '23:30', id: 10, timestamp: timestamp - 5 },
		{ status: 'incomplete', task: 'Machine Learning - A1, A2', waste: 0, ttc: 1.5, eta: '18:30', id: 8, timestamp: timestamp - 6 },
		{ status: 'incomplete', task: 'Ethics', waste: 0, ttc: 2, eta: '23:30', id: 11, timestamp: timestamp - 7 },
		{ status: 'incomplete', task: 'Cyber Security: Lecture, Ch 1-3, Rev. Linux', waste: 0, ttc: 2, eta: '15:30', id: 6, timestamp: timestamp - 8 },
		{ status: 'incomplete', task: 'Break', waste: 0, ttc: .75, eta: '18:30', id: 9, timestamp: timestamp - 9 },
	]
	*/
	tasks: [
		{ status: 'incomplete', task: 'Breakfast', ttc: 1, id: 1, timestamp: timestamp },
		{ status: 'incomplete', task: 'Plan Weave (66-68)', ttc: 2, id: 2, timestamp: timestamp - 1 },
		{ status: 'incomplete', task: 'Gym', ttc: 1.5, id: 3, timestamp: timestamp - 2 },
		{ status: 'incomplete', task: 'Shower +', ttc: .5, id: 4, timestamp: timestamp - 3 },
		{ status: 'incomplete', task: 'Parking Spot, APT', ttc: .75, id: 5, timestamp: timestamp - 4 },
		{ status: 'incomplete', task: 'Lunch', ttc: .75, id: 6, timestamp: timestamp - 5 },
		{ status: 'incomplete', task: 'Spanish - Ch P, Study, Duo', ttc: 2, id: 7, timestamp: timestamp - 6 },
		{ status: 'incomplete', task: 'Ethics - Quiz 2', ttc: 2, id: 8, timestamp: timestamp - 7 },
		{ status: 'incomplete', task: 'Cyber Security - Ch 1-3, Linux review', ttc: 1, id: 9, timestamp: timestamp - 8 },
		{ status: 'incomplete', task: 'Break', ttc: .75, id: 10, timestamp: timestamp - 9 },
		{ status: 'incomplete', task: 'Machine Learning - Study', ttc: 1, id: 11, timestamp: timestamp - 10 },
		{ status: 'incomplete', task: 'SE 2 - Study', ttc: 1, id: 12, timestamp: timestamp - 11 },
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
		editTask: (state, action) => {
			const { id, updatedTask } = action?.payload
			const taskIndex = state?.tasks?.findIndex(task => task?.id === id)
			if (taskIndex !== -1) {
				state.tasks[taskIndex] = updatedTask // Edit a task by ID
			}
		},
	},
})

export const { addTask, deleteTask, editTask } = taskSlice.actions
export default taskSlice.reducer