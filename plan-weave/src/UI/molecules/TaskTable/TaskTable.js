import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { TaskTableContainer, NoTasksTd } from './TaskTable.elements.js'
import { TASK_EDITOR_WIDTH } from '../../../Core/utils/constants.js'
import { getHeaderLabels, isStatusChecked } from '../../../Core/utils/helpers.js'
import TableHeader from '../../atoms/TableHeader/TableHeader.js'
import { TaskRowDefault } from '../TaskRow/TaskRow.js'
import { useTaskTableDefault } from '../../../Application/hooks/TaskTable/useTaskTable.js'

const NoTasksRow = ({ text = 'No Tasks are made yet. Make some by pressing the + button above.' }) => (<tr><NoTasksTd colSpan='4'>{text}</NoTasksTd></tr>)

export const TaskTable = ({
    state: { labels = getHeaderLabels(false), DefaultComponent = NoTasksRow, } = {},
    services: { onDragEndEvent } = {},
    children
}) => {
    const childrenArray = React.Children.toArray(children)
    return (
        <DragDropContext onDragEnd={onDragEndEvent}>
            <TaskTableContainer maxwidth={TASK_EDITOR_WIDTH}>
                <table>
                    <TableHeader labels={labels} />
                    <Droppable droppableId="taskTable" type="TASK">
                        {provided => (
                            <tbody ref={provided.innerRef} {...provided.droppableProps}>
                                {childrenArray.length <= 0
                                    ? <DefaultComponent />
                                    : childrenArray.slice(0, childrenArray.length)}
                                {provided.placeholder}
                            </tbody>)}
                    </Droppable>
                </table>
            </TaskTableContainer>
        </DragDropContext>
    )
}

export const TaskTableDefault = ({ currentTime, customHook = useTaskTableDefault }) => {
    const { childState, childServices } = customHook?.(currentTime) || {}
    const { taskList, labels, renderNumber } = childState || {}
    const { onDragEndEvent } = childServices || {}
    return (
        <TaskTable state={{ labels }} services={{ onDragEndEvent }}>
            {taskList?.map((task, index) => (
                <Draggable isDragDisabled={isStatusChecked(task?.status)} draggableId={`task-${task?.id}`} key={`task-${task?.id}-key`} index={index}>
                    {provided => (<TaskRowDefault state={{ renderNumber, provided, taskID: task?.id, currentTime }} />)}
                </Draggable>
            ))}
        </TaskTable>
    )
}