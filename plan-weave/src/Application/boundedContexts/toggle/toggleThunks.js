import { toggleState } from './toggleSlice.js'
export const toggleThunk = ({ id }) => dispatch => { dispatch(toggleState({ id })) } // Reducer + Business Logic