import { useState, useMemo } from 'react'
import { ACTION, getDefaultState, getFSMValue, IS_HIGHLIGHTING, noAction, yesAction, handleTrashClick, handleDeleteClick, } from '../../finiteStateMachines/MultipleDeleteButton.fsm'
import { userID as userIDSelector, taskIDsToDelete as taskIDsToDeleteSelector } from '../../selectors'

export const useMultipleDeleteButton = ({ fsmControlledState, setControlledFSMState }) => {
    const [fsmState, setFSMState] = useState(getDefaultState())
    const currentFSMState = fsmControlledState ?? fsmState
    const isHighlighting = useMemo(() => getFSMValue(currentFSMState, IS_HIGHLIGHTING), [currentFSMState])
    const userID = userIDSelector(), taskIDsToDelete = taskIDsToDeleteSelector()
    const handleStateUpdate = newState => {
        getFSMValue(newState, ACTION)?.([yesAction(setControlledFSMState, newState, { userID, taskIDsToDelete }), noAction(setControlledFSMState, newState)])
        if (!fsmControlledState) { setFSMState(newState) } else { setControlledFSMState(newState) }
    }
    return { childState: { currentFSMState, isHighlighting }, childServices: { handleStateUpdate, handleTrashClick, handleDeleteClick, }, }
}