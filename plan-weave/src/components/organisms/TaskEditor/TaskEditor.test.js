import React from 'react'
import { act, fireEvent, screen } from '@testing-library/react'
import TaskEditor from './TaskEditor' // Import your TaskEditor component
import { configureStore, combineReducers, createSlice } from '@reduxjs/toolkit'
import { renderWithProviders } from '../../utils/test-utils'

// --- Shared Data
const options = [
  { name: 'name', listener: () => console.log('Name Sorting applied. Tasks now appear alphabetically.'), algorithm: 'name' },
  { name: 'time created', listener: () => console.log('Time Sorting applied. Tasks now appear in chronological order.'), algorithm: 'timestamp' },
  { name: 'ETA', listener: () => console.log('ETA Sorting applied. Tasks now appear in ETA order.'), algorithm: 'eta' },
  { name: 'default', listener: () => console.log('Default Sorting applied. Tasks now appear as they do in the database.'), algorithm: '' },
]
const timestamp = new Date().getTime() / 1000 // epoch of current time
const initialTasks = {
  tasks: [
    { status: 'incomplete', task: 'break', ttc: 1.5, id: 1, timestamp: timestamp },
    { status: 'incomplete', task: 'Span - Mindtap, Disc, Study', ttc: 3, id: 2, timestamp: timestamp - 1 },
    { status: 'incomplete', task: 'Exampl3 2', ttc: 1.25, id: 3, timestamp: timestamp - 2 },
    { status: 'incomplete', task: 'Ethics - P2', ttc: 1.5, id: 4, timestamp: timestamp - 3 },
    { status: 'incomplete', task: 'break', ttc: .75, id: 5, timestamp: timestamp - 4 },
    { status: 'incomplete', task: 'ML - A4, Study', ttc: .5, id: 6, timestamp: timestamp - 5 },
    { status: 'incomplete', task: 'break', ttc: .5, id: 7, timestamp: timestamp - 6 },
    { status: 'incomplete', task: 'SE II - Discord Plan, Study', ttc: .75, id: 9, timestamp: timestamp - 9 },
    { status: 'incomplete', task: 'Driving', ttc: 1.75, id: 10, timestamp: timestamp - 10 },
  ]
}
const searchStore = configureStore({
  reducer: combineReducers({
    tasks: createSlice({
      name: 'tasks',
      initialState: initialTasks,
      reducers: {
        addTask: (state, action) => {
          state.tasks?.push(action.payload) // Add a new task to the state
        },
        deleteTask: (state, action) => {
          state.tasks = state?.tasks?.map(task => task?.id && task?.id === action.payload ? { ...task, hidden: true } : task)
        },
        deleteTasks: (state, action) => {
          const idsToDelete = action.payload
          state.tasks = state?.tasks?.map(task => task?.id && idsToDelete.includes(task?.id) ? { ...task, hidden: true } : task)
        },
        editTask: (state, action) => {
          if (state.tasks.length >= 1000) return
          const { id, updatedTask } = action?.payload || { 0: -1, 1: -1 } // TODO: poor default, think of better later
          const taskIndex = state?.tasks?.findIndex(task => task?.id === id)
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = updatedTask // Edit a task by ID
          }
        },
      },
    }).reducer,
  })
})

// --- Mocks
// Mock the CSS import
jest.mock('react-toastify/dist/ReactToastify.css', () => { }) // Replace with the path to your mock CSS file

