// reducers/taskReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { parse } from 'date-fns'
import { SORTING_METHODS } from '../../components/utils/constants.js'
import { deleteDnDEvent, relativeSortIndex, rearrangeDnD } from '../../components/utils/helpers.js'

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
	taskTransition: [0, 0], // Used to keep dnd config in sync when completing/incompleting a task
	tasks: []
}
// Extracted because CompleteTask Reducer uses this logic
const editTaskReducer = (state, action) => {
	if (state.tasks.length >= 1000) return
	const { id, updatedTask } = action?.payload || { 0: -1, 1: -1 } // TODO: poor default, think of better later
	const taskIndex = state?.tasks?.findIndex(task => task?.id === id)
	if (taskIndex !== -1) state.tasks[taskIndex] = updatedTask // Edit a task by ID
}

const taskEditorSlice = createSlice({
	name: 'taskEditor',
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

			console.log('old dnd config: ', Array.from(oldDnD))
			console.log('new dnd config: ', state.dndConfig)
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
			editTaskReducer(state, action)
			const { id, index } = action.payload
			const sortingFunction = SORTING_METHODS[state.sortingAlgo]
			const taskList = Array.from(state.tasks)
			const destination = relativeSortIndex(taskList, sortingFunction, id)

			state.taskTransition = [index, destination]
			// Note: You seemingly can't do dnd config update here because proxy revocation when using setTimeOut
			// if you do it normally, the UI won't update. Thus, you must update DnD inside TaskTable.
		}, // This is a special case of editTask. It does: editTask + update Source. 
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