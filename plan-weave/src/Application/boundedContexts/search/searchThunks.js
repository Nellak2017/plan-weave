import { setSearchValue } from './searchSlice.js'
export const searchThunk = ({ id, value }) => dispatch => { dispatch(setSearchValue({ id, value: value.trim() })) } // Reducer + Business Logic