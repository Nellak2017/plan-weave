import { useMemo } from 'react'
import { getHeaderLabels, taskListPipe, getTaskRenderNumber, firstCompleteIndex, lastCompleteIndex } from '../../../Core/utils/helpers.js'
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
                if (result.destination) dispatch(updateDnDThunk({ payload: [result.source.index, result.destination.index], completedRange: { start, end } }))
            }
        }
    }
}