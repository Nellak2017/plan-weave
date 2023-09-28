// reducers/taskReducer.js
import { createSlice } from '@reduxjs/toolkit'

import { Timestamp } from 'firebase/firestore'
const timestamp = Timestamp.fromDate(new Date()).seconds // used for testing purposes

const initialState = {
	tasks: [
		{ status: 'incomplete', task: 'Shower +', ttc: .5, id: 1, timestamp: timestamp }, 
		{ status: 'incomplete', task: 'Lunch Break', ttc: .5, id: 2, timestamp: timestamp - 1 }, 
		//{ status: 'incomplete', task: 'Lunch', ttc: .5, id: 3, timestamp: timestamp - 2 },
		{ status: 'incomplete', task: 'Span: Study, Mindtap, Discussion', ttc: 1, id: 4, timestamp: timestamp - 3 },
		{ status: 'incomplete', task: 'ML: Study, A5', ttc: 1.5, id: 5, timestamp: timestamp - 4 },
		{ status: 'incomplete', task: 'Cyber: Text 2-5, Slides, Flash, Lectures 3x, A2', ttc: 1.5, id: 6, timestamp: timestamp - 5 },
		{ status: 'incomplete', task: 'SE II:  Review Lecture, Study, A2', ttc: 1.5, id: 7, timestamp: timestamp - 6 },
		/*
		{ status: 'incomplete', task: 'Cyber - text 2-5, fl, a2, slide, lect.', ttc: 2, id: 9, timestamp: timestamp - 9 },
		{ status: 'incomplete', task: 'break', ttc: .75, id: 10, timestamp: timestamp - 10 },
		{ status: 'incomplete', task: 'ML - A5, Study', ttc: 1.5, id: 11, timestamp: timestamp - 11 },
		{ status: 'incomplete', task: 'SE II - Study, Lectures, A2, Project', ttc: 1.5, id: 12, timestamp: timestamp - 12 },
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
			state.tasks = state?.tasks?.map(task => task?.id && task?.id === action.payload ? {...task, hidden: true} : task)
		},
		deleteTasks: (state, action) => {
			const idsToDelete = action.payload
			state.tasks = state?.tasks?.map(task => task?.id && idsToDelete.includes(task?.id) ? {...task, hidden: true} : task)
		},
		editTask: (state, action) => {
			if (state.tasks.length >= 1000) return
			const { id, updatedTask } = action?.payload || {0:-1, 1:-1} // TODO: poor default, think of better later
			const taskIndex = state?.tasks?.findIndex(task => task?.id === id)
			if (taskIndex !== -1) {
				state.tasks[taskIndex] = updatedTask // Edit a task by ID
			}
		},
	},
})

export const { addTask, deleteTask, deleteTasks, editTask } = taskSlice.actions
export default taskSlice.reducer