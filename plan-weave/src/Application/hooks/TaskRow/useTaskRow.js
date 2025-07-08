/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect, useRef } from 'react'
import store from '../../store.js'
import { task as taskSelector, timeRange, userID as userIDSelector, isHighlighting as isHighlightingSelector, isChecked as isCheckedSelector, isAtleastOneTaskSelected, fsmControlledState, dnd as dndSelector, getAllThreadOptionsAvailable, properlyOrderedTasks, liveTime as liveTimeSelector, dependencyEtasMillis as dependencyEtasMillisSelector, } from '../../selectors.js'
import { highlightTaskRow, isTaskOld, isStatusChecked, indexOfTaskToBeDeleted, computeUpdatedLiveTime, computeUpdatedWaste, computeUpdatedEfficiency, calculateEta, } from '../../../Core/utils/helpers.js'
import { playPauseTaskThunkAPI, pauseTaskThunkAPI, completeTaskThunkAPI, updateDerivedThunkAPI, editTaskNameThunkAPI, editTtcThunkAPI, editDueThunkAPI, editWeightThunkAPI, editLiveTimeStampAPI, editLiveTimeAPI, updateMultiDeleteFSMThunk, deleteTaskThunkAPI, editThreadThunkAPI, editDependenciesThunkAPI, refreshTaskThunkAPI } from '../../thunks.js'
import { toggleSelectTask } from '../../entities/tasks/tasks.js'
import { formatISO } from 'date-fns'
import { VALID_MULTI_DELETE_IDS } from '../../validIDs.js'
import { handleMaxZero, handleMinOne } from '../../finiteStateMachines/MultipleDeleteButton.fsm.js'
import { TASK_STATUSES } from '../../../Core/utils/constants.js'
import { useChangeEffect } from '../Helpers/useChangeEffect.js'

