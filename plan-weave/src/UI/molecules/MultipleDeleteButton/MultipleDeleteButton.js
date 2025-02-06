import { useState, useMemo } from 'react'
import { BiTrash } from 'react-icons/bi'
import { Button } from '@mui/material'
import { DEFAULT_TASK_CONTROL_TOOL_TIPS } from '../../../Core/utils/constants.js'
import { theme } from '../../styles/MUITheme.js'
import { getDefaultState, getFSMValue, handleTrashClick, handleDeleteClick, IS_HIGHLIGHTING } from './MultipleDeleteButton.fsm.js'

const { deleteToolTip } = DEFAULT_TASK_CONTROL_TOOL_TIPS
export const MultipleDeleteButton = ({
    state: {
        MUITheme = theme, fsmControlledState = undefined,
        trashButtonState: { tabIndex = 0, title = deleteToolTip, size = '32px' } = {}, deleteButtonState: { label = 'Delete', deleteTabIndex = 0, deleteTitle = 'Delete Selected Tasks' } = {},
    } = {},
    services: { deleteEvent, deleteMultipleEvent, setControlledFSMState } = {},
}) => {
    const [fsmState, setFSMState] = useState(getDefaultState()) // Uncontrolled State
    const currentFSMState = fsmControlledState ?? fsmState // Controlled State fallback to uncontrolled
    const isHighlighting = useMemo(() => getFSMValue(currentFSMState, IS_HIGHLIGHTING), [currentFSMState])
    const handleStateUpdate = newState => { if (!fsmControlledState) { setFSMState(newState) } else { setControlledFSMState(newState) } } // Handler to update state locally if uncontrolled or non-locally if controlled
    return (<>
        <BiTrash
            tabIndex={tabIndex} title={title} size={size}
            style={isHighlighting && { color: MUITheme.palette.primary.main }}
            onClick={() => { handleTrashClick(handleStateUpdate, currentFSMState); if (deleteEvent) { deleteEvent(services, toast, setIsDeleteClicked, isHighlighting, taskList) } }}
            onKeyDown={e => { handleTrashClick(handleStateUpdate, currentFSMState); if (deleteEvent && e.key === 'Enter') { deleteEvent(services, toast, setIsDeleteClicked, isHighlighting, taskList) } }}
        />
        {
            isHighlighting &&
            <Button
                variant={'delete'} tabIndex={deleteTabIndex} title={deleteTitle}
                onClick={() => { handleDeleteClick(handleStateUpdate, currentFSMState); if (deleteMultipleEvent) { deleteMultipleEvent({ state: { userId, selectedTasks, taskList, isDeleteClicked, toast }, services: { deleteMany: services?.deleteMany, highlighting: services?.highlighting, setIsDeleteClicked }, }) } }}
                onKeyDown={e => { handleDeleteClick(handleStateUpdate, currentFSMState); if (deleteMultipleEvent && e.key === 'Enter') { deleteMultipleEvent({ state: { userId, selectedTasks, taskList, isDeleteClicked, toast }, services: { deleteMany: services?.deleteMany, highlighting: services?.highlighting, setIsDeleteClicked }, }) } }}
            >
                {label}
            </Button>
        }
    </>)
}
export default MultipleDeleteButton