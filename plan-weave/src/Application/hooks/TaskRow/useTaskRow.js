import { useMemo, useEffect, useRef } from 'react'
import store from '../../store.js'
import {
    task as taskSelector, timeRange, userID as userIDSelector, isHighlighting as isHighlightingSelector, isChecked as isCheckedSelector, isAtleastOneTaskSelected, fsmControlledState, dnd as dndSelector, getAllThreadOptionsAvailable, properlyOrderedTasks,
    liveTime as liveTimeSelector, dependencyEtasMillis as dependencyEtasMillisSelector,
} from '../../selectors.js'
import {
    highlightTaskRow, isTaskOld, isStatusChecked, indexOfTaskToBeDeleted, millisToHours,
    computeUpdatedWaste, computeUpdatedEfficiency, calculateEta,
} from '../../../Core/utils/helpers.js'
import { playPauseTaskThunkAPI, completeTaskThunkAPI, updateDerivedThunkAPI, editTaskNameThunkAPI, editTtcThunkAPI, editDueThunkAPI, editWeightThunkAPI, editLiveTimeStampAPI, editLiveTimeAPI, updateMultiDeleteFSMThunk, deleteTaskThunkAPI, editThreadThunkAPI, editDependenciesThunkAPI, refreshTaskThunkAPI } from '../../thunks.js'
import { toggleSelectTask } from '../../entities/tasks/tasks.js'
import { formatISO } from 'date-fns'
import { VALID_MULTI_DELETE_IDS } from '../../validIDs.js'
import { handleMaxZero, handleMinOne } from '../../finiteStateMachines/MultipleDeleteButton.fsm.js'
import { TASK_STATUSES } from '../../../Core/utils/constants.js'
import { useChangeEffect } from '../Helpers/useChangeEffect.js'

