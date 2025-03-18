import { BiTrash } from 'react-icons/bi'
import { Button } from '@mui/material'
import { DEFAULT_TASK_CONTROL_TOOL_TIPS } from '../../../Core/utils/constants.js'
import { theme } from '../../styles/MUITheme.js'
import { useMultipleDeleteButton } from '../../../Application/hooks/MultipleDeleteButton/useMultipleDeleteButton.js'

const { deleteToolTip } = DEFAULT_TASK_CONTROL_TOOL_TIPS
export const MultipleDeleteButton = ({
    state: {
        MUITheme = theme, fsmControlledState = undefined,
        trashButtonState: { tabIndex = 0, title = deleteToolTip, size = '32px' } = {},
        deleteButtonState: { label = 'Delete', deleteTabIndex = 0, deleteTitle = 'Delete Selected Tasks' } = {},
    } = {},
    services: { setControlledFSMState } = {},
    customHook = useMultipleDeleteButton
}) => {
    const { childState, childServices } = customHook?.({ fsmControlledState, setControlledFSMState }) || {}
    const { currentFSMState, isHighlighting } = childState
    const { handleStateUpdate, handleTrashClick, handleDeleteClick, } = childServices
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