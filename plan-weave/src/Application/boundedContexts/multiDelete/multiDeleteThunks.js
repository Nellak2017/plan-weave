import { updateFsmControlledState } from './multiDeleteSlice.js'

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
} // Reducer + Business Logic + Side-Effects