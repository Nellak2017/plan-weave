/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from 'react'
import { getHeaderLabels, getTaskRenderNumber, firstCompleteIndex, lastCompleteIndex, firstIncompleteIndex, computeUpdatedLiveTime, computeUpdatedWaste, computeUpdatedEfficiency } from '../../../Core/utils/helpers.js'
import store from "../../store"
import { isFullTask as isFullTaskSelector, dnd as dndSelector, prevLiveTaskID as prevLiveTaskIDSelector, properlyOrderedTasks } from '../../selectors.js'
import { updateDnDThunk } from '../../thunks.js'
import { updateTask, updateTasksBatch } from '../../entities/tasks/tasks.js'
import { TASK_STATUSES } from '../../../Core/utils/constants.js'

const dispatch = store ? store.dispatch : () => { }
export const useTaskTableDefault = (currentTime) => {
    const isFullTask = isFullTaskSelector()
    const taskList = properlyOrderedTasks() // strangely doesn't need to be memoized on currentTime. The component that calls this automatically memoizes on time due to implicit re-renders when the time changes for the parent component
    const labels = useMemo(() => getHeaderLabels(isFullTask), [isFullTask])
    const renderNumber = useMemo(() => getTaskRenderNumber(isFullTask), [isFullTask])
    const start = firstCompleteIndex(taskList), end = lastCompleteIndex(taskList) // Needed so that you can not place incomplete tasks in the range of completed tasks!
    const prevLiveTaskID = prevLiveTaskIDSelector()
    const firstIncomplete = useMemo(() => firstIncompleteIndex(taskList), [taskList]), len = taskList.length, dndConfig = dndSelector()
    // --- Update the Live Task
    useEffect(() => {
        const taskID = taskList?.[firstIncomplete]?.id
        if (taskID) { dispatch(updateTask({ taskID, field: 'liveTimeStamp', value: currentTime.toISOString() })) }
    }, [firstIncomplete, len, dndConfig])
    // --- Update the Non-Live Task (Thunks must update prevLiveTaskID)
    useEffect(() => {
        const currentTaskRow = taskList?.find(task => task?.id === prevLiveTaskID)
        const ttc = currentTaskRow?.ttc || 0.01
        const liveTime = computeUpdatedLiveTime({ oldLiveTime: currentTaskRow?.liveTime, liveTimeStamp: currentTaskRow?.liveTimeStamp, currentTime })
        const waste = computeUpdatedWaste({ liveTime, ttc }), efficiency = computeUpdatedEfficiency({ liveTime, ttc })
        if (prevLiveTaskID && currentTaskRow?.status !== TASK_STATUSES.COMPLETED) { // To prevent double completed updates since completed thunk takes care of it, preventing edge cases with useEffect
            // dispatch(updateTasksBatch([
            //     { taskID: prevLiveTaskID, field: 'liveTime', value: liveTime },
            //     { taskID: prevLiveTaskID, field: 'waste', value: waste },
            //     { taskID: prevLiveTaskID, field: 'efficiency', value: efficiency },
            // ]))
        }
    }, [prevLiveTaskID])
    return {
        childState: { taskList, labels, renderNumber },
        childServices: {
            onDragEndEvent: result => {
                if (result.destination) { dispatch(updateDnDThunk({ payload: [result.source.index, result.destination.index], completedRange: { start, end }, taskList, firstIncomplete })) }
            }
        }
    }
}