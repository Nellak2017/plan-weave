import { useMemo, useEffect } from 'react'
import store from '../../store.js'
import { variant, task as taskSelector, timeRange, userID as userIDSelector, taskOrderPipeOptions, isHighlighting as isHighlightingSelector, isChecked as isCheckedSelector, isAtleastOneTaskSelected, isZeroTasksSelected, fsmControlledState } from '../../selectors.js'
import { highlightTaskRow, isTaskOld, isStatusChecked, calculateWaste, calculateEta, calculateEfficiency } from '../../../Core/utils/helpers.js'
import { completeTaskThunkAPI, editTaskNameThunkAPI, editTtcThunkAPI, editDueThunkAPI, editWeightThunkAPI, updateMultiDeleteFSMThunk, } from '../../thunks.js'
import { toggleSelectTask } from '../../entities/tasks/tasks.js'
import { formatISO } from 'date-fns'
import { VALID_MULTI_DELETE_IDS } from '../../validIDs.js'
import { handleMaxZero, handleMinOne } from '../../finiteStateMachines/MultipleDeleteButton.fsm.js'

// TODO: Make Thunks for every hook that needs one
const dispatch = store.dispatch
const setMultiDeleteFSMState = value => { dispatch(updateMultiDeleteFSMThunk({ id: VALID_MULTI_DELETE_IDS.MULTI_DELETE_TASK_EDITOR_ID, value })) }
// Almost done, needs: testing
export const useTaskRow = taskID => {
    const usedTask = taskSelector(taskID)
    const { status } = usedTask
    const { startTaskEditor: start, endTaskEditor: end } = timeRange()
    const timeRangeStartEnd = { start, end } // TODO: verify this is correct

    const isHighlighting = isHighlightingSelector(), isChecked = isCheckedSelector(taskID)
    const highlight = useMemo(() => highlightTaskRow(isHighlighting, isChecked, isTaskOld(timeRangeStartEnd, usedTask)), [status, timeRangeStartEnd, usedTask])
    return { variant: variant(), status, highlight }
}
// Almost done, needs: testing, batching, and completeness, as well as api stuff
export const useCompleteIcon = (taskID, currentTime) => {
    const userID = userIDSelector(), currentTaskRow = taskSelector(taskID)
    const pipelineOptions = taskOrderPipeOptions(), isChecked = isCheckedSelector(taskID), isHighlighting = isHighlightingSelector()
    const isAtleastOneTaskSelectedForDeletion = isAtleastOneTaskSelected()
    const fsmState = fsmControlledState()
    useEffect(() => {
        isAtleastOneTaskSelectedForDeletion
            ? handleMinOne(setMultiDeleteFSMState, fsmState)
            : handleMaxZero(setMultiDeleteFSMState, fsmState)
    }, [isAtleastOneTaskSelectedForDeletion, setMultiDeleteFSMState, fsmState]) // NOTE: This useEffect is used to get us in or out of the choose or chosen state. It wasn't possible in the click function to my knowledge
    return {
        isChecked,
        handleCheckBoxClicked: () => {
            isHighlighting
                ? dispatch(toggleSelectTask({ taskID }))
                : dispatch(completeTaskThunkAPI({ userID, currentTaskRow, taskOrderPipeOptions: pipelineOptions, currentTime }))
        }
    }
}
// Almost done, needs: testing
export const useTaskInputContainer = taskID => {
    const { status, task } = taskSelector?.(taskID) || {}
    const userID = userIDSelector() || ''
    const childState = { status, taskName: task }
    const childServices = {
        onBlurEvent: e => { dispatch(editTaskNameThunkAPI({ userID, taskID, taskName: e.target.value })) }
    }
    return { childState, childServices }
}
// Almost done, needs: testing
export const useWaste = (taskID, currentTime) => { // We calculate this from Redux state and memoize on time
    const currentTaskRow = taskSelector?.(taskID) || {}
    const pipelineOptions = taskOrderPipeOptions()
    const waste = useMemo(() => calculateWaste(currentTaskRow, pipelineOptions, currentTime), [pipelineOptions, currentTime])

    return { waste }
}
// Almost done, needs: testing
export const useTtc = taskID => {
    const { status, ttc } = taskSelector?.(taskID) || {}
    const userID = userIDSelector() || ''
    const childState = { variant: variant(), status, ttc }
    const childServices = {
        //onValueChangeEvent: () => console.warn('onValueChange thunk not implemented for useTtc'),
        onBlurEvent: ttc => dispatch(editTtcThunkAPI({ userID, taskID, ttc: parseFloat(ttc) })),
    }
    return { childState, childServices }
}
// Almost done, needs: testing
export const useEta = (taskID, currentTime) => { // We calculate this from Redux state and memoize on time
    const currentTaskRow = taskSelector?.(taskID) || {}
    const pipelineOptions = taskOrderPipeOptions()
    const eta = useMemo(() => calculateEta(currentTaskRow, pipelineOptions, currentTime), [currentTaskRow, pipelineOptions, currentTime])
    return { eta }
}
// Almost done, needs: testing, correction of efficiency function
export const useEfficiency = (taskID, currentTime) => { // We calculate this from Redux state and memoize on time
    const currentTaskRow = taskSelector?.(taskID) || {}
    const pipelineOptions = taskOrderPipeOptions()
    const efficiency = useMemo(() => Math.abs(calculateEfficiency(currentTaskRow, pipelineOptions, currentTime)), [currentTaskRow, pipelineOptions, currentTime])
    return { efficiency }
}
// Almost done, needs: testing
export const useDue = taskID => {
    const { status, dueDate } = taskSelector?.(taskID) || { dueDate: new Date().toISOString() }
    const userID = userIDSelector() || ''
    const childState = { variant: variant(), isChecked: isStatusChecked(status), dueDate }
    const childServices = {
        onTimeChangeEvent: dueDate => dispatch(editDueThunkAPI({ userID, taskID, dueDate: formatISO(dueDate) }))
    }
    return { childState, childServices }
}
// Almost done, needs: testing
export const useWeight = taskID => {
    const { status, weight, dueDate } = taskSelector?.(taskID) || {}
    const userID = userIDSelector() || ''
    const childState = { variant: variant(), isChecked: isStatusChecked(status), dueDate, weight }
    const childServices = {
        onValueChangeEvent: weight => dispatch(editWeightThunkAPI({ userID, taskID, weight: parseFloat(weight) }))
    }
    return { childState, childServices }
}
// needs: thread repository, implementation, testing
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
// needs: dependency selector, implementation, testing
export const useDependency = taskID => {
    const { dependencies } = taskSelector?.(taskID) || {}
    const defaultValue = dependencies?.[0] || [] // TODO: Figure out correct default
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