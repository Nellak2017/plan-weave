import { useState } from 'react'
import {
	TaskRowStyled,
	DragIndicator,
	TaskContainer,
	TimeContainer,
	IconContainer
} from './TaskRow.elements.js'
import TaskInput from '../../atoms/TaskInput/TaskInput.js'
import HoursInput from '../../atoms/HoursInput/HoursInput.js'
import {
	MdOutlineCheckBoxOutlineBlank,
	MdOutlineCheckBox
} from 'react-icons/md'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { BiTrash } from 'react-icons/bi'
import { Draggable } from 'react-beautiful-dnd'
import { formatTimeLeft } from '../../utils/helpers.js'
import { THEMES, TASK_STATUSES } from '../../utils/constants.js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { removeTask } from '../../../redux/thunks/taskThunks.js'
import { useDispatch, useSelector } from 'react-redux'
/*
TODO: Based on Status, conditionally render the highlighting feature
TODO: Add Status Prop that will conditionally render the Gray, Yellow, Orange, and Green highlights for tasks 
TODO: Add Outline Prop that will let you define a color for the outline if there is one at all (used in selection)
TODO: Fine tune the spacing of the row items to make it more natural. Especially the icons.
*/

function TaskRow({ task, waste, ttc, eta = '0 hours', status = TASK_STATUSES.INCOMPLETE, id = 0, variant = 'dark', maxwidth = 818, updateTask, index }) {
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (!maxwidth || isNaN(maxwidth) || maxwidth <= 0) maxwidth = 818
	if (id === undefined || id === null || isNaN(id) || id < 0) console.error(`Id is not a valid number, id = ${id}`)
	if (index === undefined || index === null || isNaN(index) || index < 0) console.error(`index is not a valid number in row = ${id}, index = ${index}`)

	const dispatch = useDispatch()
	const tasks = useSelector(state => state.tasks)
	const [isChecked, setIsChecked] = useState(status === TASK_STATUSES.COMPLETED)
	const handleCheckBoxClicked = () => setIsChecked(!isChecked)
	const uniqueId = `task-${id}` // used for drag-n-drop feature.
	const handleTaskChange = newTask => {
		updateTask(task.id, newTask)
	}
	const handleDeleteTask = () => {
		dispatch(removeTask(id))
		toast.info('This Task was deleted')
	}

	// Add Update Feature

	return (
		<Draggable draggableId={uniqueId} index={index}>
			{(provided) => (
				<TaskRowStyled
					variant={variant}
					status={status}
					ref={provided.innerRef}
					{...provided.draggableProps}
					style={{
						...provided.draggableProps.style,
						// Apply custom styles when dragging
						boxShadow: provided.isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
						// Add any other styles you want to maintain during dragging
					}}
					maxwidth={maxwidth}>
					<IconContainer {...provided.dragHandleProps}>
						<DragIndicator size={32} />
					</IconContainer>
					<IconContainer>
						{isChecked ? (
							<MdOutlineCheckBox size={32} onClick={handleCheckBoxClicked} />
						) : (
							<MdOutlineCheckBoxOutlineBlank size={32} onClick={handleCheckBoxClicked} />
						)}
					</IconContainer>
					<TaskContainer>
						<TaskInput initialValue={task} variant={variant} />
					</TaskContainer>
					<TimeContainer>
						<p>
							{waste && !isNaN(waste) && waste > 0 ?
								formatTimeLeft({
									timeDifference: waste,
									minuteText: 'minutes',
									hourText: 'hour',
									hourText2: 'hours'
								}) :
								'0 minutes'}
						</p>
					</TimeContainer>
					<TimeContainer>
						<HoursInput initialValue={ttc} variant={variant} placeholder='hours' text='hours' />
					</TimeContainer>
					<TimeContainer>
						<p>
							{eta && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(eta) ? eta : '00:00'}
						</p>
					</TimeContainer>
					<IconContainer>
						<BiTrash onClick={handleDeleteTask} size={32} />
					</IconContainer>
				</TaskRowStyled>
			)}
		</Draggable>
	)
}

export default TaskRow