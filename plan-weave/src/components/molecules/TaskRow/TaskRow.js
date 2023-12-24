import { useState, useEffect } from 'react'
import { TaskRowStyled } from './TaskRow.elements.js'
import SimpleRow from './SimpleRow.js'
import { Draggable } from 'react-beautiful-dnd'
import { millisToHours } from '../../utils/helpers.js'
import { THEMES, TASK_STATUSES } from '../../utils/constants.js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { removeTaskThunk, updateTaskThunk, completedTaskThunk } from '../../../redux/thunks/taskEditorThunks.js'
import { useDispatch } from 'react-redux'
import { validateTask, highlightTaskRow } from '../../utils/helpers'
import { parseISO } from 'date-fns'

import { Timestamp } from 'firebase/firestore'
const timestampOuter = Timestamp.fromDate(new Date()).seconds
/*
TODO: Fine tune the spacing of the row items to make it more natural. Especially the icons.
TODO: Add Schema prop for TaskRow so that it can handle the Full Task
TODO: FIX THE HIGHLIGHTING BUG. When user presses "complete" task, the task is highlighted "old" instead of what it is supposed to be
*/
// services = {...others, updateSelectedTasks}
// state = {isHighlighting, selectedTasks}
function TaskRow({
	services,
	state,
	taskObject = { task: 'example', waste: 0, ttc: 1, eta: new Date(), status: TASK_STATUSES.INCOMPLETE, id: 0, timestamp: timestampOuter },
	variant = 'dark',
	maxwidth = 818,
	index,
	highlight = 'no', // maybe unnecessary??
	old = false // is task old or not?
}) {

	// destructure taskObject and context
	const { task, waste, ttc, eta, status, id, timestamp } = { ...taskObject }

	const newETA = parseISO(eta) // Converts eta from ISO -> Date

	// Input Checks
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (!maxwidth || isNaN(maxwidth) || maxwidth <= 0) maxwidth = 818
	if (index === undefined || index === null || isNaN(index) || index < 0) console.error(`index is not a valid number in row = ${id}, index = ${index}`)
	if (id === undefined || id === null || isNaN(id) || id < 0) console.error(`Id is not a valid number for task index = ${index}, id = ${id}`)

	// Redux destructuring
	const dispatch = useDispatch()
	const { updateSelectedTasks } = { ...services }
	const { isHighlighting, selectedTasks } = { ...state }

	// Local State of the form so that it may be updated into the redux store
	const [localTask, setLocalTask] = useState(task)
	const [localTtc, setLocalTtc] = useState(ttc)
	const [isChecked, setIsChecked] = useState(status.toLowerCase().trim() === TASK_STATUSES.COMPLETED)

	useEffect(() => {
		if (!isHighlighting) {
			setIsChecked(status === TASK_STATUSES.COMPLETED)
			return
		}
		// If we start up the highlight multiple feature, we need to have no checks initially, even if it is completed
		setIsChecked(false)
	}, [isHighlighting]) // Should run when the highlighting stops to reset the checkmarks to what they should be

	// Handlers
	const handleCheckBoxClicked = () => {
		// Change the Checkmark first before all so we don't forget!
		setIsChecked(!isChecked) // It is placed before the redux dispatch because updating local state is faster than api

		// Multiple Deletion feature
		if (isHighlighting) {
			updateSelectedTasks((() => {
				const updatedSelection = [...selectedTasks]
				updatedSelection[index] = !updatedSelection[index]
				return updatedSelection
			})()) // we need to update what task is to be deleted in the context list
			return // So that the task is NOT updated
		}

		if (!isChecked) toast.info('This Task was Completed')

		// Waste Feature 

		const currentTime = new Date()
		const updatedTask = {
			...validateTask({ task: taskObject }),
			status: isChecked ? TASK_STATUSES.INCOMPLETE : TASK_STATUSES.COMPLETED,
			task: localTask,
			waste: millisToHours(currentTime.getTime() - newETA.getTime()), // millisToHours(currentTime.getTime() - eta.getTime())
			ttc: localTtc,
			eta: isChecked && newETA instanceof Date ? newETA.getTime() / 1000 : currentTime.getTime() / 1000,
			completedTimeStamp: currentTime.getTime() / 1000 // epoch in seconds, NOT millis
		}

		completedTaskThunk(id, updatedTask, index)(dispatch)
	}

	const handleDeleteTask = () => {
		try {
			removeTaskThunk(id)(dispatch)
			toast.info('This Task was deleted')
		} catch (e) {
			console.error(e)
			toast.error('The Task failed to be deleted')
		}
	}

	const handleUpdateTask = () => {
		updateTaskThunk(id, {
			...taskObject,
			eta: parseISO(taskObject?.eta) && parseISO(taskObject.eta) instanceof Date
				? parseISO(taskObject.eta).getTime() / 1000
				: new Date().getTime() / 1000,
			task: localTask,
			ttc: localTtc
		})(dispatch)
	}


	// -- Helper components
	const completedTask = provided => (
		<TaskRowStyled
			variant={variant}
			status={status}
			ref={provided?.innerRef || null}
			{...(provided?.draggableProps ? provided.draggableProps : {})} // conditionally destructure if not completed task
			style={{ ...provided?.draggableProps?.style, boxShadow: provided?.isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none' }}
			maxwidth={maxwidth}
			highlight={highlightTaskRow(isHighlighting, isChecked, old)}
			onClick={() => console.log(highlightTaskRow(isHighlighting, isChecked, old))}
			onBlur={handleUpdateTask}
		>
			{<SimpleRow
				provided={provided || undefined}
				taskObject={{ task, waste, ttc, eta, status, id, timestamp, index }} // eta was used previously
				variant={variant}
				isChecked={isChecked}
				setLocalTask={setLocalTask}
				localTask={localTask}
				localTtc={localTtc}
				setLocalTtc={setLocalTtc}
				handleCheckBoxClicked={handleCheckBoxClicked}
				handleDeleteTask={handleDeleteTask}
			/>}
		</TaskRowStyled>
	)

	return (
		<>
			{status === TASK_STATUSES.COMPLETED || isHighlighting
				? (completedTask())
				: (
					<Draggable draggableId={`task-${id}`} index={index} key={`task-${id}-key`}>
						{provided => (completedTask(provided))}
					</Draggable >
				)
			}
		</>
	)
}

export default TaskRow