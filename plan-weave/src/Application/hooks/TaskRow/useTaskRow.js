import { useMemo, useEffect, useRef } from 'react'
import store from '../../store.js'
import { task as taskSelector, timeRange, userID as userIDSelector, taskOrderPipeOptions, isHighlighting as isHighlightingSelector, isChecked as isCheckedSelector, isAtleastOneTaskSelected, fsmControlledState, dnd as dndSelector, getAllThreadOptionsAvailable, properlyOrderedTasks } from '../../selectors.js'
import { highlightTaskRow, isTaskOld, isStatusChecked, calculateWaste, calculateEta, calculateEfficiency, indexOfTaskToBeDeleted } from '../../../Core/utils/helpers.js'
import { completeTaskThunkAPI, editTaskNameThunkAPI, editTtcThunkAPI, editDueThunkAPI, editWeightThunkAPI, updateMultiDeleteFSMThunk, deleteTaskThunkAPI, editThreadThunkAPI, editDependenciesThunkAPI } from '../../thunks.js'
import { toggleSelectTask } from '../../entities/tasks/tasks.js'
import { formatISO } from 'date-fns'
import { VALID_MULTI_DELETE_IDS } from '../../validIDs.js'
import { handleMaxZero, handleMinOne } from '../../finiteStateMachines/MultipleDeleteButton.fsm.js'
import { EFFICIENCY_RANGE } from '../../../Core/utils/constants.js'

