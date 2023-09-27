import React from 'react'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskEditor from './TaskEditor' // Import your TaskEditor component
import { configureStore, combineReducers, createSlice } from '@reduxjs/toolkit'
import { renderWithProviders } from '../../utils/test-utils'
import { diagonalize, hoursToMillis } from '../../utils/helpers.js'
import { parse, format } from 'date-fns'

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
const diagonalizedValue = diagonalize(initialTasks.tasks.map(task => task.task)) // unique query not in list of tasks

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
    expected: ({ getAllByDisplayValue, value = initialTasks.tasks[0].task, originalMatches }) => {
      // Assert that all etas that are visible have etas that match their original counterparts
      const newMatches = getAllByDisplayValue(value).slice(1)
      expect(newMatches.length).toEqual(originalMatches.length)
      newMatches.forEach((el, i) => expect(el).toEqual(originalMatches[i]))
    }
  },
  {
    description: 'Preceeding white space should be stripped. ("Exampl3 2" === "    Exampl3 2")',
    value: "       ".concat(initialTasks.tasks[0].task),
    action: (searchInput, value = "       ".concat(initialTasks.tasks[0].task)) => fireEvent.change(searchInput, { target: { value } }),
    expected: ({ getAllByDisplayValue, value = initialTasks.tasks[0].task }) => {
      // Assert that all the original matches ("   "+query) === (query) after doing the action
      const newMatches = getAllByDisplayValue(value.trim()).slice(1) // Get all the inputs that match the new query (it will have 1 less because the search itself is " "+query)
      const oldMatches = screen.getAllByRole('textbox').slice(1) // Slice off the search to get the table inputs

      expect(newMatches.length).toEqual(oldMatches.length)
      newMatches.forEach((el, i) => expect(el).toEqual(oldMatches[i])) // Every new match must equal every old match (assuming "  "+query === query)
    }
  },
  {
    description: 'White space to the right should be stripped. ("Exampl3 2" === "Exampl3 2     ")',
    value: initialTasks.tasks[0].task.concat("       "),
    action: (searchInput, value = initialTasks.tasks[0].task.concat("       ")) => fireEvent.change(searchInput, { target: { value } }),
    expected: ({ getAllByDisplayValue, value = initialTasks.tasks[0].task }) => {
      // Assert that all the original matches (query+"  ") === (query) after doing the action
      const newMatches = getAllByDisplayValue(value.trim()).slice(1) // Get all the inputs that match the new query 
      const oldMatches = screen.getAllByRole('textbox').slice(1)

      expect(newMatches.length).toEqual(oldMatches.length)
      newMatches.forEach((el, i) => expect(el).toEqual(oldMatches[i])) // Every new match must equal every old match (assuming query+"  " === query)
    },
  },
  {
    description: 'When no tasks are found, no tasks are displayed',
    value: diagonalizedValue, // a value not in the original list of tasks
    action: (searchInput, value = diagonalizedValue) => fireEvent.change(searchInput, { target: { value } }),
    expected: ({ getAllByDisplayValue, value = diagonalizedValue }) => {
      // Assert that there is no matches for the query
      const noMatches = getAllByDisplayValue(value).slice(1) // Get all the inputs that match the new query that is not in the list of tasks

      expect(noMatches.length).toBe(0)
    },
  }
]

const startEndTestCases = [
  /*
    1. If first task is incomplete, then changing the start will change the first task eta to be first task.ttc + start
    2. If first task is complete, then changing the start will not affect the eta at all
    3. The End time (parsed to correct date) should mark the beginning of what tasks are considered old
    4. Tasks before the start time (parsed to correct date) should be marked old, unless if they are completed
    5. Completed tasks are always green, even if old or out of today range
  */
  {
    description: 'If first task is incomplete, then changing the start will change the first task eta to be first task.ttc + start',
    action: async ({ hour = 8, getByTestId }) => {
      // Find the start time-picker by test-id
      const startPickerElement = getByTestId('start-time-picker') // see also: TaskControl.js for test-id

      // Find the button to show the clock itself
      const clockBtn = getByTestId('start-time-picker-button')
      await waitFor(() => fireEvent.mouseDown(clockBtn))

      // Find the clock options to manipulate within the clock element
      const optionElements = startPickerElement.querySelectorAll('[role="option"]')
      console.log(`optionElements[hour]: ${optionElements[hour].textContent}`)

      screen.debug(optionElements[hour])

      // Select what hour you want, where hour 0 < hour <= 24
      //fireEvent.mouseDown(optionElements[hour])
      userEvent.click(optionElements[hour])
    },
    expected: ({ oldFirstEta, newFirstEta, oldStart, tasks = initialTasks.tasks }) => {
      const firstTTC = tasks[0]?.ttc
      const expectedFirst = format(new Date(hoursToMillis(firstTTC) + parse(oldStart, 'HH:mm', new Date()).getTime()), "HH:mm") // ttc + oldStart = "HH:mm"

      //console.log(`expect ${oldFirstEta} not to equal ${newFirstEta}`)
      // Assert that first eta (gathered before action) is not equal to new first eta (after action)
      expect(oldFirstEta).not.toEqual(newFirstEta) // Str:old != Str:new
      // Assert that new first eta (after action) is equal to (new) start + first ttc
      expect(newFirstEta).toEqual(expectedFirst)
    }
  },
]

// --- Tests
describe('TaskEditor - 1. Search Feature', () => {
  searchTestCases.forEach(testCase => {
    it(testCase.description, async () => {
      // -- Arrange
      const { getByPlaceholderText, queryByDisplayValue, getAllByDisplayValue } = renderWithProviders(<TaskEditor options={options} />, { store: searchStore })
      const searchInput = getByPlaceholderText('Search for a Task')
      const originalMatches = testCase?.value.trim() !== diagonalizedValue ? getAllByDisplayValue(testCase?.value.trim()) : []

      // -- Act
      await act(async () => {
        testCase.action(searchInput, testCase?.value)
      })

      // -- Assert
      testCase.expected({ getByPlaceholderText, getAllByDisplayValue, queryByDisplayValue, value: testCase?.value, originalMatches })
    })
  })
})

describe('TaskEditor - 2. Start/End/Owl Feature', () => {
  startEndTestCases.forEach(testCase => {
    it(testCase.description, async () => {
      // -- Private Test Helpers
      const getStartEndElements = () => {
        const startEndTimes = screen.getAllByLabelText((text, el) =>
          text.startsWith('Time display:')
        )
        const originalStartString = startEndTimes[0]?.textContent
        const originalEndString = startEndTimes[1]?.textContent
        return [originalStartString, originalEndString]
      }

      // -- Arrange
      const { getByTestId, getByLabelText, getAllByText } = renderWithProviders(<TaskEditor options={options} />, { store: searchStore })
      const hour = 9 // 9:00 a.m.
      const owlElement = getByTestId('owl-button')
      const isOwl = owlElement.getAttribute('style') !== null // if style attribute is empty then false otherwise true
      const [originalStartString, originalEndString] = [...getStartEndElements()]
      const originalETA = getByLabelText('eta for task 0')?.textContent
      // TODO: Parse Start/End into Dates based on Owl

      // -- Act
      await act(async () => {
        testCase.action({ hour, getByTestId })
      })

      // -- Assert
      await waitFor(() => {
        const newETA = getByLabelText('eta for task 0')?.textContent
        const [newStartString, newEndString] = [...getStartEndElements()]

        testCase.expected({ oldFirstEta: originalETA, newFirstEta: newETA, oldStart: originalStartString })
      }, { timeout: 500 })
    })
  })
})
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