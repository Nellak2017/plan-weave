/* eslint-disable max-lines */
import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../schemas/simpleTaskSchema.js'
import { getTime, formatISO, parseISO } from 'date-fns'
import { MILLISECONDS_PER_HOUR, MILLISECONDS_PER_DAY, TASK_STATUSES, MAX_SAFE_DATE } from './constants.js'
import * as Yup from 'yup'
import { isEqual as lodashIsEqual } from 'lodash'

// This file contains many helpers used through out the application
// --- Private Functions
// validate function private helpers
export const validateTransformation = (task, schema, customErrorMessage) => {
	// Rescript port
	const customErrorProcessed = customErrorMessage !== undefined ? customErrorMessage : ""
	const str = JSON.stringify(task)
	const errorMessage = str !== undefined ? customErrorProcessed + " task : " + str : "Failed to stringify task for error message"
	return (schema.isValidSync(task, { strict: true })) ? { TAG: "Ok", _0: undefined } : { TAG: "Error", _0: errorMessage }
}
const isRequired = (field, schema) => schema.describe().fields[field] ? !schema?.describe()?.fields[field]?.optional : false
const requiredFields = (schema) => Object.keys(schema.describe().fields)
	.map(field => isRequired(field, schema) ? field : null)
	.filter(field => field !== null)
// calculate waste helpers
const step = (x, thresholdOpt) => (x > (thresholdOpt !== undefined ? thresholdOpt : 0)) ? 1 : 0
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
export const add = (start, hours) => new Date(clamp(start.getTime() + hoursToMillis(hours), 0, MAX_SAFE_DATE)) // (Date: start, hours: hours) -> Date(start + hours)
export const subtract = (time, eta) => millisToHours(time.getTime() - eta.getTime()) // (Date: time, Date: eta) -> time - eta (hours)
export const etaList = (taskList, start = 0) => (taskList.length === 0)
	? [] // to preserve the length property. ([]) => any because calculateWaste skips over the empty list case 
	: taskList.reduce((acc, task, index) =>
		[...acc.slice(index === 0 ? 1 : 0), parseFloat(acc[acc.length - 1]) + parseFloat(task?.ttc)],
		[start]) // (TaskList : [task]) => [Eta : Float] # it is the times of each Eta
