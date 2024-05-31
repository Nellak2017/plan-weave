/* eslint-disable fp/no-let */
// UI Tests for TaskEditor

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import TaskEditor from './TaskEditor'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from '../../../styles/globalStyles.js'
import theme from '../../../styles/theme.js'
import { ToastContainer } from 'react-toastify'
import { parse } from 'date-fns'

const timestamp = Math.floor((new Date()).getTime() / 1000)
const due = '2024-06-01T21:00:00.000Z' // updated due date
const mockTasks = [
	{
		status: 'incomplete', task: 'Eat', ttc: 1, id: 1, timestamp: timestamp, dueDate: due, dependencies: [
			{ "value": 1, "label": "Eat" },
			{ "value": 2, "label": "Meal Prep" }
		]
	},
	{ status: 'incomplete', task: 'Meal Prep', ttc: .1, id: 2, timestamp: timestamp - 1, dueDate: due },
	{ status: 'incomplete', task: 'Shower+', ttc: .5, id: 3, timestamp: timestamp - 2, dueDate: due },
	{ status: 'incomplete', task: 'Clean', ttc: 1, id: 4, timestamp: timestamp - 3, dueDate: due },
	{ status: 'incomplete', task: 'Driving Practice', ttc: 1.5, id: 5, timestamp: timestamp - 4, dueDate: due },
	{ status: 'incomplete', task: 'Plan Weave', ttc: 2, id: 6, timestamp: timestamp - 5, dueDate: due },
	{ status: 'incomplete', task: 'Walk', ttc: 1, id: 7, timestamp: timestamp - 6, dueDate: due },
	{ status: 'incomplete', task: 'Clojure / Backend study', ttc: 1.5, id: 9, timestamp: timestamp - 9, dueDate: due },
]
const initialState = {
	globalTasks: {
		tasks: mockTasks,
	},
	taskEditor: {
		search: '',
		timeRange: {
			start: parse('14:20', 'HH:mm', new Date()).toISOString(), // Initial Start Date 
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
		firstLoad: true, // Used to guard against setting endtime multiple times
		userId: '', // Used to store the userId for Firebase
	},
	globalThreads: {
		threads: ['default'],
	},
}

const mockStore = configureStore([]) // No middleware needed for basic mock store

describe('TaskEditor Component, Order Problem', () => {
	let store

	beforeEach(() => {
		store = mockStore(initialState)
	})

	const renderComponent = () => render(
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<ToastContainer position="bottom-left" autoClose={3000} />
			<Provider store={store}>
				<TaskEditor />
			</Provider>
		</ThemeProvider>
	)

	test('renders TaskEditor with title', () => {
		renderComponent()
		expect(screen.getByText("Today's Tasks")).toBeInTheDocument()
	})
})