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
import { BiTrash } from 'react-icons/bi'
import { Draggable } from 'react-beautiful-dnd'
import { formatTimeLeft } from '../../utils/helpers.js'
import { THEMES, TASK_STATUSES } from '../../utils/constants.js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { removeTask, updateTask } from '../../../redux/thunks/taskThunks.js'
import { useDispatch } from 'react-redux'
import { pureTaskAttributeUpdate } from '../../utils/helpers'
import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../../schemas/simpleTaskSchema/simpleTaskSchema'

import { Timestamp } from 'firebase/firestore'
const timestampOuter = Timestamp.fromDate(new Date()).seconds
/*
TODO: Add Outline Prop that will let you define a color for the outline if there is one at all (used in selection)
TODO: Fine tune the spacing of the row items to make it more natural. Especially the icons.
TODO: Instead of passing many task props, pass task Object instead
TODO: Find out if validation is needed or not
TODO: Add required Redux stuff to stories
*/

function TaskRow({ task, waste, ttc, eta = '0 hours', status = TASK_STATUSES.INCOMPLETE, id = 0, timestamp = timestampOuter,
	variant = 'dark', maxwidth = 818, index, old = 'no', useContextData = true }) {
	// Input Checks
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (!maxwidth || isNaN(maxwidth) || maxwidth <= 0) maxwidth = 818
	if (id === undefined || id === null || isNaN(id) || id < 0) console.error(`Id is not a valid number, id = ${id}`)
	if (index === undefined || index === null || isNaN(index) || index < 0) console.error(`index is not a valid number in row = ${id}, index = ${index}`)

	// Redux + Some Optional Local State
	const dispatch = useDispatch()
	const uniqueId = `task-${id}` // used for drag-n-drop feature.
	const [isChecked, setIsChecked] = useState(status === TASK_STATUSES.COMPLETED)
	const [localStatus, setLocalStatus] = useState(status) // Used to have local task highlighting instead of relying on redux solely (optional)

	// Handlers
	const handleCheckBoxClicked = async () => {
		if (!isChecked) toast.info('This Task was Completed')

		// Try to validate the task, if it fails then use defaults and warn user
		const validateTask = task => {
			try {
				// validate task using schema
				const validatedTask = simpleTaskSchema.validateSync(task, {
					abortEarly: false, // Report all validation errors
					stripUnknown: true, // Remove unknown fields
				})
				// Fill defaults for missing properties in the validated task
				const modifiedTask = fillDefaultsForSimpleTask(validatedTask)
				return modifiedTask
			} catch (validationError) {
				console.error('Task validation error:', error)
				return null // Return null for invalid tasks
			}
		}
		const validTask = validateTask({ task, waste, ttc, eta, status, id, timestamp })

		const updatedTask = await pureTaskAttributeUpdate({
			index: 0,
			attribute: 'status',
			value: isChecked ? TASK_STATUSES.INCOMPLETE : TASK_STATUSES.COMPLETED,
			taskList: [validTask]
		})
		updateTask(id, updatedTask[0])(dispatch)
		setIsChecked(!isChecked)

		if (!useContextData) setLocalStatus(isChecked ? TASK_STATUSES.INCOMPLETE : TASK_STATUSES.COMPLETED) // Local Status Update if not using redux
	}

	const handleDeleteTask = () => {
		removeTask(id)(dispatch)
		toast.info('This Task was deleted')
	}

	return (
		<Draggable draggableId={uniqueId} index={index}>
			{provided => (
				<TaskRowStyled
					variant={variant}
					status={useContextData ? status : localStatus} // local status update optionally or context status
					ref={provided.innerRef}
					{...provided.draggableProps}
					style={{
						...provided.draggableProps.style,
						// Apply custom styles when dragging
						boxShadow: provided.isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
						// Add any other styles you want to maintain during dragging
					}}
					maxwidth={maxwidth}
					old={old}
				>
					<IconContainer title={'Drag-n-Drop tasks to change view'} {...provided.dragHandleProps}>
						<DragIndicator size={32} />
					</IconContainer>
					<IconContainer title={isChecked ? 'Mark Incomplete' : 'Mark Complete'}>
						{isChecked ? (
							<MdOutlineCheckBox size={32} onClick={handleCheckBoxClicked} />
						) : (
							<MdOutlineCheckBoxOutlineBlank size={32} onClick={handleCheckBoxClicked} />
						)}
					</IconContainer>
					<TaskContainer title={'Task Name'}>
						<TaskInput initialValue={task} variant={variant} />
					</TaskContainer>
					<TimeContainer title={'Wasted Time on this Task'}>
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
					<TimeContainer title={'Time To Complete Task'}>
						<HoursInput initialValue={ttc} variant={variant} placeholder='hours' text='hours' />
					</TimeContainer>
					<TimeContainer title={'Estimated Time to Finish Task'}>
						<p>
							{eta && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(eta) ? eta : '00:00'}
						</p>
					</TimeContainer>
					<IconContainer>
						<BiTrash title={'Delete this task'} onClick={handleDeleteTask} size={32} />
					</IconContainer>
				</TaskRowStyled>
			)}
		</Draggable>
	)
}

export default TaskRow