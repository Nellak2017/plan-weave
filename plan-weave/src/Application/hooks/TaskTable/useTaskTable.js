import { useMemo } from 'react'
import { getHeaderLabels, taskListPipe, getTaskRenderNumber } from '../../../Core/utils/helpers.js'
import store from "../../store"
import { variant as variantSelector, isFullTask as isFullTaskSelector, taskOrderPipeOptions } from '../../selectors.js'
import { updateDnD } from '../../sessionContexts/dnd.js'

const dispatch = store ? store.dispatch : () => { }

export const useTaskTable = () => ({ variant: variantSelector() })

export const useTaskTableDefault = currentTime => {
    const pipelineOptions = taskOrderPipeOptions(), isFullTask = isFullTaskSelector()
    const taskList = useMemo(() => taskListPipe(pipelineOptions), [currentTime, pipelineOptions])
    const labels = useMemo(() => getHeaderLabels(isFullTask), [isFullTask])
    const renderNumber = useMemo(() => getTaskRenderNumber(isFullTask), [isFullTask])
    return {
        childState: { taskList, labels, renderNumber },
        childServices: {
            onDragEndEvent: result => { if (result.destination) dispatch(updateDnD([result.source.index, result.destination.index])) }
        }
    }
}