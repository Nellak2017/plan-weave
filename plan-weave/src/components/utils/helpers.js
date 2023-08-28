import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema'
import { getTime, format } from 'date-fns'
import { MILLISECONDS_PER_HOUR, MILLISECONDS_PER_DAY, TASK_STATUSES } from './constants'

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

// TODO: Rename this function to be more generic, it will work on Tasks and beyond!
// TODO: Refactor this to use Immer and Rambda/Folktale to make it functional for real (like remove try/catch and use Maybe objects)
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
	if (!filter || !attribute) return list
	return list.filter(item => item[attribute]?.toLowerCase()?.includes(filter?.toLowerCase()))
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
export const highlightDefaults = (taskList, start, end, owl = false) => {
	// 1. Get all ttc from the task list, store in another list (TTCList)
	const TTCList = taskList.map(obj => obj['ttc'] ?? 0) // if ttc is not defined it will be 0 so it doesn't affect outcome

	// 2. Loop through TTCList, 1st value = start + ttc, nth value after is prev + ttc
	let currTime = start.getTime()
	const timeStampList = TTCList.map(ttc => {
		currTime += ttc ? hoursToMillis(ttc) : 0
		return currTime
	})

	// 3. return this highlight list
	const endTimeMillis = owl ? end.getTime() + hoursToMillis(24) : end.getTime()
	const initialTimeMillis = start.getTime()
	const startOfDayMillis = new Date(initialTimeMillis).setHours(0, 0, 0, 0)
	const secondsElapsedFromEnd = ((endTimeMillis - initialTimeMillis) + initialTimeMillis - startOfDayMillis) / 1000
	return timeStampList.map(timestamp => isTimestampFromToday(new Date(start), timestamp / 1000, secondsElapsedFromEnd) ? ' ' : 'old')
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
 * Updates the ETA values for a list of tasks based on the provided start time and task information.
 *
 * @param {Object} options - The options for updating the task list.
 * @param {Date} options.start - The start time in Date object.
 * @param {Array<Object>} options.taskList - The list of tasks to update.
 * @param {Function} [options.getTime] - The function to get the current time. Default is the system time.
 * @param {Function} [options.hoursToMillis] - The function to convert hours to milliseconds. Default is provided function.
 * @param {Function} [options.format] - The function to format time. Default is provided function.
 * @returns {Array<Object>} The list of tasks with updated ETA values.
 */
// TODO: Refactor this to use Reduce instead of imperative loop
export const updateTaskListEta = ({ start, taskList, getTheTime = getTime, hoursConverter = hoursToMillis, formatter = format }) => {
	let currentTime = getTheTime(start)
	const updatedTaskList = [...taskList].map(task => {
		if (!task.eta) return task
		currentTime += hoursConverter(task.ttc || 0)
		return { ...task, eta: formatter(currentTime, 'HH:mm') }
	})
	return updatedTaskList
}

/*
Waste Feature Calculations

start = Date, start of task interval (we get it from time picker)
taskList = Array of Tasks
time = Date, current time

returns Array of Tasks, updated with new waste, ttc, other
*/

// TODO: Simplify the logic and make it more elegant once all test cases passing and functionality is good
// It is possible you may need to have the previous taskList as well so that you can see diffs?
// Or maybe you can use a boolean object to see what is being updated
export const calculateWaste = ({ start, taskList, time = new Date(), indexUpdated = -1 }) => {
	// Converts taskList Etas into Dates that can be manipulated (Except for Completed tasks)
	// NOTE: THIS FUNCTION ASSUMES THAT ALL COMPLETED TASKS ARE DONE TODAY, MAY CAUSE ISSUES LATER.
	const etaToDates = (taskList, start) => {
		// Add completed tasks to the new etaToDates for the non-completed tasks
		// This way completed tasks has no effect on eta or other calcs and they retain their original values
		const completedTasks = taskList.slice(0, firstIncompleteIndex).map(task => {
			const [hours, minutes] = task.eta.split(':')
			return { ...task, eta: new Date(time.getFullYear(), time.getMonth(), time.getDate(), hours, minutes) }
		})

		return completedTasks.concat(
			taskList.slice(firstIncompleteIndex).reduce((acc, task, index) => {
				const prevEta = index === 0 ? start : acc[index - 1].eta
				const increment = hoursToMillis(task.ttc)
				const newEta = new Date(prevEta.getTime() + increment)

				return [
					...acc,
					{
						...task,
						eta: newEta
					}
				]
			}, []))
	}

	// Converts taskList Eta Dates back into strings (Except for Completed tasks)
	const etaToStrings = (taskList) => {
		return taskList.map(task => {
			return {
				...task,
				eta: format(task.eta, "HH:mm")
			}
		})
	}

	const firstIncompleteIndex = taskList.findIndex(task => task.status !== TASK_STATUSES.COMPLETED)
	const manipulatedDates = etaToDates(taskList, start)

	// 1. In a list of tasks, the first task that is incomplete will have a waste = time - eta.
	// 2. In a list of tasks, the complete tasks will initialize with their established waste values.
	if (indexUpdated === -1) {
		// Updates the first task, as per requirement 1. and 2.
		const newTaskListFirst = etaToStrings(manipulatedDates.map((task, index) => {
			if (index === firstIncompleteIndex && task.status !== TASK_STATUSES.COMPLETED) {
				return {
					...task,
					waste: millisToHours(time.getTime() - task.eta.getTime())
				}
			}
			return task
		}))

		return newTaskListFirst
	}
	// 3. When a Task Goes from Incomplete to Completed, it will stop calculating waste values. The waste = time - eta, then ttc is altered.
	const isCompletedTaskUpdating = manipulatedDates[indexUpdated]['status'] === TASK_STATUSES.COMPLETED // true if Completed, false otherwise
	if (indexUpdated >= 0 && isCompletedTaskUpdating) {
		// NOTE: Eta for Completed must be accurate coming in, or the waste calculation will fail
		/*
			1. update completedTimeStamp to be time, which in this case is 18:30 timestamp
			2. calculate waste = time - Date(eta)
			3. update the next tasks to have correct eta and waste values
		*/
		const completedTimeStamp = time.getTime() / 1000
		const waste = millisToHours(time.getTime() - manipulatedDates[indexUpdated].eta.getTime())
		const ttc = Math.max(millisToHours(time.getTime() - start.getTime()), 0.01)

		const newTaskList = manipulatedDates.map((task, index) => {
			const oldEta = task.eta.getTime()
			if (index === indexUpdated) return { ...task, waste, completedTimeStamp, ttc, eta: time }
			else if (index === firstIncompleteIndex) return {
				...task,
				eta: new Date(oldEta + hoursToMillis(ttc)),
				waste: millisToHours((oldEta + hoursToMillis(waste)) - time.getTime()),
			}
			else if (index > firstIncompleteIndex) return { ...task, eta: new Date(oldEta + hoursToMillis(ttc)), waste: 0 }
			else return task
		})
		const ret = etaToStrings(newTaskList)
		return ret
	}
	// 4. When a Task Goes from Completed to Incomplete, it will resume calculating waste values from where it left off. waste = time - eta
	if (indexUpdated >= 0 && !isCompletedTaskUpdating) {
		/*
		1. Don't Touch Completed tasks
		2. The task being updated must have valid waste, ttc, and eta set already.
		   Thus, use the waste value to calculate all later task etas, they must be properly updated
		3. Once the tasks after indexUpdated have had their values updated using reduce,
		   update the waste of the indexUpdated task to be waste = time - eta as usual
		4. return this
		*/
		const completedTasks = manipulatedDates.slice(0, firstIncompleteIndex)
		const incompleteTasks = manipulatedDates.slice(firstIncompleteIndex)

		const ret = completedTasks.concat(incompleteTasks).reduce((acc, task, index) => {
			const updatedTask = { ...task }
			acc.push(updatedTask)

			const reducedHours = acc.reduce((sum, t, i) => i !== (indexUpdated - completedTasks.length) + 1 ? sum + t.ttc + t.waste : sum + t.ttc, 0)
			const accumulatorValue = hoursToMillis(reducedHours) + start.getTime()

			if (index !== (indexUpdated - completedTasks.length)) {
				updatedTask.eta = format(new Date(accumulatorValue), "HH:mm")
			}
			return acc
		}, [])

		const temp = ret.map((task, index) => index === (indexUpdated - completedTasks.length) ? {
			...task,
			waste: millisToHours(time.getTime() - task.eta.getTime()),
			eta: format(new Date(task.eta.getTime()), "HH:mm"),
		} : task)

		return temp
	}
}














