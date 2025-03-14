import { useMemo } from 'react'
import { getHeaderLabels, taskListPipe, getTaskRenderNumber } from '../../../Core/utils/helpers.js'
import store from "../../store"
import { isFullTask as isFullTaskSelector, taskOrderPipeOptions } from '../../selectors.js'
import { updateDnD } from '../../sessionContexts/dnd.js'

const dispatch = store ? store.dispatch : () => { }
export const useTaskTableDefault = () => {
    const pipelineOptions = taskOrderPipeOptions(), isFullTask = isFullTaskSelector()
    const taskList = useMemo(() => taskListPipe(pipelineOptions), [pipelineOptions]) // strangely doesn't need to be memoized on currentTime. The component that calls this automatically memoizes on time due to implicit re-renders when the time changes for the parent component
    const labels = useMemo(() => getHeaderLabels(isFullTask), [isFullTask])
    const renderNumber = useMemo(() => getTaskRenderNumber(isFullTask), [isFullTask])
    return {
        childState: { taskList, labels, renderNumber },
        childServices: { onDragEndEvent: result => { if (result.destination) dispatch(updateDnD([result.source.index, result.destination.index])) } }
    }
}