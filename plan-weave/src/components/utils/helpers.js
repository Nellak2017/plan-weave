import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema'
import { getTime, formatISO } from 'date-fns'
import { MILLISECONDS_PER_HOUR, MILLISECONDS_PER_DAY, TASK_STATUSES } from './constants'

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
 * Eta is an ISOString so that it is serializable in the redux store.
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
			const eta = index >= firstIncompleteIndex ? add(startTime, etas[index - firstIncompleteIndex]) : currentTime // index - firstIncomplete shifts accordingly
			const waste = index === firstIncompleteIndex ? subtract(currentTime, eta) : 0 // we must use the updated eta value.
			return task?.status === TASK_STATUSES.COMPLETED ? { ...task } : { ...task, waste, eta: formatISO(eta) }
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
 * Deletes the specified range of indices, inclusive, from the DnD configuration, while maintaining dnd config invariants.
 *
 * @param {number[]} dnd - The DnD configuration array.
 * @param {number[]} indexRange - The range of indices to be deleted. [start, end]
 * @returns {number[]} The updated DnD configuration after deleting the specified range.
 * @throws {TypeError} Throws a TypeError if the input parameters are invalid.
 * 
 * @example
 * // Example 1: Deleting a single index
 * const dnd = [1, 3, 2, 4, 5]
 * const result1 = deleteDnDEvent(dnd, [0, 0])
 * // Result: [1, 0, 2, 3]
 *
 * @example
 * // Example 2: Deleting a range of indices starting from 0
 * const dnd = [1, 3, 2, 4, 5]
 * const result2 = deleteDnDEvent(dnd, [0, 2])
 * // Result: [0, 1]
 *
 * @example
 * // Example 3: Deleting another range of indices starting from not 0
 * const dnd = [1, 3, 2, 4, 5]
 * const result3 = deleteDnDEvent(dnd, [2, 3])
 * // Result: [0, 1, 2]
 */
export const deleteDnDEvent = (dnd, indexRange) => {
	if (!Array.isArray(dnd) || !Array.isArray(indexRange) || indexRange.length !== 2) {
		throw new TypeError(`Invalid input parameters in deleteDnDEvent.\ndnd = ${dnd}\nindexRange = ${indexRange}`)
	}
	const [startIndex, endIndex] = indexRange
	const invalidRange = startIndex < 0 || endIndex < startIndex || endIndex >= dnd.length
	if (invalidRange) throw new TypeError(`Invalid index range in deleteDnDEvent.\nRange = ${indexRange}`)

	return ordinalSet(dnd.filter((_, i) => i < startIndex || i > endIndex))
}

/**
 * Sorts tasks with completed tasks on top and applies transformation functions.
 *
 * @param {Object[]} reduxTasks - The list of tasks from Redux.
 * @param {Object[]} tasks - The list of tasks to be sorted.
 * @param {Date} start - The start time for calculating waste.
 * @param {Function[]} transforms - A list of transformation functions to apply (optional).
 * @param {Function} sort - A sorting function. Must be explicitly defined so no bugs happen.
 * @returns {Object[]} The sorted and transformed list of tasks.
 */
export const completedOnTopSorted = (reduxTasks, tasks, start, transforms, sort = t => t.slice()) => {
	// transforms is a list of transformation functions, tasks => ordering of tasks
	if (!transforms) {
		transforms = [
			t => transform(t, reduxTasks.map((_, i) => i)),
			t => calculateWaste({ start, taskList: t, time: new Date() })
		]
	}
	if (!reduxTasks) return tasks && tasks.length > 0 ? transformAll(tasks, transforms) : []

	const completedTasks = sort([...reduxTasks].filter(task => task?.status === TASK_STATUSES.COMPLETED))
	const remainingTasks = sort([...reduxTasks].filter(task => task?.status !== TASK_STATUSES.COMPLETED))
	return transformAll([...completedTasks, ...remainingTasks], transforms)
}

/**
 * Constructs a string that is not present in the original list of strings using the diagonal argument.
 *
 * The function takes an array of strings and applies the diagonal argument to generate a new string
 * that is not found in the original list. It increments the characters along the diagonal of each string
 * to create the new string.
 *
 * @param {string[]} strList - An array of strings from which to construct the new string.
 * @throws {Error} Throws an error if the input is not a valid array of strings.
 * @returns {string} A string that is not present in the original list.
 *
 * @complexity O(n), where n is the length of the input strings in `strList`.
 *
 * @example
 * const example = ['apple', 'banana','cherry', 'glass']
 * console.log(diagonalize(originalStrings)) // resulting string is not in original list
 * > 'bbft'
 */
export const diagonalize = strList => {
	// 1. Input verification: Ensure all elements in the list are strings
	if (!Array.isArray(strList) || !strList.every(str => typeof str === 'string')) throw new Error('Invalid input. Expected an array of strings.')

	// 2. Consider the diagonal characters of the strings and add 1 to them, this results in a string not in the list
	return strList.map((str, i) => i < str.length ? String.fromCharCode(str[i].charCodeAt(0) + 1) : 'a').join('')
}

