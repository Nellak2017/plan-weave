import { DEFAULT_FULL_TASK } from '../../../Core/utils/constants.js'
import DeleteModal from '../../atoms/DeleteModal/DeleteModal.js'
import { hoursToMillis } from '../../../Core/utils/helpers.js'
import { getTime, differenceInHours } from 'date-fns'

// --- The Events for TaskControl Extracted to this file

// Clock helpers (with side-effects)
export const shiftEndTime = (services, shift, startTime, endTime, maxDifference) => {
	const newDate = new Date(endTime.getTime() + hoursToMillis(shift))
	const startEndDifference = differenceInHours(newDate, startTime)
	if (startEndDifference <= maxDifference) services?.updateTimeRange(undefined, newDate.toISOString())
}
export const checkTimeRange = (services, toast, endTime, startTime, owl) => {
	if ((getTime(endTime) < getTime(startTime)) && !owl) {
		services?.updateTimeRange(undefined, startTime.toISOString())
		toast.warn('End time cannot be less than start time. End time is set to start time.')
	}
}
export const setOverNight = (services, owl, startTime, endTime) => {
	services?.owl(owl)
	shiftEndTime(services, owl ? -24 : 24, startTime, endTime, owl ? 24 : 2 * 24)
}
export const addEvent = (services, userId) => { services?.addTask({ ...DEFAULT_FULL_TASK, id: new Date().getTime() }, userId) } // Full tasks are used as base representation
export const deleteEvent = (services, toast, setIsDeleteClicked, isHighlighting, taskList) => {
	if (!isHighlighting) {
		setIsDeleteClicked(false)
		services?.updateSelectedTasks(taskList?.map(() => false)) // This ensures that selected is always in proper state when we use it
		toast.info('You may now select multiple tasks to delete at once! Click again to toggle.')
	}
	services?.highlighting() // changes highlighting from true->false or false->true
}
export const deleteMultipleEvent = ({ state, services,}) => {
	const { userId, selectedTasks, taskList, isDeleteClicked, toast } = state || {}
	const { deleteMany, highlighting, setIsDeleteClicked } = services || {}
	if (selectedTasks.some(task => task === true) && !isDeleteClicked) {
		setIsDeleteClicked(true) // This is to prevent the user from spamming the delete buttom multiple times
		toast.warning(({ closeToast }) => (
			<DeleteModal services={{ deleteMany, highlighting, setIsDeleteClicked, closeToast }} state={{ userId, selectedTasks, taskList }} />),
			{ position: toast.POSITION.TOP_CENTER, autoClose: false, closeOnClick: false, closeButton: false, draggable: false, })
	}
}
export const startTimeChangeEvent = (services, newStart) => { services?.updateTimeRange(newStart.toISOString()) }
export const endTimeChangeEvent = (services, newEnd) => { services?.updateTimeRange(undefined, newEnd.toISOString()) }