// --- Helpers Exported
export const formatTimeLeft = ({ minuteText = 'minutes left', hourText = 'hour', hourText2 = 'hours left', overNightMode = false, currentTime = new Date(), endTime, timeDifference = 0, }) => {
	const calculateTimeDifference = ({ endTime, currentTime = new Date(), timeDifference = 0, overNightMode = false }) => (timeDifference > 0) // Returns Time in Milliseconds, given the constaints of the application
		? timeDifference * MILLISECONDS_PER_HOUR
		: Math.max(0, (overNightMode
			? getTime(new Date(endTime)) + MILLISECONDS_PER_DAY
			: getTime(endTime)) - currentTime.getTime())
	const formatTime = timeMillis => { // Returns proper format of time, given the time and other relevant information
		const totalHours = timeMillis / MILLISECONDS_PER_HOUR
		const timeLeftInHours = Math.floor(totalHours)
		const timeLeftInMinutes = Math.floor((totalHours - timeLeftInHours) * 60)
		return (timeLeftInHours > 0)
			? (timeLeftInMinutes > 0
				? `${timeLeftInHours} ${hourText}${timeLeftInHours > 1 ? 's' : ''} ${timeLeftInMinutes} ${minuteText}`
				: `${timeLeftInHours} ${hourText2}`)
			: `${timeLeftInMinutes} ${minuteText}`
	}
	return formatTime(calculateTimeDifference({ endTime, currentTime, timeDifference, overNightMode }))
}
export const isTimestampFromToday = (today, timestamp, secondsFromStart = 86400) => {
	const startOfTodaySeconds = new Date(today).setHours(0, 0, 0, 0) / 1000 // seconds since 1970 from start of day
	return (startOfTodaySeconds <= timestamp) && (timestamp <= (startOfTodaySeconds + secondsFromStart))
}
export const validateTask = ({ task, schema = simpleTaskSchema, schemaDefaultFx = fillDefaultsForSimpleTask, customErrorMessage = `Failed to validate Task in validateTask function. This is likely a programming bug.` }) => {
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
		const updatedTask = schemaDefaultFx(task) // fill defaults if there are other undefined attributes too
		const finalTask = Object.keys(updatedTask).reduce((acc, field) => {
			const fieldExists = schema?.fields[field]
			return { ...acc, [field]: (fieldExists?.isValidSync(updatedTask[field]) || !fieldExists) ? updatedTask[field] : fieldExists.getDefault() }
		}, {})
		validateTransformation(finalTask, schema, customErrorMessage)
		return finalTask
	}
}
export const validateTasks = ({ taskList, schema = simpleTaskSchema, schemaDefaultFx = fillDefaultsForSimpleTask, customErrorMessage = `Failed to validate Task in validateTask function. This is likely a programming bug.` }) => taskList?.map(task => validateTask({ task, schema, schemaDefaultFx, customErrorMessage }))
export const validateTaskField = ({ field, payload, schema = simpleTaskSchema, logger = console.error }) => {
	try {
		const fieldSchema = Yup.reach(schema, field)
		fieldSchema.validateSync(payload, { abortEarly: false })
		return { valid: true, error: null }
	} catch (e) {
		logger(e)
		return { valid: false, error: e.errors }
	}
}
export const filterTaskList = (filter, attribute) => list => (!filter || !attribute) ? list : list.filter(item => item[attribute]?.toLowerCase()?.includes(filter?.toLowerCase()))
export const hoursToSeconds = hours => hours * 60 * 60
export const hoursToMillis = hours => hours * 60000 * 60
export const millisToHours = milliseconds => (milliseconds / 60000) / 60
export const calculateWaste = ({ start, taskList, time = new Date() }) => {
	if (!taskList || taskList.some(task => !task)) {
		console.warn('Task list is undefined or has some undefined values', taskList)
		return taskList
	}
	const firstIncompleteIndex = taskList?.findIndex(task => task?.status !== TASK_STATUSES.COMPLETED)
	const etas = etaList(taskList.slice(firstIncompleteIndex)) // etas calculated only for the incomplete tasks
	const lastCompletedTimestamp = taskList[firstIncompleteIndex - 1]?.completedTimeStamp * 1000 // last completedTimestamp to millis
	const startTime = firstIncompleteIndex === 0 ? start : new Date(lastCompletedTimestamp) // startTime is a Date 
	return taskList.map((task, index) => {
		const eta = index >= firstIncompleteIndex ? add(startTime, etas[index - firstIncompleteIndex]) : time // index - firstIncomplete shifts accordingly
		const waste = index === firstIncompleteIndex ? subtract(time, eta) : 0 // we must use the updated eta value.
		return task?.status === TASK_STATUSES.COMPLETED ? { ...task } : { ...task, waste, eta: formatISO(eta) }
	})
}
export const isInt = number => ((!!number || number === 0) && typeof number === 'number' && Math.floor(number) === number && isFinite(number))
export const reorderList = (tasks, reordering) => tasks.map((_, i) => tasks[reordering[i]])
export const transformAll = (tasks, transforms) => transforms.reduce((task, f) => f(task), tasks)
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
export const ordinalSet = dnd => {
	const mapping = {}
	const uniqueSortedArr = [...new Set(dnd)].sort((a, b) => a - b)
	uniqueSortedArr.forEach((num, index) => { mapping[num] = index })
	return dnd.map(num => mapping[num])
}
export const deleteDnDEvent = (dnd, indexRange) => ordinalSet(dnd.filter((_, i) => i < indexRange.startIndex || i > indexRange.endIndex))
export const isRelativelyOrdered = (list1, list2) => ((list1.length !== list2.length) || list1.length <= 1) 
	? list1.length <= 1
	: list1.slice(0, -1).reduce((acc, a, i) => {
		if (!acc) return false
		const [b, c, d] = [list1[i + 1], list2[i], list2[i + 1]]
		return (a < b && c < d) || (a > b && c > d)
	}, true)
export const pipe = (...f) => x => f.reduce((acc, fn) => fn(acc), x)
export const completedOnTopSorted = (sort = t => t.slice(), status = TASK_STATUSES) => reduxTasks => [
	...sort([...reduxTasks || []].filter(task => task?.status === status.COMPLETED)),
	...sort([...reduxTasks || []].filter(task => task?.status !== status.COMPLETED))
]
export const calculateRange = (tasksPerPage, page) => (isInt(tasksPerPage) && isInt(page))
	? [(page - 1) * tasksPerPage + 1, page * tasksPerPage]
	: [0, undefined]
export const filterPages = (startRange, endRange) => taskList => taskList?.slice(startRange - 1, endRange)
export const diagonalize = strList => (!Array.isArray(strList) || !strList.every(str => typeof str === 'string'))
	? ''
	: strList.map((str, i) => i < str.length ? String.fromCharCode(str[i].charCodeAt(0) + 1) : 'a').join('')
