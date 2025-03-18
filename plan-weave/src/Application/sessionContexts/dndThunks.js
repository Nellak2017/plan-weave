import { updateDnD } from './dnd.js'
import { between } from '../../Core/utils/helpers.js'
export const updateDnDThunk = ({ payload, completedRange }) => dispatch => {
    const [source, destination] = payload || []
    const { start, end } = completedRange || {}
    if (between(destination, { start, end })) return
    else dispatch(updateDnD([source, destination]))
} // this has business logic to prevent dropping on completed tasks