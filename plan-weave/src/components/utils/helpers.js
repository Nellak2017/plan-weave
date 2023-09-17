import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema'
import { getTime } from 'date-fns'
import { MILLISECONDS_PER_HOUR, MILLISECONDS_PER_DAY, TASK_STATUSES, SORTING_METHODS, SORTING_METHODS_NAMES } from './constants'

// This file contains many helpers used through out the application

// --- Private Functions

// validate function private helpers
const validateTransformation = (task, schema, customErrorMessage) => { if (!schema.isValidSync(task, { strict: true })) throw new Error(customErrorMessage + ` task : ${JSON.stringify(task)}`) }
const isRequired = (field, schema) => schema.describe().fields[field] ? !schema?.describe()?.fields[field]?.optional : false
const requiredFields = (schema) => Object.keys(schema.describe().fields)
	.map(field => isRequired(field, schema) ? field : null)
	.filter(field => field !== null)

// calculate waste private helpers
const add = (start, hours) => new Date(start.getTime() + hoursToMillis(hours)) // (Date: start, hours: hours) -> Date(start + hours)
const subtract = (time, eta) => millisToHours(time.getTime() - eta.getTime()) // (Date: time, Date: eta) -> time - eta (hours)
const etaList = (taskList, start = 0) => taskList.reduce((acc, task, index) => [...acc.slice(index === 0 ? 1 : 0), parseFloat(acc[acc.length - 1]) + parseFloat(task?.ttc)], [start]) // (TaskList : [task]) => [Eta : Float] # it is the times of each Eta

// --- Helpers Exported
/**
 * Format time left for tasks in a pure way.
 *
 * @param {Object} options - Options object containing parameters.
 * @param {string} [options.minuteText='minutes left'] - Text for minutes.
 * @param {string} [options.hourText='hour'] - Text for hour.
 * @param {string} [options.hourText2='hours left'] - Text for hours.
 * @param {boolean} [options.overNightMode=false] - Over-night mode.
 * @param {Date} [options.currentTime=new Date()] - Current time.
 * @param {Date} options.endTime - End time.
 * @param {number} [options.timeDifference=0] - Time difference.
 * @returns {string} Formatted time left.
 */
export const formatTimeLeft = ({
	minuteText = 'minutes left',
	hourText = 'hour',
	hourText2 = 'hours left',
	overNightMode = false,
	currentTime = new Date(),
	endTime,
	timeDifference = 0,
}) => {
	// Returns Time in Milliseconds, given the constaints of the application
	const calculateTimeDifference = ({ endTime, currentTime = new Date(), timeDifference = 0, overNightMode = false }) => {
		if (timeDifference > 0) return timeDifference * MILLISECONDS_PER_HOUR // Convert hours to milliseconds

		const adjustedEndTimeValue = overNightMode
			? getTime(new Date(endTime)) + MILLISECONDS_PER_DAY // Add one day's worth of milliseconds
			: getTime(endTime)

		return Math.max(0, adjustedEndTimeValue - currentTime.getTime())
	}

	// Returns proper format of time, given the time and other relevant information
	const formatTime = timeMillis => {
		const totalHours = timeMillis / MILLISECONDS_PER_HOUR
		const timeLeftInHours = Math.floor(totalHours)
		const timeLeftInMinutes = Math.floor((totalHours - timeLeftInHours) * 60)

		if (timeLeftInHours > 0) {
			const secondsText = timeLeftInHours > 1 ? 's' : ''
			return (timeLeftInMinutes > 0
				? `${timeLeftInHours} ${hourText}${secondsText} ${timeLeftInMinutes} ${minuteText}`
				: `${timeLeftInHours} ${hourText2}`)
		} else {
			return `${timeLeftInMinutes} ${minuteText}`
		}
	}

	return formatTime(calculateTimeDifference({ endTime, currentTime, timeDifference, overNightMode }))
}

/**
 * Checks if a timestamp is from today.
 * 
 * @param {Date} today - The current date.
 * @param {number} timestamp - The timestamp to check (in seconds from 1970).
 * @param {number} [secondsFromStart=86400] - The number of seconds in a day (default is 86400 seconds).
 * @returns {boolean} - True if the timestamp is from today, false otherwise.
 */
export const isTimestampFromToday = (today, timestamp, secondsFromStart = 86400) => {
	const startOfTodaySeconds = new Date(today).setHours(0, 0, 0, 0) / 1000 // seconds since 1970 from start of day
	return (startOfTodaySeconds <= timestamp) && (timestamp <= (startOfTodaySeconds + secondsFromStart))
}

