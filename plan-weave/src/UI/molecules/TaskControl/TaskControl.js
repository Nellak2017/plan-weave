import 'react-toastify/dist/ReactToastify.css'
import { TaskControlContainer } from './TaskControl.elements'
import { TopSlot, BottomSlot } from './TaskControl.slots.js'
import useTaskControl from '../../../Application/hooks/TaskControl/useTaskControl.js'

// TODO: Code smell. TopSlot and BottomSlot should worry about variant and many other things themselves
export const TaskControl = ({ currentTime, customHook = useTaskControl}) => {
	const { childState, childServices } = customHook?.() || {}
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