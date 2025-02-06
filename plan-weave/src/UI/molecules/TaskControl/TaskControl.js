import 'react-toastify/dist/ReactToastify.css'
import { TaskControlContainer } from './TaskControl.elements'
import { TopSlot, BottomSlot } from './TaskControl.slots.js'
import useTaskControl from '../../../Application/hooks/TaskControl/useTaskControl.js'

export const TaskControl = ({ currentTime }) => {
	const { childState, childServices } = useTaskControl() || {}
	const { variant, startTime, endTime, isOwl, isFullTask, fsmControlledState } = childState || {}
	const { search, sort, checkTimeRange, toggleOwl, fullTaskToggle, updateTimeRange, setMultiDeleteFSMState, addTask } = childServices || {}
	return (
		<TaskControlContainer variant={variant} maxwidth={818}>
			<TopSlot state={{ variant, currentTime, startTime, endTime, isOwl }} services={{ search, updateTimeRange, toggleOwl }} />
			<BottomSlot state={{ variant, currentTime, endTime, isFullTask, fsmControlledState, isOwl }} services={{ addTask, fullTaskToggle, setMultiDeleteFSMState, sort }} />
		</TaskControlContainer>
	)
}
export default TaskControl