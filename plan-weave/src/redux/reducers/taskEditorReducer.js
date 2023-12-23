// reducers/taskReducer.js
import { createSlice } from '@reduxjs/toolkit'
import { parse } from 'date-fns'
import { SORTING_METHODS } from '../../components/utils/constants'
import { Timestamp } from 'firebase/firestore'
import { deleteDnDEvent } from '../../components/utils/helpers.js'

const timestamp = Timestamp.fromDate(new Date()).seconds // used for testing purposes

const initialState = {
	search: '',
	timeRange: {
		start: parse('00:00', 'HH:mm', new Date()).toISOString(), // Initial Start Date 
		end: parse('17:00', 'HH:mm', new Date()).toISOString(), // Initial End Date
	},
	owl: true,
	highlighting: false,
	selectedTasks: [], // initialized by Task Control on initial mount, and updated by Task Row
	dndConfig: [], // initialized by Task Table on initial mount, and reset by Task Table anytime sorting algo changes
	sortingAlgo: 'timestamp',
	page: 1, // what page the user is currently on. Starts at 1
	tasksPerPage: 10,
	source: [0, 'undefined'], // what is the source of completed/incompleted tasks? Used to keep dnd config in sync when completing/incompleting a task
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
// Extracted because CompleteTask Reducer uses this logic
const editTaskReducer = (state, action) => {
	if (state.tasks.length >= 1000) return
	const { id, updatedTask } = action?.payload || { 0: -1, 1: -1 } // TODO: poor default, think of better later
	const taskIndex = state?.tasks?.findIndex(task => task?.id === id)
	if (taskIndex !== -1) state.tasks[taskIndex] = updatedTask // Edit a task by ID
}

const taskEditorSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {

		updateSearch: (state, action) => {
			state.search = action.payload.trim() // assuming action.payload is the new search value
			console.log("Updated Search: ", state.search)
		},
		updateTimeRange: (state, action) => {
			const { start, end } = action.payload
			state.timeRange = {
				start: start !== undefined ? start : state.timeRange.start,
				end: end !== undefined ? end : state.timeRange.end,
			}
		},
		updateOwl: (state, _) => {
			state.owl = !state.owl
		},
		updateHighlighting: (state, _) => {
			state.highlighting = !state.highlighting
		},
		updateSelectedTasks: (state, action) => {
			state.selectedTasks = action.payload
		},
		updateDnD: (state, action) => {
			state.dndConfig = action.payload
		},
		updateSortingAlgorithm: (state, action) => {
			const selectedAlgorithm = action.payload.toLowerCase().trim()
			if (Object.keys(SORTING_METHODS).includes(selectedAlgorithm)) state.sortingAlgo = selectedAlgorithm
			else state.sortingAlgo = ''
		},
		updatePage: (state, action) => {
			state.page = Math.abs(parseInt(action.payload, 10)) || 1 // default to 1 if bad values are provided
		},
		updateTasksPerPage: (state, action) => {
			state.tasksPerPage = Math.abs(parseInt(action.payload, 10)) || 10 // default to 10 if bad values provided
		},


		addTask: (state, action) => {
			const oldDnD = state.dndConfig
			state.tasks?.push(action.payload) // Add a new task to the state
			state.dndConfig = [0, ...oldDnD.map(el => el + 1)] // Must be updated on every add, to maintain the invariants for dnd config
		},
		deleteTask: (state, action) => {
			const taskId = action.payload
			const oldDnD = state.dndConfig // Must be updated on every delete, to maintain the invariants for dnd config
			state.tasks = state?.tasks?.map(task => task?.id && task?.id === taskId ? { ...task, hidden: true } : task)
			const taskIndex = state?.tasks?.findIndex(task => task?.id === taskId)
			if (taskIndex >= 0) state.dndConfig = deleteDnDEvent(oldDnD, [taskIndex, taskIndex])
			
			console.log('old dnd config: ',Array.from(oldDnD))
			console.log('new dnd config: ',state.dndConfig)
		},
		deleteTasks: (state, action) => {
			const idsToDelete = action.payload
			const oldDnD = state.dndConfig // Must be updated on every delete, to maintain the invariants for dnd config
			const startIndex = state.tasks.findIndex(task => task?.id === idsToDelete[0])
			const endIndex = state.tasks.findIndex(task => task?.id === idsToDelete[idsToDelete.length - 1])
			state.tasks = state?.tasks?.map(task => task?.id && idsToDelete.includes(task?.id) ? { ...task, hidden: true } : task)
			if (startIndex >= 0 && endIndex >= 0) state.dndConfig = deleteDnDEvent(oldDnD, [startIndex, endIndex])
		},
		editTask: editTaskReducer,
		completeTask: (state, action) => {
			console.log("completed task reducer")
			editTaskReducer(state, action)
			const oldDnD = state.dndConfig // Must be updated on every completion/incompletion, to maintain the invariants for dnd config
			const { updatedTask, index } = action.payload
			const newStatus = updatedTask?.status
			// Update Source: [index, "Completed"||"Incomplete"]
			state.source = [index, newStatus]
			// Update DnD Config
			// TODO: update DnD Config based on Relative Sorted Order Algorithm

		}, // This is a special case of editTask. It does: editTask + update Source + update DnD config. 
		// This is so that TaskTable only has to listen to source updates and update Local tasks Only when source updates (DnD config auto taken care of)
	},
})

export const {
	updateSearch,
	updateTimeRange,
	updateOwl,
	updateHighlighting,
	updateSelectedTasks,
	updateDnD,
	updateSortingAlgorithm,
	updatePage,
	updateTasksPerPage,
	addTask, deleteTask, deleteTasks, editTask, completeTask } = taskEditorSlice.actions
export default taskEditorSlice.reducer