export const validateTasks = ({ taskList, schema = simpleTaskSchema, schemaDefaultFx = fillDefaultsForSimpleTask
	, customErrorMessage = `Failed to validate Task in validateTask function. This is likely a programming bug.` }) => {
	return taskList?.map(task => validateTask({ task, schema, schemaDefaultFx, customErrorMessage }))
}

/**
 * Try to validate the task, removing extras and filling defaults
 * If validation fails, throw an error and warn the user
 * 
 * @param {Object} options - Options for validating the task.
 * @param {Object} options.task - The task to be validated.
 * @param {Object} [options.schema=simpleTaskSchema] - The schema to validate against.
 * @param {Function} [options.schemaDefaultFx=fillDefaultsForSimpleTask] - Function to fill default values.
 * @param {string} [options.customErrorMessage] - Custom error message.
 * @returns {Object|Error} - The validated and modified task, or an error if validation fails.
 */
export const validateTask = ({ task, schema = simpleTaskSchema, schemaDefaultFx = fillDefaultsForSimpleTask
	, customErrorMessage = `Failed to validate Task in validateTask function. This is likely a programming bug.` }) => {
	try {
		// Case 1: If the Task is valid, but missing/extra field, strip and fill defaults. Return list
		const validatedTask = schema.validateSync(task, { abortEarly: false, stripUnknown: true, })
		const modifiedTask = schemaDefaultFx(validatedTask)
		validateTransformation(modifiedTask, schema, customErrorMessage)
		return modifiedTask
	} catch (validationError) {
		// Case 2: If the Task is invalid and missing required fields. Display errors and throw Error.
		if (!requiredFields(schema).every(field => schema?.fields[field]?.isValidSync(task[field]))) throw new Error(validationError.message)

		// Case 3: If the Task is invalid, but has required fields. Update it and return list.
		// Iterate through fields and apply defaults to invalid ones, or delete it if it isn't in the attribute list
		let updatedTask = schemaDefaultFx(task) // fill defaults if there is other undefined attributes too
		Object.keys(updatedTask).forEach(field => {
			const fieldExists = schema?.fields[field]
			const isValid = fieldExists?.isValidSync(updatedTask[field])
			if (!isValid && fieldExists) updatedTask[field] = fieldExists?.getDefault()
			else if (!isValid && !fieldExists) delete updatedTask[field]
		})
		validateTransformation(updatedTask, schema, customErrorMessage)
		return updatedTask
	}
}

// Search Filter Function
/**
 * Filters a list of items based on a given attribute and filter string.
 * 
 * @param {Object} options - Options for filtering.
 * @param {string} options.filter - The filter string to apply.
 * @param {Array} options.list - The list of items to filter.
 * @param {string} options.attribute - The attribute to filter by.
 * @returns {Array} - The filtered list.
 */
export const filterTaskList = ({ filter, list, attribute }) => {
	return (!filter || !attribute)
		? list
		: list.filter(item => item[attribute]?.toLowerCase()?.includes(filter?.toLowerCase()))
}

/**
 * Converts hours to milliseconds.
 * 
 * @param {number} hours - The number of hours to convert.
 * @returns {number} - The equivalent milliseconds.
 */
export const hoursToMillis = hours => hours * 60000 * 60

/**
 * Converts milliseconds to hours.
 * 
 * @param {number} milliseconds - The number of hours to convert.
 * @returns {number} - The equivalent milliseconds.
 */
export const millisToHours = milliseconds => (milliseconds / 60000) / 60

/**
 * Calculates and updates task waste and estimated time of arrival (ETA).
 *
 * @param {Object} options - Options for waste calculation.
 * @param {Date} options.start - The start time for waste calculation.
 * @param {Object[]} options.taskList - The list of tasks to calculate waste for.
 * @param {Date} [options.time=new Date()] - The current time (optional).
 * @returns {Object[]} The list of tasks with updated waste and ETA values.
 */
export const calculateWaste = ({ start, taskList, time = new Date() }) => {
	if (!taskList || taskList.some(task => !task)) {
		console.error('Task list is undefined or has undefined values', taskList)
		return
	}

	return ((tasks = taskList, currentTime = time) => {
		const firstIncompleteIndex = taskList?.findIndex(task => task?.status !== TASK_STATUSES.COMPLETED)
		const etas = etaList(taskList.slice(firstIncompleteIndex)) // etas calculated only for the incomplete tasks
		const lastCompletedTimestamp = tasks[firstIncompleteIndex - 1]?.completedTimeStamp * 1000 // last completedTimestamp to millis
		const startTime = firstIncompleteIndex === 0 || !lastCompletedTimestamp || isNaN(lastCompletedTimestamp) ? start : new Date(lastCompletedTimestamp) // startTime is a Date 
		return tasks.map((task, index) => {
			const eta = index >= firstIncompleteIndex ? add(startTime, etas[index - firstIncompleteIndex]) : new Date(currentTime) // index - firstIncomplete shifts accordingly
			const waste = index === firstIncompleteIndex ? subtract(currentTime, eta) : 0 // we must use the updated eta value
			return task?.status === TASK_STATUSES.COMPLETED ? { ...task } : { ...task, waste, eta }
		})
	})()
}

