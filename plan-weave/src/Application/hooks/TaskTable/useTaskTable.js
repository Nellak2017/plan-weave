import { useMemo } from 'react'
import { getHeaderLabels, getTaskRenderNumber, firstCompleteIndex, lastCompleteIndex, firstIncompleteIndex } from '../../../Core/utils/helpers.js'
import store from "../../store"
import { isFullTask as isFullTaskSelector, properlyOrderedTasks } from '../../selectors.js'
import { updateDnDThunk } from '../../thunks.js'

const dispatch = store ? store.dispatch : () => { }
export const useTaskTableDefault = () => {
    const isFullTask = isFullTaskSelector()
    const taskList = properlyOrderedTasks() // strangely doesn't need to be memoized on currentTime. The component that calls this automatically memoizes on time due to implicit re-renders when the time changes for the parent component
    const labels = useMemo(() => getHeaderLabels(isFullTask), [isFullTask])
    const renderNumber = useMemo(() => getTaskRenderNumber(isFullTask), [isFullTask])
    const start = firstCompleteIndex(taskList), end = lastCompleteIndex(taskList) // Needed so that you can not place incomplete tasks in the range of completed tasks!
    const firstIncomplete = useMemo(() => firstIncompleteIndex(taskList), [taskList])
    return {
        childState: { taskList, labels, renderNumber },
        childServices: {
            onDragEndEvent: result => {
                if (result.destination) { dispatch(updateDnDThunk({ payload: [result.source.index, result.destination.index], completedRange: { start, end }, taskList, firstIncomplete })) }
            }
        }
    }
}