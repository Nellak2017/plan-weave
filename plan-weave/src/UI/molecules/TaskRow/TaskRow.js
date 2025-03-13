import React from 'react'
import { useTaskRow } from '../../../Application/hooks/TaskRow/useTaskRow'
import { TASK_EDITOR_WIDTH } from '../../../Core/utils/constants.js'
import { getTaskRowDnDStyle } from '../../../Core/utils/helpers.js'
import { TaskRowStyled } from './TaskRow.elements'
import { Drag, CompleteIcon, TaskInputContainer, Waste, Ttc, Eta, Efficiency, Due, Weight, Thread, Dependency, Trash } from './TaskRow.slots'

export const TaskRow = ({ renderNumber, children }) => <>{React.Children.toArray(children).slice(0, renderNumber || React.Children.toArray(children).length)}</> // Renders slice of children, and if no range provided it renders all children

export const TaskRowDefault = ({ state: { renderNumber, provided, taskID, currentTime } = {}, customHook = useTaskRow }) => {
    const { status, highlight } = customHook?.(taskID) || {}
    return (
        <TaskRowStyled
            status={status} highlight={highlight}
            style={getTaskRowDnDStyle(provided)} maxwidth={TASK_EDITOR_WIDTH}
            ref={provided?.innerRef} {...provided?.draggableProps}
        >
            <TaskRow renderNumber={renderNumber}>
                <Drag provided={provided} />
                <CompleteIcon taskID={taskID} currentTime={currentTime} />
                <TaskInputContainer taskID={taskID} />
                <Waste taskID={taskID} currentTime={currentTime} />
                <Ttc taskID={taskID} />
                <Eta taskID={taskID} currentTime={currentTime} />
                <Efficiency taskID={taskID} currentTime={currentTime} />
                <Due taskID={taskID} />
                <Weight taskID={taskID} />
                <Thread taskID={taskID} />
                <Dependency taskID={taskID} />
            </TaskRow>
            <Trash />
        </TaskRowStyled>
    )
}