// reducers/taskReducer.js
import { createSlice } from '@reduxjs/toolkit'
import { parse, parseISO } from 'date-fns'
import { SORTING_METHODS } from '../../components/utils/constants.js'
import { relativeSortIndex, rearrangeDnD, dateToToday, hoursToMillis } from '../../components/utils/helpers.js'

const initialState = {
	search: '',
	timeRange: {
		start: parse('18:00', 'HH:mm', new Date()).toISOString(), // Initial Start Date 
		end: parse('01:00', 'HH:mm', new Date()).toISOString(), // Initial End Date
	},
	owl: true,
	highlighting: false,
	selectedTasks: [], // initialized by Task Control on initial mount, and updated by Task Row
	sortingAlgo: 'timestamp',
	page: 1, // what page the user is currently on. Starts at 1
	tasksPerPage: 10,
	taskTransition: [0, 0], // Used to keep dnd config in sync when completing/incompleting a task
	tasks: [],
	fullTask: false, // Used to show Full tasks or Simple Tasks
}
// Extracted because CompleteTask Reducer uses this logic
const editTaskReducer = (state, action) => {
	if (state.tasks.length >= 1000) return
	const { id, updatedTask } = action?.payload || { 0: -1, 1: -1 }
	const taskIndex = state?.tasks?.findIndex(task => task?.id === id)
	if (taskIndex !== -1) state.tasks[taskIndex] = updatedTask // Edit a task by ID
}

const taskEditorSlice = createSlice({
	name: 'taskEditor',
	initialState,
	reducers: {

		updateSearch: (state, action) => {
			if (action.payload === state.search) return // if it is the same as before, don't update state!
			state.search = action.payload.trim() // assuming action.payload is the new search value
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
		updateSortingAlgorithm: (state, action) => {
			// updates sorting algorithm, then sorts local tasks
			const selectedAlgorithm = action.payload.toLowerCase().trim()
			if (selectedAlgorithm === state.sortingAlgo) return // If it is the same as before, don't update state!!
			if (Object.keys(SORTING_METHODS).includes(selectedAlgorithm)) {
				state.sortingAlgo = selectedAlgorithm
				const sortedTasks = SORTING_METHODS[selectedAlgorithm](state.tasks)
				state.tasks = sortedTasks
			} else state.sortingAlgo = ''
		},
		updatePage: (state, action) => {
			state.page = Math.abs(parseInt(action.payload, 10)) || 1 // default to 1 if invalid page given
		},
		prevPage: (state) => {
			state.page = Math.abs(parseInt(state.page, 10) - 1) || 1 // default to 1 if subtracting 1 gives 0
		},
		nextPage: (state) => {
			const len = state.tasks.length || 1 // if 0 length, then 1
			const maxPage = Math.ceil(len / state.tasksPerPage)
			const newPageNumber = Math.abs(parseInt(state.page, 10) + 1) || 1 // no matter what is done, it will always be atleast 1
			state.page = newPageNumber > maxPage ? maxPage : newPageNumber
		},
		updateTasksPerPage: (state, action) => {
			state.tasksPerPage = Math.abs(parseInt(action.payload, 10)) || 10 // default to 10 if bad values provided
		},
		refresh: (state) => {
			/* 
				1. update start to be for today and end to be for today if no owl, and tomorrow if owl
				2. update every task in the task list to have timestamp for today but with it's hours
			*/
			const endPlusOne = old => new Date(dateToToday(parseISO(old['end'])).getTime() + hoursToMillis(24))
			const owl = state.owl
			const oldTimeRange = state.timeRange
			const oldTasks = state.tasks
			state.timeRange = {
				start: dateToToday(parseISO(oldTimeRange['start'])).toISOString(),
				end: owl
					? endPlusOne(oldTimeRange).toISOString()
					: dateToToday(parseISO(oldTimeRange['end'])).toISOString()
			}
			state.tasks = oldTasks.map(task => (
				{
					...task,
					timestamp: dateToToday(new Date(task.timestamp)).getTime() / 1000 // timestamp in Epoch for now until ISO version update
				}
			))
		},
		updateDnD: (state, action) => {
			const [source, destination] = action.payload
			const taskList = Array.from(state.tasks)
			state.tasks = rearrangeDnD(taskList, source, destination)
		}, // given source, destination, it automatically updates local redux tasks
		fullToggle: (state) => {
			state.fullTask = !state.fullTask
		},


		updateTasks: (state, action) => {
			state.tasks = action.payload
		}, // lets you change all tasks at once
		addTask: (state, action) => {
			state.tasks = [action.payload, ...state.tasks] // Add a new task to the state
		},
		deleteTask: (state, action) => {
			const taskId = action.payload
			state.tasks = state?.tasks?.map(task => task?.id && task?.id === taskId ? { ...task, hidden: true } : task)
		},
		deleteTasks: (state, action) => {
			const idsToDelete = action.payload
			state.tasks = state?.tasks?.map(task => task?.id && idsToDelete.includes(task?.id) ? { ...task, hidden: true } : task)
		},
		editTask: editTaskReducer,
		completeTask: (state, action) => {
			editTaskReducer(state, action)
			const { id, index } = action.payload
			const sortingFunction = SORTING_METHODS[state.sortingAlgo]
			const taskList = Array.from(state.tasks)
			const destination = relativeSortIndex(taskList, sortingFunction, id)

			state.tasks = rearrangeDnD(taskList, index, destination)
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
	prevPage,
	nextPage,
	refresh,
	updateTasksPerPage,
	fullToggle,
	updateTasks, addTask, deleteTask, deleteTasks, editTask, completeTask } = taskEditorSlice.actions
export default taskEditorSlice.reducer