// TODO: Test all more deeply, they appear done with few minor exceptions like last 3, api, correction of read only
const dispatch = store.dispatch
const setMultiDeleteFSMState = value => { dispatch(updateMultiDeleteFSMThunk({ id: VALID_MULTI_DELETE_IDS.MULTI_DELETE_TASK_EDITOR_ID, value })) }
const updateLiveTimeAndDerived = ({ currentTaskRow, liveTimeStamp, currentTime, taskID }) => {
    const liveTime = computeUpdatedLiveTime({ oldLiveTime: currentTaskRow?.liveTime ?? 0, liveTimeStamp, currentTime })
    dispatch(editLiveTimeAPI({ taskID, liveTime }))
    const dependencyEtasMillis = dependencyEtasMillisSelector(taskID, currentTime)
    dispatch(updateDerivedThunkAPI({ currentTaskRow: { ...currentTaskRow, liveTime }, dependencyEtasMillis }))
    // Set ETA to now
}
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
    return { isLive, handlePlayPauseClicked }
}
// TODO: When a Task completes, it should have an ETA equal to the time it completed by definition and no longer calculated
export const useCompleteIcon = (taskID, currentTime) => {
    const currentTaskRow = taskSelector(taskID), isChecked = isCheckedSelector(taskID), isHighlighting = isHighlightingSelector(), isAtleastOneTaskSelectedForDeletion = isAtleastOneTaskSelected(), fsmState = fsmControlledState()
    const { liveTimeStamp } = currentTaskRow
    const isComplete = currentTaskRow?.status === TASK_STATUSES.COMPLETED, isLive = currentTaskRow?.isLive
    // --- Choose / Chosen Many-To-One State Updates (Many ways to get atleast one task selected, One way to update state)
    useEffect(() => {
        isAtleastOneTaskSelectedForDeletion ? handleMinOne(setMultiDeleteFSMState, fsmState) : handleMaxZero(setMultiDeleteFSMState, fsmState)
    }, [isAtleastOneTaskSelectedForDeletion, fsmState])
    // --- Complete/Incomplete Many-To-One State Updates
    // TODO: This way of doing it is the hacky useEffect way. For a better way, consider using state machines
    useChangeEffect(() => {
        dispatch(pauseTaskThunkAPI({ currentTaskRow })) // Always set isLive to false here since we are not doing it in the Thunk (Temporal Coupling)
        if (isComplete && isLive) updateLiveTimeAndDerived({ currentTaskRow, liveTimeStamp, currentTime, taskID }) // (playing, incomplete) -> (paused, complete)
    }, [currentTaskRow?.status])
    useChangeEffect(() => {
        if (isComplete) return // To prevent infinite loops (due to temporal coupling aka isLive updated _after_ something)
        if (isLive) dispatch(editLiveTimeStampAPI({ taskID, liveTimeStamp: currentTime.toISOString() }))  // (paused, incomplete) -> (playing, incomplete)
        else updateLiveTimeAndDerived({ currentTaskRow, liveTimeStamp, currentTime, taskID })  // (playing, incomplete) -> (paused, incomplete)
    }, [currentTaskRow?.isLive])
    return { isChecked, handleCheckBoxClicked: () => { isHighlighting ? dispatch(toggleSelectTask({ taskID })) : dispatch(completeTaskThunkAPI({ currentTaskRow })) } }
}
export const useTaskInputContainer = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}
    const childState = { status: currentTaskRow?.status, taskName: currentTaskRow?.task }
    const childServices = { onBlurEvent: e => { dispatch(editTaskNameThunkAPI({ taskID, taskName: e.target.value })) } }
    return { childState, childServices }
}
// TODO: Store DnD config in backend so that user order is respected over refreshes
// TODO: Ensure that when a task is deleted, all the references to that task are also deleted in the task dependencies
// TODO: Investigate isOld bug where task is considered old when it isn't
// TODO: Investigate Drag and Drop bug where incomplete task snaps out of position when you have incomplete tasks above it
// TODO: Investigate a refresh all bug where "invalid time" happens when it is 1 day later and I try to refresh
export const useWaste = (taskID, currentTime) => { // We calculate this from Redux state and memoize on liveTime
    const currentTaskRow = taskSelector?.(taskID) || {}, liveTime = liveTimeSelector(taskID), { ttc } = currentTaskRow
    const waste = useMemo(() => computeUpdatedWaste({ liveTime, ttc }), [currentTaskRow, liveTime, ttc, currentTime])
    return { waste }
}
export const useTtc = taskID => {
    const currentTaskRow = taskSelector?.(taskID) || {}
    const childState = { status: currentTaskRow?.status, ttc: currentTaskRow?.ttc }
    const childServices = { onBlurEvent: ttc => dispatch(editTtcThunkAPI({ taskID, ttc: parseFloat(ttc) })), } // NOTE: onValueChangeEvent not used
    return { childState, childServices }
}
export const useEta = (taskID, currentTime) => { // We calculate this from Redux state and memoize on time
    const currentTaskRow = taskSelector?.(taskID) || {}, liveTime = liveTimeSelector(taskID), { ttc } = currentTaskRow, dependencyEtasMillis = dependencyEtasMillisSelector(taskID, currentTime)
    const eta = useMemo(() => calculateEta({ ttc, liveTime, dependencyEtasMillis }), [currentTaskRow, liveTime, ttc, dependencyEtasMillis, currentTime])
    return { eta }
}
export const useEfficiency = (taskID, currentTime) => { // We calculate this from Redux state and memoize on liveTime
    const currentTaskRow = taskSelector?.(taskID) || {}, liveTime = liveTimeSelector(taskID), { ttc } = currentTaskRow
    const efficiency = useMemo(() => computeUpdatedEfficiency({ liveTime, ttc }), [currentTaskRow, liveTime, ttc, currentTime])
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

    // STEP 1: Build reverse dependency graph
    const reverseMap = useMemo(() => {
        const map = new Map()
        tasks.forEach(task => {
            (task.dependencies || []).forEach(dep => {
                if (!map.has(dep)) map.set(dep, [])
                map.get(dep).push(task.id)
            })
        })
        return map
    }, [tasks])

    // STEP 2: Find all tasks that (transitively) depend on taskID
    const invalidTargets = useMemo(() => {
        const visited = new Set()
        const stack = [taskID]
        // eslint-disable-next-line fp/no-loops
        while (stack.length > 0) {
            const current = stack.pop()
            if (!visited.has(current)) {
                visited.add(current)
                stack.push(...reverseMap.get(current) || [])
            }
        }
        return visited
    }, [taskID, reverseMap])

    // STEP 3: Build options list (exclude self + tasks that depend on this one)
    const options = useMemo(() => tasks?.filter(task => !invalidTargets.has(task.id))?.map(task => ({ value: task?.id, label: `${task?.task} (${task?.id})` })), [tasks, invalidTargets]) // taskID

    const defaultValueRef = useRef(dependencies || [])
    const defaultValue = (defaultValueRef.current)?.map(depID => { const match = tasks?.find(t => t?.id === depID); return match ? { value: match?.id, label: `${match?.task} (${match?.id})` } : null }).filter(Boolean) // use a ref to keep it constant always
    const childState = { defaultValue, options, }
    const childServices = { onChangeEvent: (reason, details) => dispatch(editDependenciesThunkAPI({ taskID, reason, details })), }
    return { childState, childServices }
}
export const useRefresh = (taskID) => {
    const isOwl = taskSelector?.(taskID)?.isOwl, handleRefreshClicked = () => { dispatch(refreshTaskThunkAPI({ taskID, isOwl })) }
    return { handleRefreshClicked }
}
export const useTrash = taskID => {
    const userID = userIDSelector() || '', dnd = dndSelector() || [], tasks = properlyOrderedTasks?.() || []
    return { onClickEvent: () => dispatch(deleteTaskThunkAPI({ userID, taskInfo: { index: indexOfTaskToBeDeleted(dnd, tasks, taskID), id: taskID } })) }
}