/**
 * Calculates the range of tasks to display based on the number of tasks per page and the current page.
 *
 * @param {number} tasksPerPage - The number of tasks to display per page.
 * @param {number} page - The current page number.
 * @returns {Array} An array representing the range of tasks to display. The first element is the starting index (inclusive),
 * and the second element is the ending index (exclusive). If either tasksPerPage or page is not a valid integer, [0, undefined]
 * is returned.
 */

export const calculateRange = (tasksPerPage, page) => (isInt(tasksPerPage) && isInt(page))
	? [(page - 1) * tasksPerPage + 1, page * tasksPerPage]
	: [0, undefined]


/**
 * Calculates the index at which a task should be inserted in order to maintain DnD index invariants.
 *
 * This function supports the sorting of tasks based on completion status and ensures that the DnD
 * configuration is updated correctly after completing or incompleting a task.
 *
 * @param {Array} tasks - The array of tasks to consider.
 * @param {Function} sort - The sorting function to determine the order of tasks.
 * @param {number} index - The index of the task being completed or incompleted.
 * @returns {number} - The index at which the task should be inserted to maintain dnd invariants.
 *
 * @example
 * // This is a Incomplete --> Complete Case
 * // task 3 is out of order because it is being updated in TaskRow. TaskTable will adjust it based on the result of this fx.
 * 
 * const tasks = [{id: 1, status: 'completed'}, {id: 2, status: 'incomplete'}, {id: 3, status: 'completed'}] 
 * const sort = (a, b) => a.id - b.id // Sort by task ID
 * const indexOfInsertion = relativeSortIndex(tasks, sort, 2)
 * 
 * // Result: indexOfInsertion is 1, maintaining DnD index invariants after completing task with ID 3.
 */

export const relativeSortIndex = (tasks, sort, id, complete = TASK_STATUSES.COMPLETED, incomplete = TASK_STATUSES.INCOMPLETE) => {
	const newTasks = tasks.map(el => ({ ...el })) // ensures no proxies used
	const completed = newTasks.filter(t => t.status === complete)
	const incompleted = newTasks.filter(t => t.status === incomplete)
	const task = newTasks.find(t => parseInt(t.id) === parseInt(id))
	return task.status === complete
		? sort(completed).indexOf(task) 					 // Incomplete --> Complete Case
		: completed.length + sort(incompleted).indexOf(task) // Complete   --> Incomplete Case
}

/**
 * Determines the highlight style for a task row based on provided conditions.
 *
 * @param {boolean} isHighlighting - Indicates whether the row should be highlighted.
 * @param {boolean} isChecked - Indicates whether the task is checked.
 * @param {boolean} isOld - Indicates whether the task is considered old.
 *
 * @throws {TypeError} Throws an error if any of the input parameters are not boolean.
 *
 * @returns {string} Returns a string representing the highlight style:
 * - 'selected': If isHighlighting is true and isChecked is true.
 * - 'old': If isHighlighting is false, isChecked is false, and isOld is true.
 * - '': If none of the above conditions are met.
 */
export const highlightTaskRow = (isHighlighting, isChecked, isOld) => {
	if (typeof isHighlighting !== 'boolean' || typeof isChecked !== 'boolean' || typeof isOld !== 'boolean') {
		throw new TypeError('All parameters must be of type boolean')
	}

	if (isHighlighting && isChecked) return 'selected'
	else if (!isHighlighting && !isChecked && isOld) return 'old'
	else return ''
}

/**
 * Transforms a given date by setting its time to match today's date.
 *
 * @param {Date} start - The original date to be transformed.
 * @throws {TypeError} Throws a TypeError if the input is not a valid Date.
 * @returns {Date} A new date with the same time as the input but today's date.
 * 
 * * @example
 * // Example 1: Transform a valid date to today's date
 * const inputDate = new Date('2023-01-15T12:00:00Z')
 * const transformedDate = dateToToday(inputDate)
 * // Result: A new Date object with today's date and the same time as the input.
 *
 * @example
 * // Example 2: Throw error for invalid input
 * const invalidInput = 'abc'
 * try {
 *   const result = dateToToday(invalidInput) // Throws a TypeError
 * } catch (error) {
 *   console.error(error.message) // Output: `Invalid input. Expected a Date for dateToToday function.\n${start}`
 * }
 */
export const dateToToday = (start) => {
	if (!(start instanceof Date) || isNaN(start.getTime())) {
		throw new TypeError(`Invalid input. Expected a Date for dateToToday function.\n${start}`)
	}
	const initOfToday = new Date().setHours(0, 0, 0, 0) // beginning of today in millis
	const initOfStart = new Date(start).setHours(0, 0, 0, 0)
	const timeSinceStart = start.getTime() - initOfStart // millis since start's start of day
	return new Date(initOfToday + timeSinceStart) // start but with today's date
}