import { updateFsmControlledState } from './multiDeleteSlice.js'

export const updateMultiDeleteFSMThunk = ({ id, value }) => dispatch => { dispatch(updateFsmControlledState({ id, value })) } // Reducer + Business Logic + Side-Effects