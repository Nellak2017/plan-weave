import { createSlice } from '@reduxjs/toolkit'

const timestamp = Math.floor((new Date()).getTime() / 1000)
const due = '2023-12-27T21:00:00.000Z'
const initialState = {
	tasks: [

		{ status: 'incomplete', task: 'Eat', ttc: 1, id: 1, timestamp: timestamp, dueDate: due },
		{ status: 'incomplete', task: 'Meal Prep', ttc: .1, id: 2, timestamp: timestamp - 1, dueDate: due },
		{ status: 'incomplete', task: 'Shower+', ttc: .5, id: 3, timestamp: timestamp - 2, dueDate: due },
		{ status: 'incomplete', task: 'Clean', ttc: 1, id: 4, timestamp: timestamp - 3, dueDate: due },
		{ status: 'incomplete', task: 'Driving Practice', ttc: 1.5, id: 5, timestamp: timestamp - 4, dueDate: due },
		{ status: 'incomplete', task: 'Plan Weave', ttc: 2, id: 6, timestamp: timestamp - 5, dueDate: due },
		{ status: 'incomplete', task: 'Walk', ttc: 1, id: 7, timestamp: timestamp - 6, dueDate: due },
		{ status: 'incomplete', task: 'Clojure / Backend study', ttc: 1.5, id: 9, timestamp: timestamp - 9, dueDate: due },
		/*
		{ status: 'incomplete', task: 'br', ttc: .5, id: 10, timestamp: timestamp - 10, dueDate: due },
		{ status: 'incomplete', task: 'Cyber : Practice', ttc: 1, id: 11, timestamp: timestamp - 11, dueDate: due },
		{ status: 'incomplete', task: 'Calculator Custom Formulas', ttc: .75, id: 12, timestamp: timestamp - 12, dueDate: due },
		
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
  
  export const { 
	updateGlobalTasks,
	addGlobalTask, 
	deleteGlobalTask,
	deleteGlobalTasks,
	editGlobalTask,
 } = globalTasksSlice.actions
  export default globalTasksSlice.reducer