// TODO: Test all more deeply, they appear done with few minor exceptions like last 3, api, correction of read only
const dispatch = store.dispatch
const setMultiDeleteFSMState = value => { dispatch(updateMultiDeleteFSMThunk({ id: VALID_MULTI_DELETE_IDS.MULTI_DELETE_TASK_EDITOR_ID, value })) }
export const useTaskRow = taskID => {
    const usedTask = taskSelector(taskID)
    const { status, eta } = usedTask || {}
    const { startTaskEditor: start, endTaskEditor: end } = timeRange()
    const timeRangeStartEnd = useMemo(() => ({ start: start?.defaultTime, end: end?.defaultTime }), [start, end])

    const isHighlighting = isHighlightingSelector(), isChecked = isCheckedSelector(taskID)
    // TODO: Figure out why end time is incorrect by being behind by 1 day. It should be always in a correct state. (when someone puts it as a end time less than start, set owl to be true and show toast warning. If it is like it initially also do the same thing too)
    const highlight = useMemo(() => highlightTaskRow(isHighlighting, isChecked, isTaskOld({ eta, timeRange: timeRangeStartEnd })), [timeRangeStartEnd, isChecked, isHighlighting, eta])
    return { status, highlight }
}
export const useCompleteIcon = (taskID, currentTime) => {
    const userID = userIDSelector(), currentTaskRow = taskSelector(taskID)
    const pipelineOptions = taskOrderPipeOptions(), isChecked = isCheckedSelector(taskID), isHighlighting = isHighlightingSelector()
    const isAtleastOneTaskSelectedForDeletion = isAtleastOneTaskSelected(), fsmState = fsmControlledState()
    useEffect(() => {
        isAtleastOneTaskSelectedForDeletion
            ? handleMinOne(setMultiDeleteFSMState, fsmState)
            : handleMaxZero(setMultiDeleteFSMState, fsmState)
    }, [isAtleastOneTaskSelectedForDeletion, fsmState]) // NOTE: This useEffect is used to get us in or out of the choose or chosen state. It wasn't possible in the click function to my knowledge
    return {
        isChecked,
        handleCheckBoxClicked: () => {
            isHighlighting
                ? dispatch(toggleSelectTask({ taskID }))
                : dispatch(completeTaskThunkAPI({ userID, currentTaskRow, taskOrderPipeOptions: pipelineOptions, currentTime }))
        }
    }
}
export const useTaskInputContainer = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}, userID = userIDSelector() || ''
    const childState = { status: currentTaskRow?.status, taskName: currentTaskRow?.task }
    const childServices = { onBlurEvent: e => { dispatch(editTaskNameThunkAPI({ userID, taskID, taskName: e.target.value, currentTaskRow })) } }
    return { childState, childServices }
}
export const useWaste = (taskID, currentTime) => { // We calculate this from Redux state and memoize on time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const currentTaskRow = taskSelector?.(taskID) || {}, pipelineOptions = taskOrderPipeOptions()
    const waste = useMemo(() => calculateWaste(currentTaskRow, pipelineOptions, currentTime), [pipelineOptions, currentTime, currentTaskRow])
    return { waste }
}
export const useTtc = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}, userID = userIDSelector() || ''
    const childState = { status: currentTaskRow?.status, ttc: currentTaskRow?.ttc }
    const childServices = { onBlurEvent: ttc => dispatch(editTtcThunkAPI({ userID, taskID, ttc: parseFloat(ttc), currentTaskRow })), } // NOTE: onValueChangeEvent not used
    return { childState, childServices }
}
export const useEta = (taskID, currentTime) => { // We calculate this from Redux state and memoize on time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const currentTaskRow = taskSelector?.(taskID) || {}, pipelineOptions = taskOrderPipeOptions()
    const eta = useMemo(() => calculateEta(currentTaskRow, pipelineOptions, currentTime), [currentTaskRow, pipelineOptions, currentTime])
    return { eta }
}
export const useEfficiency = (taskID, currentTime) => { // We calculate this from Redux state and memoize on time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const currentTaskRow = taskSelector?.(taskID) || {}, pipelineOptions = taskOrderPipeOptions()
    const efficiency = useMemo(() => Math.abs(calculateEfficiency(currentTaskRow, pipelineOptions, currentTime)), [currentTaskRow, pipelineOptions, currentTime])
    const { min, max } = EFFICIENCY_RANGE
    const processedEfficiency = efficiency === min || efficiency === max ? efficiency * Infinity : efficiency // so it displays inf or -inf if it is the edge case but it is not stored like that, also it displays normally otherwise 
    return { efficiency: processedEfficiency }
}
export const useDue = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || { dueDate: new Date().toISOString() }
    const userID = userIDSelector() || ''
    const childState = { isChecked: isStatusChecked(currentTaskRow?.status), dueDate: currentTaskRow?.dueDate }
    const childServices = { onTimeChangeEvent: dueDate => dispatch(editDueThunkAPI({ userID, taskID, dueDate: formatISO(dueDate), currentTaskRow })) }
    return { childState, childServices }
}
export const useWeight = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}
    const userID = userIDSelector() || ''
    const childState = { isChecked: isStatusChecked(currentTaskRow?.status), dueDate: currentTaskRow?.dueDate, weight: currentTaskRow?.weight }
    const childServices = { onValueChangeEvent: weight => dispatch(editWeightThunkAPI({ userID, taskID, weight: parseFloat(weight), currentTaskRow })) }
    return { childState, childServices }
}
export const useThread = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}, userID = userIDSelector() || '', threadsAvailable = getAllThreadOptionsAvailable?.() || []
    const childState = { options: threadsAvailable, defaultValue: currentTaskRow?.parentThread, }
    const childServices = { onBlurEvent: newThread => dispatch(editThreadThunkAPI({ userID, taskID, newThread, currentTaskRow })), } // NOTE: onChangeEvent appears unnecessary
    return { childState, childServices }
}
// TODO: Implement useDependency correctly. needs: highlighting chain reaction, testing / revisions
export const useDependency = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}
    const { dependencies } = currentTaskRow
    const tasks = properlyOrderedTasks?.() || [], userID = userIDSelector() || ''
    const defaultValueRef = useRef(dependencies || []), defaultValue = defaultValueRef.current // use a ref to keep it constant always
    const options = useMemo(() => tasks?.filter(task => task?.id !== taskID)?.map(task => ({ value: task?.id, label: `${task?.task} (${task?.id})` })), [tasks])
    const childState = { defaultValue, options, }
    const childServices = { onChangeEvent: (newDependencies, reason, details) => { dispatch(editDependenciesThunkAPI({ userID, taskID, newDependencies, currentTaskRow })) }, }
    return { childState, childServices }
}
export const useTrash = taskID => {
    const userID = userIDSelector() || '', dnd = dndSelector() || [], tasks = properlyOrderedTasks?.() || []
    return { onClickEvent: () => dispatch(deleteTaskThunkAPI({ userID, taskInfo: { index: indexOfTaskToBeDeleted(dnd, tasks, taskID), id: taskID } })) }
}