export const relativeSortIndex = (tasks, sort, id, complete = TASK_STATUSES.COMPLETED, incomplete = TASK_STATUSES.INCOMPLETE) => {
	const newTasks = tasks.map(el => ({ ...el })) // ensures no proxies used
	const completed = newTasks.filter(t => t.status === complete)
	const incompleted = newTasks.filter(t => t.status === incomplete)
	const task = newTasks.find(t => parseInt(t.id) === parseInt(id))
	return task.status === complete
		? sort(completed).indexOf(task) 					 // Incomplete --> Complete Case
		: completed.length + sort(incompleted).indexOf(task) // Complete   --> Incomplete Case
}
export const highlightTaskRow = (isHighlighting, isChecked, isOld) => {
	if (typeof isHighlighting !== 'boolean' || typeof isChecked !== 'boolean' || typeof isOld !== 'boolean') {
		throw new TypeError(`All parameters must be of type boolean.\nisHighlighting = ${isHighlighting}\nisChecked = ${isChecked}\nisOld = ${isOld}`)
	}
	if (isHighlighting && isChecked) return 'selected'
	else if (!isHighlighting && !isChecked && isOld) return 'old'
	return ''
}
export const dateToToday = (start) => {
	// ReScript port
	const now = new Date(Date.now())
	if (!(start instanceof Date) || isNaN(start.getTime())) {
		return { TAG: "Error", _0: "Invalid input. Expected a Date for dateToToday function." }
	}
	const initOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf()
	const initOfStart = new Date(start.getFullYear(), start.getMonth(), start.getDate()).valueOf()
	return { TAG: "Ok", _0: new Date(initOfToday + (start.valueOf() - initOfStart)) }
}
// ReScript port
const floatToStringNullable = (num, fallbackOpt) => (num === null || num === undefined) ? fallbackOpt !== undefined ? fallbackOpt : "undefined or null" : num.toString()
export const calculateEfficiency = (startTime, endTime, ttcHours) => {
	// Rescript Port
	const timeDiff = endTime - startTime
	const efficiencyFormula = hoursToSeconds(ttcHours) / (timeDiff * step(timeDiff, undefined))
	const parametersString = "\nstartTime = " + floatToStringNullable(startTime, undefined) + "}\nendTime = " + floatToStringNullable(endTime, undefined) + "}\nttcHours = " + floatToStringNullable(ttcHours, undefined) + "}"
	const undefinedString = "Type Error. Expected (startTime, endTime, ttcHours := Not undefined)." + parametersString
	const invalidTypeString = "Type Error. Expected (startTime, endTime, ttcHours := Float)." + parametersString
	const parameterRangeString = "Invalid input parameter Range."
	const beyondMaxDateString = parameterRangeString + " Expected (startTime, endTime := [0,max safe date (8.64e15)))." + parametersString
	const belowZeroErrorString = parameterRangeString + " Expected (startTime, endTime := [0,max safe date (8.64e15)]), (ttcHours := (0,24])." + parametersString
	const moreThanDayString = parameterRangeString + " Expected (endTime - startTime <= 86400), (ttcHours <= 24)." + parametersString
	const startEqualsEndString = parameterRangeString + " Expected (startTime === endTime)." + parametersString
	const startGreaterEndString = parameterRangeString + " Expected (startTime < endTime).No longer supporting domain extension." + parametersString
	const unknownErrorString = "Unknown Error has occurred in calculateEfficiency function." + parametersString
	const undefinedError = startTime === undefined || endTime === undefined || ttcHours === undefined
	const invalidInputTypeError = !Number.isFinite(startTime) || !Number.isFinite(endTime) || !Number.isFinite(ttcHours)
	if (undefinedError) {
		return { TAG: "Error", _0: undefinedString }
	} else if (invalidInputTypeError) {
		return { TAG: "Error", _0: invalidTypeString }
	} else if (startTime < 0.0 || endTime < 0.0 || ttcHours <= 0.0) {
		return { TAG: "Error", _0: belowZeroErrorString }
	} else if (startTime > 8.64e15 || endTime > 8.64e15) {
		return { TAG: "Error", _0: beyondMaxDateString }
	} else if (endTime - startTime > 86400.0 || ttcHours > 24.0) {
		return { TAG: "Error", _0: moreThanDayString }
	} else if (startTime === endTime) {
		return { TAG: "Error", _0: startEqualsEndString }
	} else if (startTime > endTime || !Number.isFinite(efficiencyFormula)) {
		return { TAG: "Error", _0: startGreaterEndString }
	} else if (startTime < endTime) {
		return { TAG: "Ok", _0: efficiencyFormula }
	} else {
		return { TAG: "Error", _0: unknownErrorString }
	}
}

