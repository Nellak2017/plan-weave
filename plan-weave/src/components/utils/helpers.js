import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema'
import { parse, getTime, format } from 'date-fns'
import { MILLISECONDS_PER_HOUR, MILLISECONDS_PER_DAY, TASK_STATUSES } from './constants'
import { pipe } from 'ramda'

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
export const pureTaskAttributeUpdate = ({
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

	// Try to update the given task in the list
	try {
		// Validate the task by converting task into what is expected by schema, if you can't throw Error
		updatedTask = validateTask({ task: updatedTask, schema, schemaDefaultFx })

		// If the entered attribute is valid, then update it
		if (updatedTask.hasOwnProperty(attribute)) {
			updatedTask[attribute] = value
			updatedTask = schemaDefaultFx(updatedTask) // fill defaults if there is other undefined attributes too
		}
	} catch (validationError) {
		throw new Error(validationError)
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

		return timeLeftInHours > 0
			? (timeLeftInMinutes > 0
				? `${timeLeftInHours} ${hourText}${timeLeftInHours > 1 ? 's' : ''} ${timeLeftInMinutes} ${minuteText}`
				: `${timeLeftInHours} ${hourText2}`)
			: `${timeLeftInMinutes} ${minuteText}`
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
	// Seconds since start of today
	const startOfTodaySeconds = today.setHours(0, 0, 0, 0) / 1000 // seconds since 1970 from start of day
	// start of Today in seconds <= timestamp < start of Today in seconds + seconds in a day
	return (startOfTodaySeconds <= timestamp) && (timestamp <= (startOfTodaySeconds + secondsFromStart))
}

export const validateTasks = ({ taskList, schema = simpleTaskSchema, schemaDefaultFx = fillDefaultsForSimpleTask
	, customErrorMessage = `Failed to validate Task in validateTask function. This is likely a programming bug.` }) => {
	return taskList?.map(task => validateTask({ task, schema, schemaDefaultFx, customErrorMessage }))
}

// TODO: Rename this function to be more generic, it will work on Tasks and beyond!
// TODO: Refactor this with railway oriented design so that it always returns Object, with error parameter
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

	const validateTransformation = task => { if (!schema.isValidSync(task)) throw new Error(customErrorMessage) }

	const isRequired = field => { return schema.describe().fields[field] ? !schema?.describe()?.fields[field]?.optional : false }

	const requiredFields = () => {
		return Object.keys(schema.describe().fields)
			.map(field => isRequired(field) ? field : null)
			.filter(field => field !== null)
	}

	try {
		// Case 1: If the Task is valid, but missing/extra field, strip and fill defaults. Return list
		const validatedTask = schema.validateSync(task, { abortEarly: false, stripUnknown: true, })
		const modifiedTask = schemaDefaultFx(validatedTask)
		validateTransformation(modifiedTask)
		return modifiedTask
	} catch (validationError) {
		// Case 2: If the Task is invalid and missing required fields. Display errors and throw Error.
		if (!requiredFields().every(field => schema?.fields[field]?.isValidSync(task[field]))) throw new Error(validationError.message)

		// Case 3: If the Task is invalid, but has required fields. Update it and return list.
		// Iterate through fields and apply defaults to invalid ones, or delete it if it isn't in the attribute list
		let updatedTask = schemaDefaultFx(task) // fill defaults if there is other undefined attributes too
		Object.keys(updatedTask).forEach(field => {
			const fieldExists = schema?.fields[field]
			const isValid = fieldExists?.isValidSync(updatedTask[field])
			if (!isValid && fieldExists) updatedTask[field] = fieldExists?.getDefault()
			else if (!isValid && !fieldExists) delete updatedTask[field]
		})
		validateTransformation(updatedTask)
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
	return (!filter || !attribute) ? list : list.filter(item => item[attribute]?.toLowerCase()?.includes(filter?.toLowerCase()))
}

// TODO: Modify this function to check if it is from Today if not owl (if not then old), if
//		 owl then if from today or tomorrow before the end then good otherwise old
/**
 * Generates a list of highlights based on task list and time range.
 * 
 * @param {Array} taskList - The list of tasks.
 * @param {Date} start - The start time.
 * @param {Date} end - The end time.
 * @param {boolean} [owl=false] - Whether to include the next day.
 * @returns {Array} - The list of highlights.
 */
// TODO: This function relies on ttc to figure out what to highlight, maybe it is possible that we should refactor to use eta instead?
// TODO: DEBUG THIS SHIT
export const highlightDefaults = (taskList, start, end, owl = false) => {
	const endTimeMillis = owl ? end.getTime() + hoursToMillis(24) : end.getTime()
	const initialTimeMillis = start.getTime()
	const startOfDayMillis = new Date(initialTimeMillis).setHours(0, 0, 0, 0)
	const secondsElapsedFromEnd = ((endTimeMillis - initialTimeMillis) + initialTimeMillis - startOfDayMillis) / 1000

	// old way using ttc to figure it out
	/*
	return pipe(
		() => taskList,
		taskList => taskList.map(obj => obj['ttc'] ?? 0),
		TTCList => TTCList.reduce((acc, ttc, index) => [...acc.slice(index !== 0 ? 0 : 1), acc[acc.length - 1] + (ttc ? hoursToMillis(ttc) : 0)], [start.getTime()]),
		timeStampList => timeStampList.map(timestamp => isTimestampFromToday(new Date(start), timestamp / 1000, secondsElapsedFromEnd) ? ' ' : 'old')
	)()
	*/
	
	// new way using eta list to figure it out
	// 0. Calculate Variables
	const hoursInDay = millisToHours(endTimeMillis - start.getTime()) // end - start time in hours
	const endDate = new Date(endTimeMillis) // End Time with proper date
	// 1. Grab ETA list
	const etas = taskList.map(task => task.eta)
	// 2. Using the ETA list, we convert it to the associated Date
	const dates = etas.map(eta => parse(eta, "HH:mm", new Date(startOfDayMillis)))
	// 3. Using the Dates, they will all be from the same day, so we must convert it to the corrected Dates
	const properDates = dates.reduce((acc, date, index) => {
		const prev = acc[0]
		const prevDate = acc[1][acc[1].length - 1]

		const diff = date && typeof date === 'string' ? millisToHours(date.getTime() - prevDate.getTime()) : 0 // importantly can be negative!
		const otherDiff = date && typeof date === 'string' ? millisToHours(date.getTime() - prevDate.getTime() + hoursToMillis(24)) : 0
		const sum = parseFloat(prev) + parseFloat(Math.abs(diff > 0 ? diff : otherDiff)) 

		const next = !date || isNaN(date)
		? prevDate
		: (date.getTime() - start.getTime() > 0 ? date : new Date(date.getTime() + hoursToMillis(24)))

		return [sum, [...acc[1], next]] // next is supposed to be a list of dates
	}, [0, [new Date(start.getTime())]])[1].slice(1)

	console.log(properDates.map(date => format(date, "HH:mm").concat(" , ").concat(date.getDate())))

	// 4. Using proper dates, we can return the list of highlights!
	return properDates.map((properDate, index) => {
		// if start.getTime() < properDate.getTime() < endDate.getTime(), then it is '' else it is old
		const ret = (start.getTime() <= properDate.getTime()) && (properDate.getTime() <= endDate.getTime())
		//if (index === properDates.length - 1) console.log(`properDate: ${properDate}\nstart: ${start}\nend: ${endDate}\nproperDate in (start,end) : ${ret}`)
		return ret ? ' ' : 'old'
	})

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

// Converts all Eta strings to dates from Today for simplified processing. Do not use for tasks from tomorrow or yesterday and beyond.
export const etaToDates = (taskList, time) => {
	return taskList?.map(task => {
		const [hours, minutes] = task?.eta.split(':')
		return { ...task, eta: new Date(time.getFullYear(), time.getMonth(), time.getDate(), hours, minutes) }
	})
}

// Converts taskList Eta Dates back into strings (Except for Completed tasks)
export const etaToStrings = taskList => taskList.map(task => { return { ...task, eta: format(task.eta, "HH:mm") } })


/*
Waste Feature Calculations

start = Date, start of task interval (we get it from time picker)
taskList = Array of Tasks
time = Date, current time

returns Array of Tasks, updated with new waste and ttc (only update those)
*/
// TODO: Be sure to handle cases involving invalid lists, in other words, do basic input validation on entry
// TODO: Pipe this
// TODO: ETA should match waste when the task is loaded normally. In other words, if waste is -.5 then eta should reflect that
export const calculateWaste = ({ start, taskList, time = new Date() }) => {
	const add = (start, hours) => { return new Date(start.getTime() + hoursToMillis(hours)) } // (Date: start, hours: hours) -> Date(start + hours)
	const subtract = (time, eta) => { return millisToHours(time.getTime() - eta.getTime()) } // (Date: time, Date: eta) -> time - eta (hours)
	const etaList = (taskList, start = 0) => {
		return taskList.reduce((acc, task, index) => [...acc.slice(index === 0 ? 1 : 0), parseFloat(acc[acc.length - 1]) + parseFloat(task.ttc)], [start])
	} // Example: ([{ttc: 1}, {ttc: 2}, {ttc: 1}], start = 0) -> [1, 3, 4]

	const firstIncompleteIndex = taskList?.findIndex(task => task.status !== TASK_STATUSES.COMPLETED)
	const etas = etaList(taskList.slice(firstIncompleteIndex)) // etas calculated only for the incomplete tasks

	const normal = (tasks = etaToDates(taskList, time), currentTime = time) => {
		const lastCompletedTimestamp = tasks[firstIncompleteIndex - 1]?.completedTimeStamp * 1000 // last completedTimestamp to millis
		const startTime = firstIncompleteIndex === 0 || !lastCompletedTimestamp || isNaN(lastCompletedTimestamp) ? start : new Date(lastCompletedTimestamp) // startTime is a Date 
		return etaToStrings(tasks.map((task, index) => {
			const eta = index >= firstIncompleteIndex ? add(startTime, etas[index - firstIncompleteIndex]) : new Date(currentTime) // index - firstIncomplete shifts accordingly
			const waste = index === firstIncompleteIndex ? subtract(currentTime, eta) : 0 // we must use the updated eta value
			return task.status === TASK_STATUSES.COMPLETED ? { ...task } : { ...task, waste, eta }
		}))
	}

	return normal()
}