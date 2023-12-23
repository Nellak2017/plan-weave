import { DEFAULT_SIMPLE_TASK } from '../../utils/constants.js'
import DeleteModal from '../../atoms/DeleteModal/DeleteModal.js'
import { hoursToMillis } from '../../utils/helpers.js'
import { getTime, differenceInHours } from 'date-fns'

// --- The Events for TaskControl Extracted to this file

// Clock helpers (with side-effects)
export const shiftEndTime = (services, shift, startTime, endTime, maxDifference) => {
	const newDate = new Date(endTime.getTime() + hoursToMillis(shift))
	const startEndDifference = differenceInHours(newDate, startTime)
	if (startEndDifference <= maxDifference) services?.timeRange(undefined, newDate.toISOString())
}

export const checkTimeRange = (services, toast, endTime, startTime, owl) => {
	if ((getTime(endTime) < getTime(startTime)) && !owl) {
		services?.timeRange(undefined, startTime.toISOString())
		toast.warn('End time cannot be less than start time. End time is set to start time.')
	}
}

export const setOverNight = (services, toast, owl, startTime, endTime) => {
	services?.owl()
	if (owl) {
		const maxDifference = 24 // variable included here to communicate intent
		shiftEndTime(services, -24, startTime, endTime, maxDifference)
		toast.info('Overnight Mode is off: Tasks must be scheduled between 12 pm and 12 am. End time must be after the start time.', {
			autoClose: 5000,
		})
	} else {
		const maxDifference = 2 * 24
		shiftEndTime(services, 24, startTime, endTime, maxDifference)
		toast.info('Overnight Mode is on: You can schedule tasks overnight, and end time can be before the start time.', {
			autoClose: 5000,
		})
	}
}

// Events
export const addEvent = (services, toast) => {
	toast.info('You added a New Default Task')
	services?.addTask(DEFAULT_SIMPLE_TASK) // automatically updates dnd in the reducer
}

export const deleteEvent = (services, toast, setIsDeleteClicked, isHighlighting) => {
	if (!isHighlighting) {
		setIsDeleteClicked(false)
		toast.info('You may now select multiple tasks to delete at once! Click again to toggle.')
	}
	services?.highlighting() // changes highlighting from true->false or false->true
}

export const deleteMultipleEvent = (services, toast, taskList, setIsDeleteClicked, selectedTasks, isDeleteClicked) => {
	const tasksAreSelected = selectedTasks.some(task => task === true) // if there is atleast 1 task selected then true
	if (tasksAreSelected && !isDeleteClicked) {
		setIsDeleteClicked(true) // This is to prevent the user from spamming the delete buttom multiple times
		toast.warning(({ closeToast }) => (
			<DeleteModal
				services={{
					deleteMany: services?.deleteMany,
					highlighting: services?.highlighting,
				}}
				selectedTasks={selectedTasks}
				taskList={taskList}
				setIsDeleteClicked={setIsDeleteClicked}
				closeToast={closeToast}
			/>),
			{
				position: toast.POSITION.TOP_CENTER,
				autoClose: false, // Don't auto-close the toast
				closeOnClick: false, // Keep the toast open on click
				closeButton: false, // Don't show a close button
				draggable: false, // Prevent dragging to close
			})
	}
}
export const startTimeChangeEvent = (services, newStart) => { services?.timeRange(newStart.toISOString()) }
export const endTimeChangeEvent = (services, newEnd) => { services?.timeRange(undefined, newEnd.toISOString()) }