// --- Test Cases
const searchTestCases = [
  {
    description: 'Searching for first task should result in atleast 1 task in the task table',
    value: initialTasks.tasks[0].task,
    action: (searchInput, value = initialTasks.tasks[0].task) => fireEvent.change(searchInput, { target: { value } }),
    expected: ({ getAllByDisplayValue, queryByDisplayValue, value = initialTasks.tasks[0].task, tasks = initialTasks.tasks }) => {
      // Assert that search and atleast 1 are in the task table
      const visibleTasks = getAllByDisplayValue(value)
      expect(visibleTasks.length).toBeGreaterThanOrEqual(2)

      // Assert that all non-selected tasks are missing
      tasks.forEach(task => {
        if (!task.task.includes(value)) {
          const hiddenTask = queryByDisplayValue(task.task)
          expect(hiddenTask).toBeNull()
        }
      })
    }
  },
  {
    description: 'Searching for first task should be case-insensitive and result in atleast 1 task in the task table',
    value: initialTasks.tasks[0].task.toLowerCase(),
    action: (searchInput, value = initialTasks.tasks[0].task.toLowerCase()) => fireEvent.change(searchInput, { target: { value } }),
    expected: ({ getAllByDisplayValue, queryByDisplayValue, value = initialTasks.tasks[0].task.toLowerCase(), tasks = initialTasks.tasks }) => {
      // Assert that search (lowercase) and atleast 1 are in the task table
      const visibleTasks = getAllByDisplayValue(taskValue => taskValue.toLowerCase().includes(value))
      expect(visibleTasks.length).toBeGreaterThanOrEqual(2)

      // Assert that all non-selected tasks are missing
      tasks.forEach(task => {
        if (!task.task.toLowerCase().includes(value)) {
          const hiddenTask = queryByDisplayValue(task.task)
          expect(hiddenTask).toBeNull()
        }
      })
    }
  },
  {
    description: 'Searching for Empty Input returns full task list',
    value: "",
    action: (searchInput, value = "") => fireEvent.change(searchInput, { target: { value } }),
    expected: ({ tasks = initialTasks.tasks }) => {
      // Assert that all tasks are in the task table
      tasks.forEach(task => {
        const visibleTasks = screen.getAllByDisplayValue(task.task)
        expect(visibleTasks.length).toBeGreaterThanOrEqual(1)
      })
    }
  },
  {
    description: 'Searching should not alter eta values',
    value: initialTasks.tasks[0].task,
    action: (searchInput, value = initialTasks.tasks[0].task) => fireEvent.change(searchInput, { target: { value } }),
    expected: ({ getAllByDisplayValue, value = initialTasks.tasks[0].task.toLowerCase(), originalMatches }) => {
      // Assert that all etas that are visible have etas that match their original counterparts
      const newMatches = getAllByDisplayValue(value).slice(1)
      expect(newMatches.length).toEqual(originalMatches.length)
      newMatches.forEach((el, i) => expect(el).toEqual(originalMatches[i]))
    }
  },
  // TODO: Preceeding white space should be stripped
  // TODO: Post white space should be stripped
  // TODO: Queries with internal whitespace greater than 2 should be respected
  // TODO: When no tasks are found, no tasks are displayed
]

// --- Tests
describe('TaskEditor - 1. Search Feature', () => {
  searchTestCases.forEach(testCase => {
    it(testCase.description, async () => {
      // -- Arrange
      const { getByPlaceholderText, queryByDisplayValue, getAllByDisplayValue } = renderWithProviders(<TaskEditor options={options} />, { store: searchStore })
      const searchInput = getByPlaceholderText('Search for a Task')
      const originalMatches = getAllByDisplayValue(testCase?.value)

      // -- Act
      await act(async () => {
        testCase.action(searchInput, testCase?.value)
      })

      // -- Assert
      testCase.expected({ getByPlaceholderText, getAllByDisplayValue, queryByDisplayValue, value: testCase?.value, originalMatches })
    })
  })
})

// describe('TaskEditor - 2. Start/End/Owl Feature', () => {})
// describe('TaskEditor - 3. Add Task Feature', () => {})
// describe('TaskEditor - 4. Multi-Delete Feature', () => {})
// describe('TaskEditor - 5. Sort Drop-down Feature', () => {})
// describe('TaskEditor - 6. DnD Feature', () => {})
// describe('TaskEditor - 7. Complete Feature', () => {})
// describe('TaskEditor - 8. Update Feature', () => {})
// describe('TaskEditor - 9. Waste/Eta Feature', () => {})
// describe('TaskEditor - 10. Single Delete Feature', () => {})
// describe('TaskEditor - 11. Refresh Feature', () => {})
// describe('TaskEditor - 12. Pagination Feature', () => {})
// describe('TaskEditor - 13. Tasks per page Feature', () => {})
// describe('TaskEditor - 14. Sort by Column Feature', () => {})