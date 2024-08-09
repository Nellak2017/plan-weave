/* eslint-disable fp/no-loops */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable fp/no-let */
// UI Tests for TaskEditor

import React from 'react'
import { fireEvent, screen, waitFor, act, cleanup, within } from '@testing-library/react' // render is used in 'renderWithProviders'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../utils/test-utils.js'
import '@testing-library/jest-dom'
import { fc } from '@fast-check/jest'
import { configureStore } from '@reduxjs/toolkit'
import TaskEditor from './TaskEditor.js'
import { parse } from 'date-fns'
import { TASK_STATUSES, TASKEDITOR_SEARCH_PLACEHOLDER, TASK_CONTROL_TITLES } from '../../utils/constants.js'
import rootReducer from '../../../redux/reducers/index.js'
import { createTaskEditorServices } from '../../../services/PlanWeavePage/TaskEditorServices.js'

// --- Test Global Variables
const timestamp = Math.floor((new Date()).getTime() / 1000)
const due = '2024-06-01T21:00:00.000Z' // updated due date
const mockTasks = [
	{
		status: TASK_STATUSES.COMPLETED, task: 'Eat', ttc: 1, id: 1, timestamp: timestamp, dueDate: due, dependencies: [
			{ "value": 1, "label": "Eat" },
			{ "value": 2, "label": "Meal Prep" }
		]
	},
	{ status: 'incomplete', task: 'Meal Prep', ttc: .1, id: 2, timestamp: timestamp - 1, dueDate: due },
	{ status: 'incomplete', task: 'Shower+', ttc: .5, id: 3, timestamp: timestamp - 2, dueDate: due },
	{ status: 'incomplete', task: 'Clean', ttc: 1, id: 4, timestamp: timestamp - 3, dueDate: due },
	{ status: TASK_STATUSES.COMPLETED, task: 'Driving Practice', ttc: 1.5, id: 5, timestamp: timestamp - 4, dueDate: due },
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
		tasks: mockTasks,
		fullTask: false, // Used to show Full tasks or Simple Tasks
		firstLoad: true, // Used to guard against setting endtime multiple times
		userId: '', // Used to store the userId for Firebase
	},
	globalThreads: {
		threads: ['default'],
	},
}

// --- Test Helper Functions
// Used for broken userEvent.type workaround
const typeText = async (input, text, user = userEvent.setup({ delay: null })) => {
	for (const char of text) {
		await user.type(input, char)
	}
}

// from redux docs: https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function
const renderComponent = (store = configureStore({ reducer: rootReducer, preloadedState: initialState }), preloadedState = initialState) =>
	renderWithProviders(<TaskEditor services={createTaskEditorServices(store)} />, { preloadedState, store })

