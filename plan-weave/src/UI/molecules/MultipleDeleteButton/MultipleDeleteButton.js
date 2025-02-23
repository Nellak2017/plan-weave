import { useState, useMemo } from 'react'
import { BiTrash } from 'react-icons/bi'
import { Button } from '@mui/material'
import { DEFAULT_TASK_CONTROL_TOOL_TIPS } from '../../../Core/utils/constants.js'
import { theme } from '../../styles/MUITheme.js'
import { getDefaultState, getFSMValue, handleTrashClick, handleDeleteClick, IS_HIGHLIGHTING, ACTION } from './MultipleDeleteButton.fsm.js'
import { toast } from 'react-toastify'

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

    // Handler to update state locally if uncontrolled or non-locally if controlled. It will also call the additional action we define too
    const handleStateUpdate = newState => {
        console.log({ prev: currentFSMState, curr: newState })
        getFSMValue(newState, ACTION)?.() // used to do a side-effecting action on a state-change
        if (!fsmControlledState) { setFSMState(newState) } else { setControlledFSMState(newState) }
    }
    return (<>
        <BiTrash
            tabIndex={tabIndex} title={title} size={size}
            style={isHighlighting && { color: MUITheme.palette.primary.main }}
            onClick={() => {
                handleTrashClick(handleStateUpdate, currentFSMState);
                deleteEvent?.(services, toast, setIsDeleteClicked, isHighlighting, taskList)
            }}
            onKeyDown={e => {
                handleTrashClick(handleStateUpdate, currentFSMState);
                if (e.key === 'Enter') { deleteEvent?.(services, toast, setIsDeleteClicked, isHighlighting, taskList) }
            }}
        />
        {
            isHighlighting &&
            <Button
                variant={'delete'} tabIndex={deleteTabIndex} title={deleteTitle}
                onClick={() => {
                    handleDeleteClick(handleStateUpdate, currentFSMState);
                    deleteMultipleEvent?.({ state: { userID, selectedTasks, taskList, isDeleteClicked, toast }, services: { deleteMany: services?.deleteMany, highlighting: services?.highlighting, setIsDeleteClicked }, })
                }}
                onKeyDown={e => {
                    handleDeleteClick(handleStateUpdate, currentFSMState);
                    if (e.key === 'Enter') { deleteMultipleEvent?.({ state: { userID, selectedTasks, taskList, isDeleteClicked, toast }, services: { deleteMany: services?.deleteMany, highlighting: services?.highlighting, setIsDeleteClicked }, }) }
                }}
            >
                {label}
            </Button>
        }
    </>)
}
export default MultipleDeleteButton