export const isValidDate = date => (new Date(date) != "Invalid Date") && !isNaN(new Date(date))
export const isTaskOld = (timeRange, task) => {
	const { start, end } = { ...timeRange }
		? { start: parseISO(timeRange?.start), end: parseISO(timeRange?.end) }
		: { 0: new Date(new Date().setHours(0, 0, 0, 0)), 1: new Date(new Date().setHours(24, 59, 59, 59)) }
	const epochDiff = (end - start) / 1000 // seconds between end and start
	const epochTimeSinceStart = (start.getTime() - new Date(start).setHours(0, 0, 0, 0)) / 1000 // seconds between 00:00 and start
	const epochTotal = epochDiff >= 0 ? epochDiff + epochTimeSinceStart : epochTimeSinceStart // seconds in our modified day. If negative, then default to full day
	const epochETA = parseISO(task?.eta)?.getTime() / 1000
	return !isTimestampFromToday(start, epochETA, epochTotal)
}
export const findLastCompletedTask = tasks => {
	const completedTasks = tasks.filter(task => task?.status === TASK_STATUSES.COMPLETED)
	const len = completedTasks?.length
	return len > 0 ? completedTasks[len - 1] : null
}
export const findFirstIncompleteTask = tasks => {
	const incompleteTasks = tasks.filter(task => task?.status === TASK_STATUSES.INCOMPLETE)
	return incompleteTasks?.length > 0 ? incompleteTasks[0] : null
}
export const correctEfficiencyCase = (prevCompletedTask, taskObject, completedTimeStamp, localTtc) => {
	const { status, eta } = taskObject
	const prevEta = prevCompletedTask?.eta
	const epochETA = getTime(parseISO(eta)) / 1000 // converts ISO eta to epoch
	const prevEpochETA = getTime(parseISO(prevEta)) / 1000 // converts ISO prev eta to epoch
	const normalizeToDayRange = timeInSeconds => timeInSeconds % 86400 // TODO: untested 
	const normalizedEpochETA = normalizeToDayRange(epochETA)
	const normalizedPrevEpochEta = normalizeToDayRange(prevEpochETA)
	const normalizedCompletedTimeStamp = normalizeToDayRange(completedTimeStamp)
	// No Completed Tasks
	if (!prevCompletedTask) {
		try {
			return calculateEfficiency(normalizedEpochETA, normalizedCompletedTimeStamp, localTtc)
		} catch (e) {
			console.error(e)
		}
	}
	// Incomplete -> Completed Case
	if (status === TASK_STATUSES.INCOMPLETE) {
		try {
			return calculateEfficiency(normalizedPrevEpochEta, normalizedCompletedTimeStamp, localTtc)
		} catch (e) {
			console.error(e)
		}
	}
	// Completed -> Incomplete Case (And the else Case)
	return 0
}
// TODO: BUG The start time will sometimes be out of the accepted date range
//		-> Solution: If end - start > 86400 then make the start time for today in all the tasks. (Update it in calcEfficiencyList)
export const calculateEfficiencyList = (taskList, start) => {
	// 1. Figure out last complete task
	const lastComplete = findLastCompletedTask(taskList)
	const lastCompleteEta = lastComplete?.eta ? getTime(dateToToday(new Date(lastComplete.eta))) / 1000 : NaN
	const lenCompleted = taskList?.filter(task => task?.status === TASK_STATUSES.COMPLETED).length
	// 2. Figure out what task is first incomplete and assume completedTimestamp to be current moment
	const firstIncomplete = findFirstIncompleteTask(taskList)
	const { ttc, eta } = { ...firstIncomplete }
	const noCompleteTasksCase = eta ? getTime(dateToToday(parseISO(eta))) / 1000 : NaN
	const completeTasksCase = start ? getTime(dateToToday(start)) / 1000 : NaN
	const firstIncompleteStartTime = lenCompleted > 0
		? noCompleteTasksCase // If no complete tasks -> firstIncompleteStartTime is start time. Adjusted to be today to avoid date bugs.
		: completeTasksCase // If complete tasks -> firstIncompleteStartTime is eta. Adjusted to be today to avoid date bugs.
	const completedTimeStamp = getTime(new Date()) / 1000 // We assume the incomplete task is being completed at this instant
	try {
		// 3. for the first incomplete task, calculate its efficiency by: 
		const firstIncompleteTaskCalculated = lastComplete
			? calculateEfficiency(lastCompleteEta, completedTimeStamp, parseFloat(ttc) || .01)
			: calculateEfficiency(firstIncompleteStartTime, completedTimeStamp, parseFloat(ttc) || .01)
		// 4. return a copy of taskList with the first incomplete task being firstIncompleteTaskCalculated
		return taskList.map(task =>
			lodashIsEqual(task, firstIncomplete)
				? { ...task, efficiency: firstIncompleteTaskCalculated }
				: { ...task, efficiency: task.status === TASK_STATUSES.COMPLETED ? task?.efficiency : 0 } // Was undefined instead of 0
			// nested ternary here to make dnd eff% reset non-first incomplete tasks to '-' and not affect complete tasks at all
		)
	} catch (e) {
		console.error(e)
	}
}
// Takes a task list with atleast objects with an id and task
// Returns a list of options of form: [{value: id (number), label: task (string)}]
export const predecessorOptions = (taskList) => taskList?.map(task => ({ value: task?.id, label: task?.task }))