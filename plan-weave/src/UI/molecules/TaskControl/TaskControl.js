import 'react-toastify/dist/ReactToastify.css'
import { TaskControlContainer } from './TaskControl.elements'
import { TopSlot, BottomSlot } from './TaskControl.slots.js'

export const TaskControl = ({ currentTime }) => (
	<TaskControlContainer maxwidth={818}>
		<TopSlot currentTime={currentTime} /><BottomSlot currentTime={currentTime} />
	</TaskControlContainer>
)
export default TaskControl