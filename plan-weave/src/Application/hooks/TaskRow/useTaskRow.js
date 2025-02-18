import { useMemo } from 'react'
import store from '../../store.js'
import { variant, task as taskSelector, timeRange, userId as userIDSelector } from '../../selectors.js'
import { highlightTaskRow, isTaskOld, isStatusChecked } from '../../../Core/utils/helpers.js'
import {
    completeTaskThunkAPI,
    editTaskNameThunkAPI,
} from '../../thunks.js'

// TODO: Make id vs Id vs ID consistent across entire code base
// TODO: Make Thunks for every hook that needs one
const dispatch = store.dispatch

// Almost done, needs: 
// taskSelector <- Test in isolation
// isHighlighting <- Delete FSM state + Selected Task State (TODO: Selected Tasks need to be created)
// e2e verification <- isHighlighting, taskSelector
export const useTaskRow = taskID => {
    const usedTask = taskSelector?.(taskID) || {}
    const { status } = usedTask || {}
    const { startTaskEditor: start, endTaskEditor: end } = timeRange()
    const timeRangeStartEnd = { start, end } // TODO: verify this is correct

    const isHighlighting = false // TODO: Do the correct calculation for this involving the FSM for delete
    const highlight = useMemo(() => highlightTaskRow(isHighlighting, isStatusChecked(status), isTaskOld(timeRangeStartEnd, usedTask)), [isHighlighting, status, timeRangeStartEnd, usedTask])
    return { variant: variant(), status, highlight }
}
export const useCompleteIcon = taskID => {
    const { status } = taskSelector?.(taskID) || {}
    const userID = userIDSelector() || ''
    return {
        isChecked: isStatusChecked(status),
        handleCheckBoxClicked: () => { dispatch(completeTaskThunkAPI({ userID, taskID, status })) }
    }
}
export const useTaskInputContainer = taskID => {
    const { status, task } = taskSelector?.(taskID) || {}
    const userID = userIDSelector() || ''
    const childState = { status, taskName: task }
    const childServices = {
        onBlurEvent: e => { dispatch(editTaskNameThunkAPI({ userID, taskID, taskName: e.target.value })) }
    }
    return { childState, childServices }
}
export const useWaste = taskID => { // Redux controlled. TaskTable calculates and sets
    const { waste } = taskSelector?.(taskID) || {}
    return { waste }
}
export const useTtc = taskID => {
    const { status, ttc } = taskSelector?.(taskID) || {}
    const childState = { variant: variant(), status, ttc }
    const childServices = {
        onValueChangeEvent: () => console.warn('onValueChange thunk not implemented for useTtc'),
        onBlurEvent: () => console.warn('onBlur thunk not implemented for useTtc'),
    }
    return { childState, childServices }
}
export const useEta = taskID => { // Redux controlled. TaskTable calculates and sets
    const { eta } = taskSelector?.(taskID) || {}
    return { eta }
}
export const useEfficiency = taskID => { // Redux controlled. TaskTable calculates and sets
    const { efficiency } = taskSelector?.(taskID) || {}
    return { efficiency }
}
export const useDue = taskID => {
    const { status, dueDate } = taskSelector?.(taskID) || {}
    const childState = { variant: variant(), isChecked: isStatusChecked(status), dueDate }
    const childServices = {
        onTimeChangeEvent: () => console.warn('onTimeChange thunk not implemented for useDue')
    }
    return { childState, childServices }
}
export const useWeight = taskID => {
    const { status, weight } = taskSelector?.(taskID) || {}
    const childState = { variant: variant(), isChecked: isStatusChecked(status), dueDate }
    const childServices = {
        onValueChangeEvent: () => console.warn('onValueChange thunk not implemented for useWeight')
    }
    return { childState, childServices }
}
export const useThread = taskID => {
    const { parentThread } = taskSelector?.(taskID) || {}
    const options = [] // TODO: Figure out how to do this one, I am not familiar with the registery of all threads
    const childState = {
        variant: variant(),
        options,
        defaultValue: parentThread, // TODO: Figure out if this is the intended default, I don't recall
    }
    const childServices = {
        onChangeEvent: () => console.warn('onChange thunk not implemented for useThread'),
        onBlurEvent: () => console.warn('onBlur thunk not implemented for useThread'),
    }
    return { childState, childServices }
}
export const useDependency = taskID => {
    const { dependencies } = taskSelector?.(taskID) || {}
    const defaultValue = dependencies?.[0] || '' // TODO: Figure out correct default
    const childState = {
        variant: variant(),
        options: dependencies, // I think this is correct?
        defaultValue
    }
    const childServices = {
        onChangeEvent: () => console.warn('onChange thunk not implemented for useDependency'),
    }
    return { childState, childServices }
}
export const useTrash = taskID => {
    return { onClickEvent: () => console.warn('onClick thunk not implemented for useTrash') }
}