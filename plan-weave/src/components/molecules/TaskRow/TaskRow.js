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
import { Draggable } from 'react-beautiful-dnd'

// TODO: Verify that passed index is a number and is defined, not null
// TODO: When Dragging, ensure consistent sizing
// TODO: Find out why dnd feature is sometimes inconsistent

function TaskRow({ variant, task, waste, ttc, eta = '0 hours', maxwidth = 818, id = 0, index }) {
	const [isChecked, setIsChecked] = useState(false)
	const handleCheckBoxClicked = () => setIsChecked(!isChecked)
	const uniqueId = `task-${id}` // used for drag-n-drop feature. Check if undefined/null
	return (
		<Draggable draggableId={uniqueId} index={index}>
			{(provided) => (
				<TaskRowStyled
					variant={variant}
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
						<p>{waste}</p>
					</TimeContainer>
					<TimeContainer>
						<HoursInput initialValue={ttc} variant={variant} />
					</TimeContainer>
					<TimeContainer>
						<p>{eta ? eta : '0 hours'}</p>
					</TimeContainer>
					<IconContainer>
						<AiOutlineEllipsis size={32} />
					</IconContainer>
				</TaskRowStyled>
			)}
		</Draggable>
	)
}

export default TaskRow