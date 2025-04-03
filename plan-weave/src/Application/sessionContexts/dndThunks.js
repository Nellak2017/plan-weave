import { updateDnD } from './dnd.js'
import { setPrevLiveTaskID } from './prevLiveTaskID.js'
import { between } from '../../Core/utils/helpers.js'

export const updateDnDThunk = ({ payload, completedRange, taskList, firstIncomplete }) => dispatch => {
    const [source, destination] = payload || []
    const { start, end } = completedRange || {}
    if (between(destination, { start, end })) return
    else dispatch(updateDnD([source, destination]))

    if (source === firstIncomplete) { dispatch(setPrevLiveTaskID(taskList?.[source]?.id)) }
    if (destination === firstIncomplete) { dispatch(setPrevLiveTaskID(taskList?.[destination]?.id))}
}
// this has business logic to prevent dropping on completed tasks.
// this has business logic to set prev live task so that the useEffect in useTaskTable can properly set the live->non-live task state 