// --- UI Tests
describe('TaskEditor Component, Order Problem', () => {
	// --- Set-up
	beforeAll(() => {
		const originalConsoleError = console.error
		console.error = (message, ...args) => {
			if (message && typeof message === 'string' && message.includes('was not wrapped in act')) return
			originalConsoleError(message || '', ...args)
		}
	}) // Explicitly silence the stupid not wrapped in act error that is impossible to fix
	afterEach(() => {
		cleanup()
	})

	// --- Smoke test
	test('renders TaskEditor with title', () => {
		renderComponent()
		expect(screen.getByText("Today's Tasks")).toBeInTheDocument()
	})

	// --- Basic redux reducer test
	test('renders TaskEditor with functioning search reducer', async () => {
		// --- Set-up (Arrange)
		const configuredStore = configureStore({ reducer: rootReducer, preloadedState: initialState })
		renderComponent(configuredStore) // you can destructure { container } out to get the screen.debug for a particular selector like tbody

		// --- Act
		const searchInput = screen.getByPlaceholderText(TASKEDITOR_SEARCH_PLACEHOLDER)
		const searchTerm = 'new search term'
		//await typeText(searchInput, searchTerm) // Helper used since the raw way doesn't work
		fireEvent.change(searchInput, { target: { value: searchTerm } }) // Used for speed and because it is covered in more depth later

		// --- Assert
		await waitFor(() => expect(searchInput.value).toBe(searchTerm)) // input.value === searchTerm
		await waitFor(() => expect(configuredStore.getState().taskEditor.search).toBe(searchTerm)) // search in the store === searchTerm
		const hiddenTasks = mockTasks.filter(task => !task.task.toLowerCase().includes(searchTerm.toLowerCase()))
		for (const task of hiddenTasks) {
			const taskElement = screen.queryByTestId(`task-${task.id}-testId`)
			expect(taskElement).not.toBeInTheDocument()
		}
	})

	// --- Feature UI tests
	describe('Search feature', () => {
		// --- Set-up
		afterEach(() => {
			cleanup()
		})

		// --- Example based tests for Search Feature
		test('should display all tasks initially', () => {
			renderComponent()
			mockTasks.forEach(task => {
				expect(screen.getByTestId(`task-${task.id}-testId`)).toBeInTheDocument()
			})
		})

		test.skip('should filter tasks based on search input', async () => {
			const filterTestCases = [
				'Prep', // Partial Match
				'Meal Prep', // Full Match
				'clean', // Case insensitive
				'Practice     ', // Partial Match, Leading spaces
				'Shower+', // Special Characters
				'Grocery', // No Match
				'Eat', // Works with completed tasks
				'Plan', // Partial Match
				'study', // Partial Match, Preceeding spaces
				'', // All tasks
				'1' // No tasks
			]

			for (const searchTerm of filterTestCases) {
				// --- Arrange
				const configuredStore = configureStore({ reducer: rootReducer, preloadedState: initialState })
				act(() => renderComponent(configuredStore)) // you can destructure { container } out to get the screen.debug for a particular selector like tbody

				// --- Act
				const searchInput = await screen.findByPlaceholderText(TASKEDITOR_SEARCH_PLACEHOLDER)
				typeText(searchInput, searchTerm) // Used so I can get accurate results

				// --- Assert
				const visibleTasks = mockTasks.filter(task => task.task.toLowerCase().includes(searchTerm.trim().toLowerCase()))
				const hiddenTasks = mockTasks.filter(task => !task.task.toLowerCase().includes(searchTerm.trim().toLowerCase()))

				await waitFor(() => { expect(screen.getAllByRole('row').slice(1).length).toBe(visibleTasks.length === 0 ? 1 : visibleTasks.length) }) // NOTE: getAllByRole('row') also returns the tr for the head of the table too
				await waitFor(() => { expect(searchInput).toHaveValue(searchTerm) })

				for (const task of visibleTasks) { expect(screen.queryByTestId(`task-${task.id}-testId`)).toBeInTheDocument() }
				for (const task of hiddenTasks) { expect(screen.queryByTestId(`task-${task.id}-testId`)).not.toBeInTheDocument() }

				cleanup()
			}
		})
	})

	// NOTE: Impossible to Test in RTL, must use Cypress
	describe.skip('Start Time feature', () => {
		// NOTE: It is literally impossible to do this Test in RTL because RTL doesn't render it properly.
		// NOTE: To test this, I must use Cypress or something else

		// --- Helper that can not work in RTL
		// Used for the broken MUI TimeClock onMouseDown workaround (Not accepting mouseDown on hour or minute element) 
		// Returns String if Error or undefined if no error (does a side-effect)
		const mouseDownClockHack = element => {
			// Step 1: Get the clientX, clientY, screenX, screenY from that element. 
			// const { left, top, width, height } = element.getBoundingClientRect() // https://github.com/jsdom/jsdom/issues/1590 (Always returns 0 in RTL because RTL is retarded) 
			const clientX = 688.40 //left + width / 2
			const clientY = 264 //top + height / 2
			const screenX = 688.40 // clientX + window.scrollX
			const screenY = 264 // clientY + window.scrollY

			// Step 2: Select the squareMask using the CSS class name (or data-test-id if possible)
			const squareMaskElement = document.querySelector('.MuiClock-squareMask')
			if (!squareMaskElement) { return 'squareMask element not found' }

			// Step 3: Use custom code to replicate the event with the x, y coordinates and dispatch it
			const mouseDownEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, clientX, clientY, screenX, screenY, button: 0, buttons: 0, relatedTarget: squareMaskElement })
			//squareMaskElement.dispatchEvent(mouseDownEvent)
			fireEvent(squareMaskElement, mouseDownEvent)
		}
		// --- Set-up
		afterEach(() => {
			cleanup()
		})
		test.skip('Should allow for selecting a time and display it properly', async () => {
			// --- Arrange
			renderComponent()
			const user = userEvent.setup()

			const hour = /^1 hours$/i
			const minute = /^5 minutes$/i

			// --- Act and Assert

			// 0. Dropdown should not be visible initially
			expect(screen.getByTestId(`Dropdown for ${TASK_CONTROL_TITLES.startButton}`)).not.toBeVisible() // https://github.com/styled-components/styled-components/issues/4081 (Solves the styled component not rendering properly issue in Jest)

			// 1. Get start button
			const timeButtons = screen.getAllByRole('button', { name: /Toggle clock/i })
			const startTimeButton = timeButtons.find(button => within(button).queryByTitle(TASK_CONTROL_TITLES.startButton) !== null)

			// 2. Click that start button
			fireEvent.mouseDown(startTimeButton)

			// 3. Expect the dropdown to be visible
			const dropDown = screen.getByTestId(`Dropdown for ${TASK_CONTROL_TITLES.startButton}`)
			await waitFor(() => expect(dropDown).toBeVisible())//.toHaveStyle('visibility: visible')

			// 4. Select the hour option and click it
			const hourOption = within(dropDown).getByRole('option', { name: hour })
			mouseDownClockHack(hourOption) // Used because the standard mouseDown doesn't work on hourOption, I had to find a hack to work around MUI's limitations
			screen.debug(hourOption)

			// 5. Expect the dropDown to still be visible
			expect(dropDown).toBeVisible()

			// 6. Wait for the dropdown to update and minute options to appear
			const newDropDown = screen.getByTestId(`Dropdown for ${TASK_CONTROL_TITLES.startButton}`)
			screen.debug(newDropDown)
			await waitFor(() => {
				const minuteOption = within(newDropDown).getByRole('option', { name: minute })
				expect(minuteOption).toBeInTheDocument()
			})

			// 7. Select the minute option and click it
			const minuteOption = within(dropDown).getByRole('option', { name: minute })
			user.click(minuteOption)

			// 8. Expect the dropDown to Not be visible
			expect(dropDown).not.toBeVisible()

			// 9. Select the time display for the start button
			const timeDisplay = screen.getByLabelText(/time display: start time/i)
			screen.debug(timeDisplay)
		})
	})

	// NOTE: Impossible to Test in RTL, must use Cypress
	describe.skip('End Time feature', () => {
		// Too hard to simulate mouse movements perfectly, skipped
	})

	describe('Add Task feature', () => {

		

	})

	describe('Toggle Simple Task feature', () => {

	})

	describe('Delete Multiple Tasks feature', () => {

	})

	describe('Sort tasks drop down feature', () => {

	})

	describe('Drag and Drop feature', () => {

	})

	/*
	describe('Complete Task feature', () => {
		// --- Example based tests
		// 1. Completed Tasks are always on top if there exists any
		test('If No Completed Tasks, Non-Complete tasks should be in correct sorted order', () => {
			// Setup store to have no completed tasks
			const incompleteTasks = mockTasks.filter(task => task.status !== TASK_STATUSES.COMPLETED)
			store = mockStore({
				...initialState,
				globalTasks: { tasks: incompleteTasks },
				taskEditor: { ...initialState.taskEditor, tasks: incompleteTasks, },
			})
			// The tasks we observe should be in sorted order based on existing sorting algorithm
			const sortAlgoName = initialState.taskEditor.sortingAlgo // We do not change this, so it is valid
			const sortAlgo = SORTING_METHODS[sortAlgoName] // sort by timestamp or whatever is in initial state
			const sortedTasks = sortAlgo(incompleteTasks) // We expect to see this in the rendered component as well
			const taskTitlesSorted = sortedTasks.map(task => task.task) // Get the name of the tasks out like ["Meal Prep", "Shower+", ...]
			renderComponent()

			// Assertion: Check if the tasks displayed match the sorted tasks based on the sorting algorithm
			//const taskElements = screen.getAllByRole('cell') // Debugging only
			const taskElements = screen.getAllByTitle('Task Name') // Each task has a Title 'Task Name'
			expect(taskElements.length > 0).toBe(true)
			const taskTitlesDisplayed = taskElements.map(taskElement => {
				const completedElTaskName = taskElement.querySelector('p')?.textContent
				const notCompletedElTaskName = taskElement.querySelector('input')?.value
				const displayedTaskName = !completedElTaskName ? notCompletedElTaskName : completedElTaskName
				return displayedTaskName
			}) // Select text inside <p> or <input> elements

			// Compare the titles of displayed tasks with the sorted tasks
			expect(taskTitlesDisplayed).toEqual(taskTitlesSorted)
		})

		// --- Property based tests
		const completedTaskArbitrary = fc.array(fc.record({
			status: fc.constant(TASK_STATUSES.COMPLETED),
			task: fc.string(),
		}))
		const nonCompletedTaskArbitrary = fc.array(fc.record({
			status: fc.constantFrom(...Object.values(TASK_STATUSES).filter(status => status !== TASK_STATUSES.COMPLETED)),
			task: fc.string(),
		}))

		// 1. Completed Tasks are always on top if there exists any
		test('Completed Tasks are always on top if there exists any', () => {
			fc.assert(fc.property(
				completedTaskArbitrary,
				nonCompletedTaskArbitrary,
				(completedTasks, incompleteTasks) => {
					// Make all tasks have a unique id before adding to the store
					const tasksWithIds = [...completedTasks, ...incompleteTasks].map((task, index) => ({ ...task, id: index + 1 }))
					const updatedCompletedTasks = tasksWithIds.filter(task => task.status === TASK_STATUSES.COMPLETED)
					const updatedIncompleteTasks = tasksWithIds.filter(task => task.status !== TASK_STATUSES.COMPLETED)
					// Add complete and incomplete tasks to the store
					const store = mockStore({
						...initialState,
						globalTasks: { tasks: [...updatedCompletedTasks, ...incompleteTasks] },
						taskEditor: { ...initialState.taskEditor, tasks: [...updatedCompletedTasks, ...updatedIncompleteTasks], },
					})

					renderComponent(store)

					// Do a random series of allowed operations here (Search, Add, FullTaskToggle, AutoSort, DnD, Complete, ...rest)

					const taskElements = screen.queryAllByTitle('Task Name') // [<td title='Task Name'>...</td>,...]
					if (taskElements.length === 0) return true

					const completedTasksDisplayed = taskElements.filter(taskElement => taskElement.querySelector('p'))
					const incompleteTasksDisplayed = taskElements.filter(taskElement => taskElement.querySelector('input'))

					if (completedTasks.length > 0 && incompleteTasks.length > 0) completedTasksDisplayed.length > 0 && incompleteTasksDisplayed.length > 0 && completedTasksDisplayed[0] && !incompleteTasksDisplayed[0]
					if (completedTasks.length > 0) completedTasksDisplayed.length > 0 && incompleteTasksDisplayed.length === 0 && completedTasksDisplayed[0]
					if (incompleteTasks.length > 0) completedTasksDisplayed.length === 0 && incompleteTasksDisplayed.length > 0 && incompleteTasksDisplayed[0]
					return true // Test passed if there are no tasks
				}
			), {
				numRuns: 10, // must limit it for UI tests
			}
			)
		})
	})
	*/

	describe('Update Task feature', () => {

	})

	describe('Refresh Task feature', () => {

	})

	describe('Back/Forward page buttons feature', () => {

	})

	describe('Jump to page feature', () => {

	})

	describe('Display x tasks per page dropdown feature', () => {

	})

	/* 
	Possible Relevant user actions for TaskEditor:

	1. Search(input text)
	2. Add(click)
	3. FullTaskToggle(click)
	4. AutoSort(click) -> Options(click) // Changes sorting algo, very important
	5. DnD(Task, startIndex, endIndex, Click and MouseDrag) // Move a task from one spot to another within same page, very important to model
	6. Complete(Task, click) // important, completed always on top
	7. Delete(Task, click) // Very important for Order Problem
	8. PreviousPage(Click), NextPage(Click) // Very important to test properties and catch bugs
	9. PageNumber(input number)
	10. TasksPerPage(Click) -> Options(click) // Somewhat less important to tests
	(out of 16 total possible actions)

	Properties for TaskEditor:

	1. Completed Tasks are always on top if there exists any
	2. Both Completed and Not Completed tasks are sorted properly based on the active sorting algorithm, before any dnd is done
		(after dnd happens, sort may not hold)
	3. Search always makes the length of the list <= what it was before you added input
		- if there is any non falsey inputs and it is included in any tasks, then only those tasks are displayed
	4. Add always increases the amount of tasks by one and 
		if search is empty or doesn't match default task and the number of total tasks on the page < page len the number tasks seen increases too, 
		it is the default task, and is ordered correctly (and all other invariants hold, including search. Ordering applies even with dnd)
	5. DnD only alters task order, does not apply to completed tasks, incomplete tasks can not move to completed task area,
		DnD overrides sort until (sorting algo changes when AutoSort->option is pressed)
	6. AutoSort->option overrides any existing DnD ordering and will sort the tasks based on selected sorting algorithm no matter what.
	7. Complete task moves the incomplete->completed task to the appropriate order in the completed tasks
		moves the completed->incomplete task to the appropriate order in the incomplete tasks
		The appropriate order for completed->incomplete is where it belongs if it were sorted (regardless of dnd, which is assumed to be lost)
	8. PreviousPage does not work if you are on the minimum page
		PreviousPage displays the tasks in the proper order with sort and dnd applied
		PreviousPage->NextPage->PreviousPage does not affect the ordering or any fields of any task especially status (It is a known bug)
		NextPage does not work if you are on the maximum page
		NextPage->PreviousPage->NextPage does not affect the ordering or any fields of any task especially status
		PreviousPage decrements the displayed number by 1 if it works
		NextPage increments the displayed number by 1 if it works
		Displayed number is always in the proper range
	9. PageNumber does not work if the number is out of the range of accepted pages or is invalid or negative
		PageNumber only goes to the next page after the number is entered then the user clicks away (blur event)
		Invalid input is NEVER allowed in the PageNumber input no matter what is entered into it
	10. Tasks per page define how many tasks are on a page (Obviously)

	*/
})


