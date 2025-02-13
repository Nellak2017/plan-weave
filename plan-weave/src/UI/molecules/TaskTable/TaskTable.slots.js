import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { TaskTableContainer } from './TaskTable.elements'
import { VARIANTS, TASK_EDITOR_WIDTH, FULL_TASK_HEADERS } from '../../../Core/utils/constants.js'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import { TaskRowDefault } from '../TaskRow/TaskRow.slots.js'

const getHeaderLabels = isFullTask => FULL_TASK_HEADERS.slice(0, isFullTask ? FULL_TASK_HEADERS.length : 4)

const NoTasksRow = ({ text = 'No Tasks are made yet. Make some by pressing the + button above.' }) => (<tr><td colSpan='4' style={{ width: '818px', textAlign: 'center' }}>{text}</td></tr>)

export const TaskTable = ({
    customHook,
    state: { labels = getHeaderLabels(false), DefaultComponent = NoTasksRow, } = {},
    services: { onDragEndEvent } = {},
    children
}) => {
    // const { variant ... } = customHook?.() || hook() // (use same default hook as default component)
    const variant = VARIANTS[0] // TODO: Replace with hook
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

export const TaskTableDefault = ({ currentTime, customHook }) => {
    // const { variant, taskList, ... } = customHook?.() || hook()
    const taskList = [{ id: 'first' }] // TODO: Replace with hook
    // TODO: Replace the index in draggableId and key with id below so it is accurate
    // TODO: Make isDragDisabled disabled when the task is a completed task only
    return (
        <TaskTable>
            {taskList?.map((task, index) => (
                <Draggable isDragDisabled={false} draggableId={`task-${task?.id}`} key={`task-${task?.id}-key`} index={index}>
                    {provided => (<TaskRowDefault state={{ renderNumber: 6, provided }} />)}
                </Draggable>
            ))}
        </TaskTable>
    )
}
// {/* state={{labels}} services={{onDragEndEvent}}*/}