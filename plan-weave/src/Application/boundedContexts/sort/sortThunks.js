import { updateSortingAlgorithm } from './sortSlice.js'
export const sortThunk = ({ id, value }) => dispatch => { dispatch(updateSortingAlgorithm({ id, value })) } // Reducer + Business Logic