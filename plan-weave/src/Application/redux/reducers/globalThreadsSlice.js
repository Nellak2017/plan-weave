import { createSlice } from '@reduxjs/toolkit'

const initialState = { threads: ['default'] }
const globalThreadsSlice = createSlice({
	name: 'globalThreads',
	initialState,
	reducers: {
		updateGlobalThreads: (state, action) => {
			if (action.payload.length >= 1000) {
				console.warn('You cant make more than 1000 threads')
				return
			}
			state.threads = action.payload
		}, // lets you change all global threads at once
		addGlobalThread: (state, action) => {
			console.log('add global thread')
			if (state.threads.includes(action.payload)) return // don't add duplicates!
			if (state?.threads.length >= 1000) {
				console.warn('You cant make more than 1000 threads')
				return
			}
			console.log([action.payload, ...state.threads])
			state.threads = [action.payload, ...state.threads] // Add a new thread to the state
		},
		deleteGlobalThread: (state, action) => { state.threads = state?.threads?.filter(thread => thread !== action.payload) },
		deleteGlobalThreads: (state, action) => { state.threads = state?.threads?.filter(thread => !action.payload.includes(thread)) },
	},
})

export const { updateGlobalThreads, addGlobalThread, deleteGlobalThread, deleteGlobalThreads, } = globalThreadsSlice.actions
export default globalThreadsSlice.reducer