// TODO: Test all more deeply, they appear done with few minor exceptions like last 3, api, correction of read only
const dispatch = store.dispatch
const setMultiDeleteFSMState = value => { dispatch(updateMultiDeleteFSMThunk({ id: VALID_MULTI_DELETE_IDS.MULTI_DELETE_TASK_EDITOR_ID, value })) }
export const useTaskRow = taskID => {
    const usedTask = taskSelector(taskID)
    const { status, eta } = usedTask || {}
    const { startTaskEditor: start, endTaskEditor: end } = timeRange()
    const timeRangeStartEnd = useMemo(() => ({ start: start?.defaultTime, end: end?.defaultTime }), [start, end])

    const isHighlighting = isHighlightingSelector(), isChecked = isCheckedSelector(taskID)
    const highlight = useMemo(() => highlightTaskRow(isHighlighting, isChecked, isTaskOld({ eta, timeRange: timeRangeStartEnd })), [timeRangeStartEnd, isChecked, isHighlighting, eta])
    return { status, highlight }
}
export const usePlayPause = (taskID) => {
    const currentTaskRow = taskSelector(taskID) || {}, { isLive } = currentTaskRow
    const handlePlayPauseClicked = () => { dispatch(playPauseTaskThunkAPI({ currentTaskRow })) }
    // --- Play/Pause many-to-one State Updates
    useChangeEffect(() => {
        const pausing = currentTaskRow?.isLive && currentTaskRow?.status !== TASK_STATUSES.COMPLETED
        if (pausing) { dispatch(editLiveTimeStampAPI({ taskID, liveTimeStamp: new Date().toISOString() })) }
        else {
            // TODO: Replace this custom logic with the 'computeUpdatedLiveTime' helper
            const deltaHours = millisToHours(Date.now() - new Date(currentTaskRow?.liveTimeStamp).getTime())
            const liveTime = (currentTaskRow?.liveTime ?? 0) + deltaHours
            dispatch(editLiveTimeAPI({ taskID, liveTime }))
        }
    }, [currentTaskRow?.status, currentTaskRow?.isLive])
    return { isLive, handlePlayPauseClicked }
}
export const useCompleteIcon = (taskID, currentTime) => {
    const currentTaskRow = taskSelector(taskID)
    const isChecked = isCheckedSelector(taskID), isHighlighting = isHighlightingSelector()
    const isAtleastOneTaskSelectedForDeletion = isAtleastOneTaskSelected(), fsmState = fsmControlledState()
    // --- Choose / Chosen Many-To-One State Updates (Many ways to get atleast one task selected, One way to update state)
    useEffect(() => {
        isAtleastOneTaskSelectedForDeletion ? handleMinOne(setMultiDeleteFSMState, fsmState) : handleMaxZero(setMultiDeleteFSMState, fsmState)
    }, [isAtleastOneTaskSelectedForDeletion, fsmState])
    // --- Complete/Incomplete Many-To-One State Updates
    useChangeEffect(() => {
        const dependencyEtasMillis = dependencyEtasMillisSelector(taskID, currentTime)
        dispatch(updateDerivedThunkAPI({ currentTaskRow, dependencyEtasMillis }))
    }, [currentTaskRow?.status, currentTaskRow?.isLive])
    return {
        isChecked,
        handleCheckBoxClicked: () => {
            isHighlighting ? dispatch(toggleSelectTask({ taskID })) : dispatch(completeTaskThunkAPI({ currentTaskRow }))
        }
    }
}
export const useTaskInputContainer = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}
    const childState = { status: currentTaskRow?.status, taskName: currentTaskRow?.task }
    const childServices = { onBlurEvent: e => { dispatch(editTaskNameThunkAPI({ taskID, taskName: e.target.value })) } }
    return { childState, childServices }
}
export const useWaste = (taskID, currentTime) => { // We calculate this from Redux state and memoize on liveTime
    const currentTaskRow = taskSelector?.(taskID) || {}, liveTime = liveTimeSelector(taskID)
    const { ttc } = currentTaskRow
    const waste = useMemo(() => computeUpdatedWaste({ liveTime, ttc }), [currentTaskRow, liveTime, currentTime])
    return { waste }
}
export const useTtc = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}
    const childState = { status: currentTaskRow?.status, ttc: currentTaskRow?.ttc }
    const childServices = { onBlurEvent: ttc => dispatch(editTtcThunkAPI({ taskID, ttc: parseFloat(ttc) })), } // NOTE: onValueChangeEvent not used
    return { childState, childServices }
}
export const useEta = (taskID, currentTime) => { // We calculate this from Redux state and memoize on time
    const currentTaskRow = taskSelector?.(taskID) || {}, liveTime = liveTimeSelector(taskID)
    const { ttc } = currentTaskRow
    const dependencyEtasMillis = dependencyEtasMillisSelector(taskID, currentTime)
    const eta = useMemo(() => calculateEta({ ttc, liveTime, dependencyEtasMillis }), [currentTaskRow, liveTime, currentTime])
    return { eta }
}
export const useEfficiency = (taskID, currentTime) => { // We calculate this from Redux state and memoize on liveTime
    const currentTaskRow = taskSelector?.(taskID) || {}, liveTime = liveTimeSelector(taskID)
    const { ttc } = currentTaskRow
    const efficiency = useMemo(() => computeUpdatedEfficiency({ liveTime, ttc }), [currentTaskRow, liveTime, currentTime])
    return { efficiency }
}
export const useDue = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || { dueDate: new Date().toISOString() }
    const childState = { isChecked: isStatusChecked(currentTaskRow?.status), dueDate: currentTaskRow?.dueDate }
    const childServices = { onTimeChangeEvent: dueDate => dispatch(editDueThunkAPI({ taskID, dueDate: formatISO(dueDate) })) }
    return { childState, childServices }
}
export const useWeight = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}
    const childState = { isChecked: isStatusChecked(currentTaskRow?.status), dueDate: currentTaskRow?.dueDate, weight: currentTaskRow?.weight }
    const childServices = { onValueChangeEvent: weight => dispatch(editWeightThunkAPI({ taskID, weight: parseFloat(weight) })) }
    return { childState, childServices }
}
export const useThread = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}, threadsAvailable = getAllThreadOptionsAvailable?.() || []
    const childState = { options: threadsAvailable, defaultValue: currentTaskRow?.parentThread, }
    const childServices = { onBlurEvent: newThread => dispatch(editThreadThunkAPI({ taskID, newThread })), } // NOTE: onChangeEvent appears unnecessary
    return { childState, childServices }
}
// TODO: Implement useDependency correctly. needs: highlighting chain reaction, testing / revisions
export const useDependency = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}
    const { dependencies } = currentTaskRow
    const tasks = properlyOrderedTasks?.() || []
    const defaultValueRef = useRef(dependencies || [])
    const defaultValue = (defaultValueRef.current).map(depID => { const match = tasks?.find(t => t?.id === depID); return match ? { value: match?.id, label: `${match?.task} (${match?.id})` } : null }).filter(Boolean) // use a ref to keep it constant always
    const options = useMemo(() => tasks?.filter(task => task?.id !== taskID)?.map(task => ({ value: task?.id, label: `${task?.task} (${task?.id})` })), [tasks])
    const childState = { defaultValue, options, }
    const childServices = { onChangeEvent: (reason, details) => dispatch(editDependenciesThunkAPI({ taskID, reason, details })), }
    return { childState, childServices }
}
export const useRefresh = (taskID) => {
    const isOwl = taskSelector?.(taskID)?.isOwl
    const handleRefreshClicked = () => { dispatch(refreshTaskThunkAPI({ taskID, isOwl })) }
    return { handleRefreshClicked }
}
export const useTrash = taskID => {
    const userID = userIDSelector() || '', dnd = dndSelector() || [], tasks = properlyOrderedTasks?.() || []
    return { onClickEvent: () => dispatch(deleteTaskThunkAPI({ userID, taskInfo: { index: indexOfTaskToBeDeleted(dnd, tasks, taskID), id: taskID } })) }
}