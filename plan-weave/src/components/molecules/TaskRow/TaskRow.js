import { useState, useEffect, useContext } from 'react'
import { TaskRowStyled } from './TaskRow.elements.js'
import SimpleRow from './SimpleRow.js'
import { Draggable } from 'react-beautiful-dnd'
import { millisToHours, hoursToMillis } from '../../utils/helpers.js'
import { THEMES, TASK_STATUSES } from '../../utils/constants.js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { removeTask, updateTask } from '../../../redux/thunks/taskThunks.js'
import { useDispatch } from 'react-redux'
import { validateTask } from '../../utils/helpers'
import { parse, format } from 'date-fns'
import { TaskEditorContext } from '../../organisms/TaskEditor/TaskEditor.js'

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

function TaskRow({ taskObject = { task: 'example', waste: 0, ttc: 1, eta: new Date(), status: TASK_STATUSES.INCOMPLETE, id: 0, timestamp: timestampOuter },
	variant = 'dark', maxwidth = 818, index, highlight = 'no', lastCompletedTask }) {

	// destructure taskObject and context
	const { task, waste, ttc, eta, status, id, timestamp } = { ...taskObject }

	const { setTaskUpdated, setSelectedTasks, isHighlighting } = !TaskEditorContext._currentValue ? { 1: () => console.log("hey") } : useContext(TaskEditorContext)  // used to help the waste feature. Ugly but it works

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
			const newEta = validTask?.eta && validTask?.eta?.getTime() ? validTask?.eta?.getTime() / 1000 : new Date(new Date().setHours(12, 0, 0, 0))
			if (!isEqual(validTask, taskObject)) updateTask(id, { ...validTask, eta: newEta })(dispatch)
		} catch (invalidTask) {
			console.error(invalidTask.message)
			toast.error('Your Tasks are messed up and might not display right, it is likely a database issue.')
		}
	}, [])

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
			setSelectedTasks(old => {
				const updatedSelection = [...old]
				updatedSelection[index] = !updatedSelection[index]
				return updatedSelection
			}) // we need to update what task is to be deleted in the context list
			return // So that the task is NOT updated
		}
		if (!isChecked) toast.info('This Task was Completed')

		// Waste Feature 
		const currentTime = new Date()
		/*
		const newWaste = !lastCompletedTask || (lastCompletedTask && !lastCompletedTask?.eta)
			? millisToHours((currentTime.getTime() - parse(eta, 'HH:mm', currentTime).getTime())) // if lastCompletedTask is falsey
			: millisToHours(currentTime.getTime() - (parse(lastCompletedTask.eta, 'HH:mm', currentTime).getTime() + hoursToMillis(localTtc))) // if lastCompletedTask is not null or undefined / falsey 
		*/

		// TODO: Debug this Waste calculation. It is giving .75 waste when 3 hours 51 minutes is true waste for first task
		const cond1 = !lastCompletedTask || (lastCompletedTask && !lastCompletedTask?.eta) && eta instanceof Date
		const cond2 = typeof lastCompletedTask?.eta === 'number'

		const newWaste = cond1
			? millisToHours(currentTime.getTime() - eta.getTime())
			: cond2
				? millisToHours(currentTime.getTime() - (lastCompletedTask.eta * 1000) + hoursToMillis(localTtc)) // assuming it is epoch
				: millisToHours(currentTime.getTime() - lastCompletedTask.eta.getTime() + hoursToMillis(localTtc)) // assuming date

		console.log(cond1)
		console.log(cond2)
		console.log(newWaste)
		
		if (cond2) {
			const epoch = millisToHours(currentTime.getTime() - (lastCompletedTask.eta * 1000) + hoursToMillis(localTtc))
			console.log('---')
			console.log(`currentTime.getTime() : ${currentTime.getTime()}`)
			console.log(`lastCompletedTask.eta * 1000 : ${lastCompletedTask.eta * 1000}`)
			console.log(`localTtc : ${localTtc}`)
			console.log(`epoch : ${epoch}`)
		}

		const updatedTask = {
			...validateTask({ task: taskObject }),
			status: isChecked ? TASK_STATUSES.INCOMPLETE : TASK_STATUSES.COMPLETED,
			task: localTask,
			waste: newWaste,
			ttc: localTtc,
			eta: isChecked && eta && eta instanceof Date ? eta.getTime() / 1000 : currentTime.getTime() / 1000,
			completedTimeStamp: currentTime.getTime() / 1000 // epoch in seconds, NOT millis
		}
		// Usual API+View Update 
		updateTask(id, updatedTask)(dispatch)
		if (TaskEditorContext._currentValue) setTaskUpdated(true)
	}

	const handleDeleteTask = () => {
		removeTask(id)(dispatch)
		toast.info('This Task was deleted')
	}

	const handleUpdateTask = () => {
		toast.info('This Task was Updated')
		updateTask(id, {
			...taskObject,
			eta: taskObject?.eta && taskObject.eta instanceof Date ? taskObject.eta.getTime() / 1000 : new Date().getTime() / 1000,
			task: localTask,
			ttc: localTtc
		})(dispatch)
	}

	return (
		<>
			{status === TASK_STATUSES.COMPLETED || isHighlighting ?
				(
					<TaskRowStyled
						variant={variant}
						status={status}
						maxwidth={maxwidth}
						highlight={isHighlighting ? (isChecked ? 'selected' : ' ') : highlight}
						onBlur={handleUpdateTask}
					>
						{<SimpleRow
							provided={undefined}
							taskObject={{ task, waste, ttc, eta, status, id, timestamp }}
							variant={variant}
							isChecked={isChecked}
							setLocalTask={setLocalTask}
							localTask={localTask}
							localTtc={localTtc}
							handleCheckBoxClicked={handleCheckBoxClicked}
							handleDeleteTask={handleDeleteTask}
						/>}
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
								style={{ ...provided.draggableProps.style, boxShadow: provided.isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none' }}
								maxwidth={maxwidth}
								highlight={isHighlighting ? (isChecked ? 'selected' : ' ') : highlight}
								onBlur={handleUpdateTask}
							>
								{<SimpleRow
									provided={provided}
									taskObject={{ task, waste, ttc, eta, status, id, timestamp }}
									variant={variant}
									isChecked={isChecked}
									setLocalTask={setLocalTask}
									localTask={localTask}
									localTtc={localTtc}
									handleCheckBoxClicked={handleCheckBoxClicked}
									handleDeleteTask={handleDeleteTask}
								/>}
							</TaskRowStyled>
						)}
					</Draggable>
				)
			}
		</>
	)
}

export default TaskRow