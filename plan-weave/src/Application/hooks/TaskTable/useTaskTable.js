import { useMemo } from 'react'
import { getHeaderLabels, taskListPipe } from '../../../Core/utils/helpers.js'
import store from "../../store"
import { variant as variantSelector, tasks as tasksSelector, isFullTask as isFullTaskSelector, dnd as dndSelector } from '../../selectors.js'
import { updateDnD } from '../../sessionContexts/dnd.js'

const dispatch = store ? store.dispatch : () => { }

export const useTaskTable = () => ({ variant: variantSelector() })

export const useTaskTableDefault = (currentTime) => {
    const oldTaskList = tasksSelector()
    const pipelineOptions = { dnd: dndSelector() } // TODO: Get all 10+ variables for taskList transformation pipeline
    const taskList = useMemo(() => taskListPipe(oldTaskList, pipelineOptions), [currentTime, oldTaskList, pipelineOptions,])

    const isFullTask = isFullTaskSelector()
    const labels = useMemo(() => getHeaderLabels(isFullTask), [isFullTask])
    return {
        childState: { taskList, labels },
        childServices: {
            onDragEndEvent: result => { if (result.destination) dispatch(updateDnD([result.source.index, result.destination.index])) }
        }
    }
}