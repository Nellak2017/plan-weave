import { createSlice } from "@reduxjs/toolkit"
import { dateToToday, add, insertTaskAtIndex } from "../../../Core/utils/helpers"
import { TASK_STATUSES } from "../../../Core/utils/constants"

const tasks = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        updateTasks: (_, action) => action.payload, // lets you change all global tasks at once
        addTask: (state, action) => {
            const { insertLocation, addedTask } = action.payload
            return insertTaskAtIndex({ taskList: state, insertLocation, addedTask })
        }, // Add a new task to the state at the end of the pagination for better UX
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
            const { id, updates } = action.payload || {}
            const taskIndex = state?.findIndex(task => task?.id === id)
            if (taskIndex === -1) return
            Object.entries(updates).forEach(([field, value]) => { state[taskIndex][field] = value })
        },
        // TODO: also update waste and efficiency on both client and server side for most UX accuracy
        refreshTask: (state, action) => {
            const lastCompleteTime = new Date().toISOString()
            const { taskID } = action?.payload || {}
            const taskIndex = state?.findIndex(task => task?.id === taskID)
            if (taskIndex !== -1) state[taskIndex] = {
                ...state[taskIndex],
                liveTime: 0,
                status: TASK_STATUSES.INCOMPLETE,
                lastCompleteTime,
                lastIncompleteTime: lastCompleteTime,
                isLive: false,
                eta: dateToToday(add(new Date(lastCompleteTime), state[taskIndex]?.ttc || 0).toISOString())
            }
        },
        refreshTasks: state => {
            const lastCompleteTime = new Date().toISOString()
            return state?.map(task => ({
                ...task,
                liveTime: 0,
                status: TASK_STATUSES.INCOMPLETE,
                lastCompleteTime,
                lastIncompleteTime: lastCompleteTime,
                isLive: false,
                eta: dateToToday(add(new Date(lastCompleteTime), task?.ttc || 0).toISOString())
            }))
        },
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
        clearTaskDependencies: (state, action) => {
            const { taskID } = action.payload || {}
            const taskIndex = state.findIndex(task => task?.id === taskID)
            if (taskIndex === -1) return
            state[taskIndex].dependencies = []
        }
    }
})
export const { updateTasks, addTask, deleteTask, deleteTasks, refreshTask, refreshTasks, updateTask, toggleSelectTask, clearSelectedTasks, updateTasksBatch, addTaskDependencies, deleteTaskDependencies, clearTaskDependencies } = tasks.actions
export default tasks.reducer