/**
 * Checks if a value is an integer.
 *
 * @param {number} number - The value to be checked.
 * @returns {boolean} Returns `true` if the value is an integer, `false` otherwise.
 */
export const isInt = number => ((!!number || number === 0) && typeof number === 'number' && Math.floor(number) === number && isFinite(number))

/**
 * Reorders an array of tasks based on a provided transformation list.
 *
 * @param {Array<Object>} tasks - The array of tasks to be reordered. Like [{a:0},{b:1},{c:2}]
 * @param {Array<number>} transform - An array representing the desired order of task IDs. Like [1,2,0]
 * @returns {Array<Object>} Returns a new array of tasks reordered based on the transform list. Like [{a:1},{b:2},{c:0}]
 */
export const transform = (tasks, transform) => tasks.map((_, i) => tasks[transform[i]])

/**
 * Applies a sequence of transformation functions to an initial array of tasks.
 *
 * @param {Array<Object>} tasks - The initial array of tasks.
 * @param {Array<Function>} transforms - An array of transformation functions to be applied in sequence.
 * @returns {Array<Object>} Returns a new array of tasks after applying all specified transformations.
 */
export const transformAll = (tasks, transforms) => transforms.reduce((task, f) => f(task), tasks)

/**
 * Rearranges an array using a drag-and-drop (DnD) operation by moving an item from the source index to the destination index.
 *
 * @param {Array} dnd - The original array that will be rearranged.
 * @param {number} source - The index of the item to be moved.
 * @param {number} destination - The index where the item will be moved to.
 * @returns {Array} - A new array with the rearranged items.
 */
export const rearrangeDnD = (dnd, source, destination) => {
	const item = dnd.slice(source, source + 1)
	const left = dnd.slice(0, source) // left of item
	const right = dnd.slice(source + 1) // right of item
	const both = left.concat(right) // all items except for the one we are moving
	return [
		...both.slice(0, destination),
		...item,
		...both.slice(destination)
	]
}

/**
 * Generates an ordinal set from an array of numbers.
 * An ordinal set assigns ordinal values starting from 0 to unique numbers in the input array.
 *
 * @param {number[]} dnd - An array of numbers.
 * @returns {number[]} An array where each element is the ordinal value corresponding to the input numbers.
 * @example
 * const dnd = [1, 3, 2]
 * const ordinalSet = getOrdinalSet(dnd)
 * // ordinalSet will be [0, 2, 1]
 */
export const ordinalSet = (dnd) => {
	const mapping = {}
	const uniqueSortedArr = [...new Set(dnd)].sort((a, b) => a - b)
	uniqueSortedArr.forEach((num, index) => {
		mapping[num] = index
	})
	return dnd.map(num => mapping[num])
}

/**
 * Sorts tasks with completed tasks on top and applies transformation functions.
 *
 * @param {Object[]} reduxTasks - The list of tasks from Redux.
 * @param {Object[]} tasks - The list of tasks to be sorted.
 * @param {Date} start - The start time for calculating waste.
 * @param {Function[]} transforms - A list of transformation functions to apply (optional).
 * @returns {Object[]} The sorted and transformed list of tasks.
 */
export const completedOnTopSorted = (reduxTasks, tasks, start, transforms) => {
	// transforms is a list of transformation functions, tasks => ordering of tasks
	if (!transforms) {
		transforms = [
			SORTING_METHODS[SORTING_METHODS_NAMES.TIMESTAMP],
			t => transform(t, reduxTasks.map((_, i) => i)),
			t => calculateWaste({ start, taskList: t, time: new Date() })
		]
	}
	if (!reduxTasks) return tasks && tasks.length > 0 ? transformAll(tasks, transforms) : []

	const completedTasks = [...reduxTasks].filter(task => task?.status === TASK_STATUSES.COMPLETED)
	const remainingTasks = [...reduxTasks].filter(task => task?.status !== TASK_STATUSES.COMPLETED)
	return transformAll([...completedTasks, ...remainingTasks], transforms)
}