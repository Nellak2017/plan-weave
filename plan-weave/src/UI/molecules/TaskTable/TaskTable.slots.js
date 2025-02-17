import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { TaskTableContainer } from './TaskTable.elements'
import { TASK_EDITOR_WIDTH } from '../../../Core/utils/constants.js'
import { getHeaderLabels, isStatusChecked } from '../../../Core/utils/helpers.js'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import { TaskRowDefault } from '../TaskRow/TaskRow.slots.js'
import { useTaskTable, useTaskTableDefault } from '../../../Application/hooks/TaskTable/useTaskTable.js'

const NoTasksRow = ({ text = 'No Tasks are made yet. Make some by pressing the + button above.' }) => (<tr><td colSpan='4' style={{ width: '818px', textAlign: 'center' }}>{text}</td></tr>)

export const TaskTable = ({
    customHook = useTaskTable,
    state: { labels = getHeaderLabels(false), DefaultComponent = NoTasksRow, } = {},
    services: { onDragEndEvent } = {},
    children
}) => {
    const { variant } = customHook?.() || {}
    const childrenArray = React.Children.toArray(children)
    return (
        <DragDropContext onDragEnd={onDragEndEvent}>
            <TaskTableContainer variant={variant} maxwidth={TASK_EDITOR_WIDTH}>
                <table>
                    <TableHeader variant={variant} labels={labels} />
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
    const { taskList, labels } = childState || {}
    const { onDragEndEvent } = childServices || {}
    return (
        <TaskTable state={{ labels }} services={{ onDragEndEvent }}>
            {taskList?.map((task, index) => (
                <Draggable
                    isDragDisabled={isStatusChecked(task?.status)}
                    draggableId={`task-${task?.id}`}
                    key={`task-${task?.id}-key`}
                    index={index} // TODO: Make sure index is accurate
                >
                    {provided => (<TaskRowDefault state={{ renderNumber: 6, provided, taskID: task?.id }} />)}
                </Draggable>
            ))}
        </TaskTable>
    )
}