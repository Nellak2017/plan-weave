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

export const setOverNight = (services, owl, startTime, endTime) => {
	services?.owl(owl)
	shiftEndTime(services, owl ? -24 : 24, startTime, endTime, owl ? 24 : 2 * 24)
}

// Events
export const addEvent = (services, userId) => {
	services?.addTask({ ...DEFAULT_SIMPLE_TASK, id: new Date().getTime() }, userId)
}

export const deleteEvent = (services, toast, setIsDeleteClicked, isHighlighting, taskList) => {
	if (!isHighlighting) {
		setIsDeleteClicked(false)
		services?.updateSelectedTasks(taskList?.map(() => false)) // This ensures that selected is always in proper state when we use it
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