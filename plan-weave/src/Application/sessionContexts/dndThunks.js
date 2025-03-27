import { updateDnD } from './dnd.js'
import { updateTask } from '../entities/tasks/tasks.js'
import { between } from '../../Core/utils/helpers.js'

export const updateDnDThunk = ({ payload, completedRange, taskUpdateInfo }) => dispatch => {
    const [source, destination] = payload || []
    const { start, end } = completedRange || {}
    if (between(destination, { start, end })) return
    else dispatch(updateDnD([source, destination]))

    const { taskID, value } = taskUpdateInfo || {} // if not provided or undefined, it is assumed to not be live so is not updated
    if (!taskUpdateInfo) return // if it is not live, then don't update the liveTimeStamp
    else dispatch(updateTask({ taskID, field: 'liveTimeStamp', value })) // destructured for easy reading due to no types
}
// this has business logic to prevent dropping on completed tasks.
// It also will set the liveTimeStamp if the task is now in the live position