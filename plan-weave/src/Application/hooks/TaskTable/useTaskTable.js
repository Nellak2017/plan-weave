import { useMemo } from 'react'
import { getHeaderLabels, taskListPipe, getTaskRenderNumber, firstCompleteIndex, lastCompleteIndex, getTaskIndexes } from '../../../Core/utils/helpers.js'
import { TASK_STATUSES } from '../../../Core/utils/constants.js'
import store from "../../store"
import { isFullTask as isFullTaskSelector, taskOrderPipeOptions } from '../../selectors.js'
import { updateDnDThunk } from '../../thunks.js'

const dispatch = store ? store.dispatch : () => { }
export const useTaskTableDefault = () => {
    const pipelineOptions = taskOrderPipeOptions(), isFullTask = isFullTaskSelector()
    const taskList = useMemo(() => taskListPipe(pipelineOptions), [pipelineOptions]) // strangely doesn't need to be memoized on currentTime. The component that calls this automatically memoizes on time due to implicit re-renders when the time changes for the parent component
    const labels = useMemo(() => getHeaderLabels(isFullTask), [isFullTask])
    const renderNumber = useMemo(() => getTaskRenderNumber(isFullTask), [isFullTask])
    const start = firstCompleteIndex(taskList), end = lastCompleteIndex(taskList) // Needed so that you can not place incomplete tasks in the range of completed tasks!
    return {
        childState: { taskList, labels, renderNumber },
        childServices: {
            onDragEndEvent: result => {
                if (result.destination) {
                    const taskID = taskList[result.destination.index]?.id
                    const isLive = taskList?.findIndex(task => task?.status !== TASK_STATUSES.COMPLETED) === taskList?.findIndex(task => task?.id === taskID)
                    const taskUpdateInfo = isLive
                        ? { taskID, value: new Date().toISOString() }
                        : undefined // if live then send the taskUpdateInfo, otherwise don't send at all so it won't update the liveTimeStamp
                    console.log(isLive)
                    dispatch(updateDnDThunk({ payload: [result.source.index, result.destination.index], completedRange: { start, end }, taskUpdateInfo }))
                }
            }
        }
    }
}