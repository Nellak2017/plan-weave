import { updateFsmControlledState } from './multiDeleteSlice.js'
import { CHOOSE, CHOSEN } from '../../../UI/molecules/MultipleDeleteButton/MultipleDeleteButton.fsm.js'
import DeleteModal from '../../../UI/atoms/DeleteModal/DeleteModal.js'
import { toast } from 'react-toastify'

const removeTasksThunkAPI = ({}) => dispatch => {
    //  try {
    //     deleteTasksAPI(taskIdList, userId) // DELETE here
    //     dispatch(deleteGlobalTasks(taskIdList))
    //     toast.info('The tasks were deleted')
    //   } catch (e) {
    //     console.error(e)
    //     toast.error('The Tasks failed to be deleted')
    //   }
}

export const updateMultiDeleteFSMThunk = ({ id, value }) => dispatch => {
    dispatch(updateFsmControlledState({ id, value }))
    if (value === CHOOSE) {
        toast.info('You may now select multiple tasks to delete at once! Click again to toggle.')
        // TODO: Possibly add a reducer to set selected tasks to false. We may have to store that in the store somewhere..
    }
    if (value === CHOSEN) {
        // TODO: Implement the Yes and No events for DeleteModal properly. They include updating the fsm state and dispatching a delete api call
        toast.warning(({ closeToast }) => (
            <DeleteModal
                services={{
                    optionHandlers: [() => console.warn('Event for yes not implemented'), () => console.warn('Event for no not implemented')],
                    closeToast
                }}
            />),
            { position: toast.POSITION.TOP_CENTER, autoClose: false, closeOnClick: false, closeButton: false, draggable: false, })
    }
} // Reducer + Business Logic + Side-Effects