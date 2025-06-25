import { createSlice } from "@reduxjs/toolkit"
import { parseISO } from "date-fns"
import { dateToToday } from "../../../Core/utils/helpers"

const tasks = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        updateTasks: (_, action) => action.payload, // lets you change all global tasks at once
        addTask: (state, action) => [action.payload, ...state],// Add a new task to the state
        deleteTask: (state, action) => {
            const { taskID } = action?.payload || {}
            return state?.filter(task => task?.id !== taskID)
        },
        deleteTasks: state => state?.filter(task => !task?.selected),
        updateTask: (state, action) => {
            const { taskID, field, value } = action?.payload || {}
            const taskIndex = state?.findIndex(task => task?.id === taskID)
            if (taskIndex !== -1) state[taskIndex][field] = value // Edit a task by ID and field
        },
        updateTasksBatch: (state, action) => {
            const updates = action?.payload || {}
            updates.forEach(({ taskID, field, value }) => {
                const taskIndex = state.findIndex(task => task?.id === taskID)
                if (taskIndex !== -1) state[taskIndex][field] = value
            })
        }, // Update tasks in batch
        refreshTasks: state => state?.map(task => ({ ...task, eta: dateToToday(new Date(task.timestamp).toISOString()), timestamp: parseISO(dateToToday(new Date(task.timestamp).toISOString())).getTime() / 1000 })), // update every task in the task list to have timestamp for today but with it's hours
        toggleSelectTask: (state, action) => {
            const { taskID } = action?.payload || {}
            const taskIndex = state?.findIndex(task => task?.id === taskID)
            if (taskIndex !== -1) state[taskIndex].selected = !state[taskIndex].selected
        },
        clearSelectedTasks: state => state?.map(task => ({ ...task, selected: false })),
        addTaskDependencies: (state, action) => {
            const { taskID, dependencies } = action.payload || {}
            const taskIndex = state.findIndex(task => task?.id === taskID)
            if (taskIndex === -1) return
            const currentDeps = new Set(state[taskIndex].dependencies || [])
            dependencies.forEach(dep => currentDeps.add(dep))
            state[taskIndex].dependencies = Array.from(currentDeps)
        },
        deleteTaskDependencies: (state, action) => {
            const { taskID, dependencies } = action.payload || {}
            const taskIndex = state.findIndex(task => task?.id === taskID)
            if (taskIndex === -1) return
            const currentDeps = new Set(state[taskIndex].dependencies || [])
            dependencies.forEach(dep => currentDeps.delete(dep))
            state[taskIndex].dependencies = Array.from(currentDeps)
        },
    }
})
export const { updateTasks, addTask, deleteTask, deleteTasks, refreshTasks, updateTask, toggleSelectTask, clearSelectedTasks, updateTasksBatch, addTaskDependencies, deleteTaskDependencies } = tasks.actions
export default tasks.reducer