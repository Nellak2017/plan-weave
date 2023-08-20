import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema'
import { getTime } from 'date-fns'
import { MILLISECONDS_PER_HOUR, MILLISECONDS_PER_DAY } from './constants'

// This file contains many helpers used through out the application

/**
 * Update an attribute of a task in a list of tasks in a pure way.
 *
 * @param {Object} options - Options object containing parameters.
 * @param {number} options.index - Index of the task to update.
 * @param {string} options.attribute - Attribute to update.
 * @param {*} options.value - New value for the attribute.
 * @param {Array} options.taskList - List of tasks to update.
 * @param {Object} [options.schema=simpleTaskSchema] - Validation schema.
 * @param {Function} [options.schemaDefaultFx=fillDefaultsForSimpleTask] - Default filling function.
 * @returns {Array} Updated list of tasks.
 * @throws {TypeError} If any argument is undefined or invalid.
 * @throws {Error} If attribute is not valid, task id is missing, or duplicate ids exist.
 */
export const pureTaskAttributeUpdate = async ({
	index,
	attribute,
	value,
	taskList,
	schema = simpleTaskSchema,
	schemaDefaultFx = fillDefaultsForSimpleTask
}) => {
	// Verify Inputs
	// ---
	if (isNaN(index) || index < 0 || index === null || index > taskList?.length || attribute === undefined || !attribute || !value || taskList === undefined || !schema || !schemaDefaultFx)
		throw new TypeError(
			`Atleast one of the arguments in pureTaskAttributeUpdate is undefined
				index : ${index}
				attribute : ${attribute}
				value : ${value}
				taskList : ${taskList}
				schema : ${schema}
				defaultFill : ${schemaDefaultFx}
				`)
	if (!taskList[index].hasOwnProperty(attribute)) throw new Error(`Entered Attribute is invalid. Attribute : ${attribute}. This is likely a programming bug.`)
	if (taskList.some(task => !task.id || task.id <= 0 || isNaN(task.id))) throw new TypeError('Atleast one id is undefined/null/invalid in your task list. This is likely a database error.')
	if (taskList.some((task, index) => taskList.findIndex(t => t.id === task.id) !== index)) throw new Error('Your Task list has multiple duplicate id values. This is likely a database error.')

	// Perform Function Transformation
	// ---

	const updatedTaskList = [...taskList]
	let updatedTask = { ...updatedTaskList[index] } // Clone the task

	// Function Transformation Helpers
	const validateTransformation = (task, customMessage = `Entered value is not valid. Value : ${value}. This is likely a programming bug.`) => {
		if (!schema.isValidSync(task)) throw new Error(customMessage)
	}

	// Try to update the given task in the list
	try {
		// Validate the task and strip unknown fields
		updatedTask = await schema.validate(updatedTask, { abortEarly: false, stripUnknown: true })

		// Case 1: Task is valid, but maybe has missing/extra fields 
		updatedTask[attribute] = value
		updatedTask = schemaDefaultFx(updatedTask) // fill defaults if there is other undefined attributes too
		validateTransformation(updatedTask)

	} catch (validationError) {
		// Case 2: Task is missing an id. Display errors and warnings
		if (!updatedTask.id) throw new Error('Id is not defined, so it will lead to unexpected display results. This is likely a database error.')
		
		// Case 3: Task is invalid but has a valid id
		// Iterate through fields and apply defaults to invalid ones, or delete it if it isn't in the attribute list
		Object.keys(updatedTask).forEach(field => { // NOTE: I Denested Logic here, if fails, check github commit: 6b26397
			const fieldExists = schema?.fields[field]
			const isValid = fieldExists?.isValidSync(updatedTask[field])
			if (!isValid && fieldExists) updatedTask[field] = fieldExists?.default()
			else if (!isValid && !fieldExists) delete updatedTask[field] 
		})

		// If the entered attribute is valid, then update it
		if (updatedTask.hasOwnProperty(attribute)) {
			updatedTask[attribute] = value
			updatedTask = schemaDefaultFx(updatedTask) // fill defaults if there is other undefined attributes too
		}
		validateTransformation(updatedTask)
	}
	updatedTaskList[index] = updatedTask
	return updatedTaskList
}

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

		const currentTimeValue = currentTime.getTime()
		const adjustedEndTimeValue = overNightMode
			? getTime(new Date(endTime)) + MILLISECONDS_PER_DAY // Add one day's worth of milliseconds
			: getTime(endTime)

		return Math.max(0, adjustedEndTimeValue - currentTimeValue)
	}

	// Returns proper format of time, given the time and other relevant information
	const formatTime = (timeMillis) => {
		const totalHours = timeMillis / MILLISECONDS_PER_HOUR
		const timeLeftInHours = Math.floor(totalHours)
		const timeLeftInMinutes = Math.floor((totalHours - timeLeftInHours) * 60)

		if (timeLeftInHours > 0) {
			return timeLeftInMinutes > 0
				? `${timeLeftInHours} ${hourText}${timeLeftInHours > 1 ? 's' : ''} ${timeLeftInMinutes} ${minuteText}`
				: `${timeLeftInHours} ${hourText2}`
		} else {
			return `${timeLeftInMinutes} ${minuteText}`
		}
	}

	return formatTime(calculateTimeDifference({ endTime, currentTime, timeDifference, overNightMode }))
}

// today is a Date, timestamp is a number of seconds from 1970
// returns true if timestamp is from today, false otherwise
export const isTimestampFromToday = (today, timestamp, secondsFromStart = 86400) => {
	// Seconds since start of today
	const startOfTodaySeconds = today.setHours(0, 0, 0, 0) / 1000 // seconds since 1970 from start of day
	// start of Today in seconds <= timestamp < start of Today in seconds + seconds in a day
	return (startOfTodaySeconds <= timestamp) && (timestamp <= (startOfTodaySeconds + secondsFromStart))
}

// Try to validate the task, if it fails then use defaults and warn user
export const validateTask = task => {
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
		console.error('Task validation error:', validationError)
		// Fill defaults for missing properties in the validated task
		return null
	}
}

// Search Filter Function
export const filterTaskList = ({ filter, list, attribute }) => {
	if (!filter || !attribute) return list
	return list.filter(item => item[attribute]?.toLowerCase()?.includes(filter?.toLowerCase()))
}

// input: taskList, start (Date), end (Date)
// output: list of highlights that are based on start, end times
export const highlightDefaults = (taskList, start, end, owl = false) => {
	// 1. Get all ttc from the task list, store in another list (TTCList)
	const TTCList = taskList.map(obj => obj['ttc'])

	// 2. Loop through TTCList, 1st value = start + ttc, nth value after is prev + ttc
	let currTime = start.getTime()
	const timeStampList = TTCList.map(ttc => {
		currTime += hoursToMillis(ttc)
		return currTime
	})
	// 3. return this highlight list
	const endTimeMillis = owl ? end.getTime() + hoursToMillis(24) : end.getTime()
	const initialTimeMillis = start.getTime()
	const startOfDayMillis = new Date(initialTimeMillis).setHours(0, 0, 0, 0)
	const secondsElapsedFromEnd = ((endTimeMillis - initialTimeMillis) + initialTimeMillis - startOfDayMillis) / 1000

	return timeStampList.map(timestamp => isTimestampFromToday(new Date(start), timestamp / 1000, secondsElapsedFromEnd) ? ' ' : 'old')
}

export const hoursToMillis = hours => hours * 60000 * 60
