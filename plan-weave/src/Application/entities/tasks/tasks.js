import { createSlice } from "@reduxjs/toolkit"

const tasks = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        updateTasks: (state, action) => action.payload, // lets you change all global tasks at once
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
        },
    }
})
export const { updateTasks, addTask, deleteTask, deleteTasks, editTask } = tasks.actions
export default tasks.reducer