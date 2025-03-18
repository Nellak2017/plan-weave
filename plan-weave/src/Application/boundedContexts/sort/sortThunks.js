import { updateSortingAlgorithm } from './sortSlice.js'
import { resetDnD } from '../../sessionContexts/dnd.js'
export const sortThunk = ({ id, value }) => dispatch => { 
    dispatch(resetDnD()) // this is a quality of life feature, it will reset dnd each time sort algo changes
    dispatch(updateSortingAlgorithm({ id, value })) 
} // Reducer + Business Logic