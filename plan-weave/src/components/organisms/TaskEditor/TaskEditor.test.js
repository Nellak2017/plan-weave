import React from 'react'
import { act, fireEvent } from '@testing-library/react'
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
const initialTasks = [
  { status: 'incomplete', task: 'Git - Tests, Pagination, Component testing', ttc: 2, id: 1, timestamp: timestamp },
  { status: 'incomplete', task: 'Ethics - P2', ttc: 1.5, id: 2, timestamp: timestamp - 1 },
  { status: 'incomplete', task: 'Span - Mindtap, Disc, Study', ttc: 2, id: 3, timestamp: timestamp - 2 },
  { status: 'incomplete', task: 'break', ttc: .75, id: 4, timestamp: timestamp - 3 },
  { status: 'incomplete', task: 'ML - A4, Study', ttc: .75, id: 5, timestamp: timestamp - 4 },
  { status: 'incomplete', task: 'break', ttc: .5, id: 6, timestamp: timestamp - 5 },
  { status: 'incomplete', task: 'SE II - Discord Plan, Study', ttc: .5, id: 7, timestamp: timestamp - 6 },
  { status: 'incomplete', task: 'break', ttc: .75, id: 9, timestamp: timestamp - 9 },
  { status: 'incomplete', task: 'Driving', ttc: 1.75, id: 10, timestamp: timestamp - 10 },
]

// --- Mocks
// Mock the CSS import
jest.mock('react-toastify/dist/ReactToastify.css', () => { }) // Replace with the path to your mock CSS file

// --- Tests
describe('TaskEditor', () => {

  let searchStore

  beforeEach(() => {
    searchStore = configureStore({
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
        }).reducer
      })
    })
  })

  it('1. Search Feature - Should filter tasks based on search input', async () => {

    const { getByPlaceholderText, queryByDisplayValue, getAllByDisplayValue } = renderWithProviders(<TaskEditor options={options} />, { searchStore })

    const searchInput = getByPlaceholderText('Search for a Task')
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Driving' } })
    })
    // Find the task that should be visible after filtering (Must be found this way to avoid search and this task showing up)
    const visibleTask = getAllByDisplayValue('Driving')
    expect(visibleTask.length).toBeGreaterThanOrEqual(2)

    // Find the tasks that should be hidden after filtering
    const hiddenTask2 = queryByDisplayValue('break')
    const hiddenTask3 = queryByDisplayValue('ML - A4, Study')

    expect(hiddenTask2).toBeNull()
    expect(hiddenTask3).toBeNull()
  })
})