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
		if (!updatedTask.id) {
			// Case 2: Task is missing an id. Display errors and warnings
			throw new Error('Id is not defined, so it will lead to unexpected display results. This is likely a database error.')
		} else {
			// Case 3: Task is invalid but has a valid id
			// Iterate through fields and apply defaults to invalid ones, or delete it if it isn't in the attribute list
			Object.keys(updatedTask).forEach(field => {
				if (!schema?.fields[field]?.isValidSync(updatedTask[field])) {
					if (schema?.fields[field]) updatedTask[field] = schema?.fields[field]?.default()
					else delete updatedTask[field]
				}
			})

			// If the entered attribute is valid, then update it
			if (updatedTask.hasOwnProperty(attribute)) {
				updatedTask[attribute] = value
				updatedTask = schemaDefaultFx(updatedTask) // fill defaults if there is other undefined attributes too
			}
			validateTransformation(updatedTask)
		}
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

// today is a Date, timestamp is a number of seconds
// returns true if timestamp is from yesterday, false otherwise
export const isTimestampFromYesterday = (today, timestamp) => {
	// Seconds since start of today
	const todayToSeconds = today.getTime() / 1000
	const seconds = Math.floor((today.getTime() - today.setHours(0, 0, 0, 0)) / 1000)

	// If seconds since start of today < today - timestamp, then it is from yesterday
	return seconds < (todayToSeconds - timestamp)
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