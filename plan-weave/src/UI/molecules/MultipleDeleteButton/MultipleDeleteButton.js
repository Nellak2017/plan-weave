import { useState, useMemo } from 'react'
import { BiTrash } from 'react-icons/bi'
import { Button } from '@mui/material'
import { DEFAULT_TASK_CONTROL_TOOL_TIPS } from '../../../Core/utils/constants.js'
import { theme } from '../../styles/MUITheme.js'
import { getDefaultState, getFSMValue, handleTrashClick, handleDeleteClick, IS_HIGHLIGHTING, ACTION, yesAction, noAction } from '../../../Application/finiteStateMachines/MultipleDeleteButton.fsm.js'
import { userID as userIDSelector, taskIDsToDelete as taskIDsToDeleteSelector } from '../../../Application/selectors.js'

// TODO: Consider decoupling this business logic into a custom hook
const { deleteToolTip } = DEFAULT_TASK_CONTROL_TOOL_TIPS
export const MultipleDeleteButton = ({
    state: {
        MUITheme = theme, fsmControlledState = undefined,
        trashButtonState: { tabIndex = 0, title = deleteToolTip, size = '32px' } = {},
        deleteButtonState: { label = 'Delete', deleteTabIndex = 0, deleteTitle = 'Delete Selected Tasks' } = {},
    } = {},
    services: { setControlledFSMState } = {},
}) => {
    const [fsmState, setFSMState] = useState(getDefaultState()) // Uncontrolled State
    const currentFSMState = fsmControlledState ?? fsmState // Controlled State fallback to uncontrolled
    const isHighlighting = useMemo(() => getFSMValue(currentFSMState, IS_HIGHLIGHTING), [currentFSMState])
    const userID = userIDSelector(), taskIDsToDelete = taskIDsToDeleteSelector()
    // Handler to update state locally if uncontrolled or non-locally if controlled. It will also call the additional action we define too
    const handleStateUpdate = newState => {
        getFSMValue(newState, ACTION)?.([yesAction(setControlledFSMState, newState, { userID, taskIDsToDelete }), noAction(setControlledFSMState, newState)])
        if (!fsmControlledState) { setFSMState(newState) } else { setControlledFSMState(newState) }
    }
    return (<>
        <BiTrash
            tabIndex={tabIndex} title={title} size={size}
            style={isHighlighting && { color: MUITheme.palette.primary.main }}
            onClick={() => { handleTrashClick(handleStateUpdate, currentFSMState) }}
            onKeyDown={e => { if (e.key === 'Enter') { handleTrashClick(handleStateUpdate, currentFSMState) } }}
        />
        {
            isHighlighting &&
            <Button
                variant={'delete'} tabIndex={deleteTabIndex} title={deleteTitle}
                onClick={() => { handleDeleteClick(handleStateUpdate, currentFSMState) }}
                onKeyDown={e => { if (e.key === 'Enter') { handleDeleteClick(handleStateUpdate, currentFSMState) } }}
            >
                {label}
            </Button>
        }
    </>)
}
export default MultipleDeleteButton