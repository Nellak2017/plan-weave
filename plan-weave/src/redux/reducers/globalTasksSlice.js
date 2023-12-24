import { createSlice } from '@reduxjs/toolkit'
import { Timestamp } from 'firebase/firestore'

const timestamp = Timestamp.fromDate(new Date()).seconds // used for testing purposes

const initialState = {
	tasks: [

		{ status: 'incomplete', task: 'Eat 1', ttc: .5, id: 1, timestamp: timestamp },
		{ status: 'incomplete', task: 'ML : Flash (Lectures/Study guide)', ttc: 3, id: 2, timestamp: timestamp - 1 },
		{ status: 'incomplete', task: 'br 1', ttc: .5, id: 3, timestamp: timestamp - 2 },
		{ status: 'incomplete', task: 'ML : Written Ass Analysis', ttc: 2, id: 4, timestamp: timestamp - 3 },
		{ status: 'incomplete', task: 'ML : Flash Cards', ttc: 1, id: 5, timestamp: timestamp - 4 },
		{ status: 'incomplete', task: 'br 2', ttc: .75, id: 6, timestamp: timestamp - 5 },
		{ status: 'incomplete', task: 'ML : Note Creation', ttc: .75, id: 7, timestamp: timestamp - 6 },
		{ status: 'incomplete', task: 'ML : Practice Probs', ttc: 1.5, id: 9, timestamp: timestamp - 9 },
		{ status: 'incomplete', task: 'br', ttc: .5, id: 10, timestamp: timestamp - 10 },
		{ status: 'incomplete', task: 'Cyber : Practice', ttc: 1, id: 11, timestamp: timestamp - 11 },
		{ status: 'incomplete', task: 'Calculator Custom Formulas', ttc: .75, id: 12, timestamp: timestamp - 12 },
		/*
		
		{ status: 'incomplete', task: 'br', ttc: 1, id: 13, timestamp: timestamp - 13 },
		{ status: 'incomplete', task: 'ML Videos 16-23', ttc: 1.2, id: 14, timestamp: timestamp - 14 },
		{ status: 'incomplete', task: 'Shower+', ttc: .5, id: 15, timestamp: timestamp - 15 },
		{ status: 'incomplete', task: '', ttc: 1, id: 16, timestamp: timestamp - 16 },
		{ status: 'incomplete', task: '', ttc: 1, id: 17, timestamp: timestamp - 17 },
		{ status: 'incomplete', task: '', ttc: 1, id: 18, timestamp: timestamp - 18 },
		{ status: 'incomplete', task: '', ttc: .5, id: 19, timestamp: timestamp - 18 },
		*/
	]
}

const globalTasksSlice = createSlice({
	name: 'globalTasks',
	initialState,
	reducers: {
		updateGlobalTasks: (state, action) => {
			state.tasks = action.payload
		}, // lets you change all global tasks at once
		addGlobalTask: (state, action) => {
			state.tasks = [action.payload, ...state.tasks] // Add a new task to the state
		},
		deleteGlobalTask: (state, action) => {
			const taskId = action.payload
			state.tasks = state?.tasks?.map(task => task?.id && task?.id === taskId ? { ...task, hidden: true } : task)
		},
		deleteGlobalTasks: (state, action) => {
			const idsToDelete = action.payload
			state.tasks = state?.tasks?.map(task => task?.id && idsToDelete.includes(task?.id) ? { ...task, hidden: true } : task)
		},
		editGlobalTask: (state, action) => {
			if (state.tasks.length >= 1000) return
			const { id, updatedTask } = action?.payload || { 0: -1, 1: -1 }
			const taskIndex = state?.tasks?.findIndex(task => task?.id === id)
			if (taskIndex !== -1) state.tasks[taskIndex] = updatedTask // Edit a task by ID
		},
	},
  })
  
  export const { 
	updateGlobalTasks,
	addGlobalTask, 
	deleteGlobalTask,
	deleteGlobalTasks,
	editGlobalTask,
 } = globalTasksSlice.actions
  export default globalTasksSlice.reducer