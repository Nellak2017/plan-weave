import { createSlice } from "@reduxjs/toolkit"
import { parseISO } from "date-fns"
import { dateToToday } from "../../../Core/utils/helpers"

const tasks = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        updateTasks: (_, action) => action.payload, // lets you change all global tasks at once
        addTask: (state, action) => [action.payload, ...state],// Add a new task to the state
        deleteTask: (state, action) => state?.map(task => task?.id && task?.id === action.payload ? { ...task, hidden: true } : task),
        deleteTasks: (state, action) => state?.map(task => task?.id && action.payload.includes(task?.id) ? { ...task, hidden: true } : task),
        editTask: (state, action) => {
            if (state.length >= 1000) {
                console.warn('You cant make more than 1000 tasks')
                return
            }
            const { id, updatedTask } = action?.payload || { 0: -1, 1: -1 }
            const taskIndex = state?.findIndex(task => task?.id === id)
            if (taskIndex !== -1) state[taskIndex] = updatedTask // Edit a task by ID
        }, // TODO: Possibly remove in favor of this next one
        updateTask: (state, action) => {
            const { taskID, field, value } = action?.payload || {}
            const taskIndex = state?.findIndex(task => task?.id === taskID)
            if (taskIndex !== -1 && state?.[taskIndex]?.[field]) state[taskIndex][field] = value // Edit a task by ID and field
        },
        refreshTasks: (state) => state?.map(task => ({ ...task, timestamp: parseISO(dateToToday(new Date(task.timestamp).toISOString())).getTime() / 1000 })), // update every task in the task list to have timestamp for today but with it's hours
    }
})
export const { updateTasks, addTask, deleteTask, deleteTasks, editTask, refreshTasks, updateTask } = tasks.actions
export default tasks.reducer