import { useState, useEffect } from 'react'
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
import { formatTimeLeft, millisToHours, hoursToMillis } from '../../utils/helpers.js'
import { THEMES, TASK_STATUSES } from '../../utils/constants.js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { removeTask, updateTask } from '../../../redux/thunks/taskThunks.js'
import { useDispatch } from 'react-redux'
import { validateTask } from '../../utils/helpers'
import { parse, format } from 'date-fns'

import isEqual from 'lodash/isEqual'

import { Timestamp } from 'firebase/firestore'
const timestampOuter = Timestamp.fromDate(new Date()).seconds
/*
TODO: Fine tune the spacing of the row items to make it more natural. Especially the icons.
TODO: Add required Redux stuff to stories
TODO: Test validateTask
TODO: refactor old prop into highlight prop so that 'old', 'outline' can be added so that 'old'=gray out, 'outline'=white outline
TODO: Add Schema prop for TaskRow so that it can handle the Full Task
TODO: Extract the 3 inline styles into some new classes or something, to reduce coupling
TODO: When API is set up, set invalid id to be the latest id in the database, to avoid ugly errors 
*/

function TaskRow({ taskObject = { task: 'example', waste: 0, ttc: 1, eta: '0 hours', status: TASK_STATUSES.INCOMPLETE, id: 0, timestamp: timestampOuter },
	variant = 'dark', maxwidth = 818, index, highlight = 'no', lastCompletedTask }) {

	// destructure taskObject and context
	const { task, waste, ttc, eta, status, id, timestamp } = { ...taskObject }

	// Input Checks
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (!maxwidth || isNaN(maxwidth) || maxwidth <= 0) maxwidth = 818
	if (index === undefined || index === null || isNaN(index) || index < 0) console.error(`index is not a valid number in row = ${id}, index = ${index}`)
	if (id === undefined || id === null || isNaN(id) || id < 0) console.error(`Id is not a valid number for task index = ${index}, id = ${id}`)

	// Redux + Checkmark state (change locally because it is faster)
	const dispatch = useDispatch()
	const [isChecked, setIsChecked] = useState(status.toLowerCase().trim() === TASK_STATUSES.COMPLETED)

	// TODO: Refactor this into something better like formik
	// Local State of the form so that it may be updated into the redux store
	const [localTask, setLocalTask] = useState(task)
	const [localTtc, setLocalTtc] = useState(ttc)

	// Update Task in Redux Store if it is invalid only on the first load
	useEffect(() => {
		try {
			const validTask = validateTask({ task: taskObject })
			if (!isEqual(validTask, taskObject)) updateTask(id, validTask)(dispatch)
		} catch (invalidTask) {
			console.error(invalidTask.message)
			toast.error('Your Tasks are messed up and might not display right, it is likely a database issue.')
		}
	}, [])

	// Handlers
	const handleCheckBoxClicked = () => {
		if (!isChecked) toast.info('This Task was Completed')
		const currentTime = new Date()
		const newWaste = !lastCompletedTask || (lastCompletedTask && !lastCompletedTask?.eta)
			? millisToHours((currentTime.getTime() - parse(eta, 'HH:mm', currentTime).getTime())) // if lastCompletedTask is falsey
			: millisToHours(currentTime.getTime() - (parse(lastCompletedTask.eta, 'HH:mm', currentTime).getTime() + hoursToMillis(localTtc))) // if lastCompletedTask is not null or undefined / falsey 
		const updatedTask = {
			...validateTask({ task: taskObject }),
			status: isChecked ? TASK_STATUSES.INCOMPLETE : TASK_STATUSES.COMPLETED,
			task: localTask,
			waste: newWaste,
			ttc: localTtc,
			eta: isChecked ? eta : format(currentTime, "HH:mm"),
			completedTimeStamp: currentTime.getTime() / 1000 // epoch in seconds, NOT millis
		}
		setIsChecked(!isChecked) // It is placed before the redux dispatch because updating local state is faster than api
		updateTask(id, updatedTask)(dispatch)
	}

	const handleDeleteTask = () => {
		removeTask(id)(dispatch)
		toast.info('This Task was deleted')
	}

	const taskRowChildren = ({ provided }) => (
		<>
			<IconContainer title={'Drag-n-Drop tasks to change view'} {...provided?.dragHandleProps ?? ''}>
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
				{status === TASK_STATUSES.COMPLETED ?
					<p>{task}</p>
					: <TaskInput onChange={e => setLocalTask(e.target.value)} value={localTask} variant={variant} />
				}
			</TaskContainer>
			<TimeContainer title={'Wasted Time on this Task'} style={{ width: '200px' }}>
				<p>
					{(() => {
						// This function displays the waste for the positive, 0, and negative cases
						if (waste && !isNaN(waste) && waste > 0) {
							return formatTimeLeft({
								timeDifference: waste,
								minuteText: 'minutes',
								hourText: 'hour',
								hourText2: 'hours'
							})
						} else if (waste && !isNaN(waste) && waste < 0) {
							return `-${formatTimeLeft({
								timeDifference: -waste,
								minuteText: 'minutes',
								hourText: 'hour',
								hourText2: 'hours'
							})}`
						} else {
							return '0 minutes'
						}
					})()
					}
				</p>
			</TimeContainer>
			<TimeContainer style={{ width: '120px' }} title={'Time To Complete Task'}>
				{status === TASK_STATUSES.COMPLETED ?
					<pre>{ttc && !isNaN(ttc) && ttc > 0 ?
						formatTimeLeft({
							timeDifference: ttc,
							minuteText: 'minutes',
							hourText: 'hour',
							hourText2: 'hours'
						}) :
						'0 minutes'}</pre>
					: <HoursInput onChange={e => setLocalTtc(e.target.value)} value={localTtc} initialValue={ttc && ttc > .01 ? ttc : 1} variant={variant} placeholder='hours' text='hours' />
				}
			</TimeContainer>
			<TimeContainer style={{ width: '40px' }} title={'Estimated Time to Finish Task'}>
				<p>
					{eta && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(eta) ? eta : '00:00'}
				</p>
			</TimeContainer>
			<IconContainer>
				<BiTrash title={'Delete this task'} onClick={handleDeleteTask} size={32} />
			</IconContainer>
		</>
	)

	return (
		<>
			{status === TASK_STATUSES.COMPLETED ?
				(
					<TaskRowStyled
						variant={variant}
						status={status}
						maxwidth={maxwidth}
						highlight={highlight}
					>
						{taskRowChildren({ provided: undefined })}
					</TaskRowStyled>
				)
				: (
					<Draggable draggableId={`task-${id}`} index={index}>
						{provided => (
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
								maxwidth={maxwidth}
								highlight={highlight}
							>
								{taskRowChildren({ provided })}
							</TaskRowStyled>
						)}
					</Draggable>
				)
			}
		</>
	)
}

export default TaskRow