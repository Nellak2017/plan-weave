import { getTime, parseISO, formatISO } from 'date-fns'
import { MILLISECONDS_PER_HOUR, MILLISECONDS_PER_DAY, TASK_STATUSES, MAX_SAFE_DATE, FULL_TASK_HEADERS, RENDER_NUMBERS } from './constants.js'

// calculate waste helpers
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
export const add = (start, hours) => new Date(clamp(start.getTime() + hoursToMillis(hours), 0, MAX_SAFE_DATE)) // (Date: start, hours: hours) -> Date(start + hours)
export const subtract = (time, eta) => millisToHours(time.getTime() - eta.getTime()) // (Date: time, Date: eta) -> time - eta (hours)
// --- Helpers Exported
export const formatTimeLeft = ({ minuteText = 'minutes left', hourText = 'hour', hourText2 = 'hours left', overNightMode = false, currentTime = new Date(), endTime, timeDifference = 0, isNegative = false }) => {
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
	return isNegative
		? `-${formatTime(calculateTimeDifference({ endTime, currentTime, timeDifference, overNightMode }))}`
		: formatTime(calculateTimeDifference({ endTime, currentTime, timeDifference, overNightMode }))
}
export const isTimestampFromToday = (today, timestamp, secondsFromStart = 86400) => {
	const startOfTodaySeconds = new Date(today).setHours(0, 0, 0, 0) / 1000 // seconds since 1970 from start of day
	return (startOfTodaySeconds <= timestamp) && (timestamp <= (startOfTodaySeconds + secondsFromStart))
}
export const hoursToSeconds = hours => hours * 60 * 60
export const hoursToMillis = hours => hours * 60000 * 60
export const millisToHours = milliseconds => (milliseconds / 60000) / 60
export const isInt = number => ((!!number || number === 0) && typeof number === 'number' && Math.floor(number) === number && isFinite(number))
export const isRelativelyOrdered = (list1, list2) => ((list1.length !== list2.length) || list1.length <= 1)
	? list1.length <= 1
	: list1.slice(0, -1).reduce((acc, a, i) => {
		if (!acc) return false
		const [b, c, d] = [list1[i + 1], list2[i], list2[i + 1]]
		return (a < b && c < d) || (a > b && c > d)
	}, true)
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
export const dateToToday = start => {
	const now = new Date(Date.now()), newStart = parseISO(start)
	const initOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf()
	const initOfStart = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate()).valueOf()
	return new Date(initOfToday + (newStart.valueOf() - initOfStart)).toISOString()
}
export const endPlusOne = oldISO => new Date(dateToToday(parseISO(oldISO)).getTime() + hoursToMillis(24)).toISOString()
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
export const tryCatchSyncFlat = (fn, errFn) => { try { return fn() } catch (e) { return errFn(e) } }
export const tryCatchAsyncFlat = async (fn, errFn) => { try { const ret = await fn(); return ret } catch (e) { return errFn(e) } }
export const calcMaxPage = (listLen, perPage) => Math.ceil(listLen / perPage) || 1
export const getHeaderLabels = isFullTask => FULL_TASK_HEADERS.slice(0, isFullTask ? FULL_TASK_HEADERS.length : 4)
export const isStatusChecked = status => status === TASK_STATUSES.COMPLETED
export const toggleTaskStatus = status => isStatusChecked(status) ? TASK_STATUSES.INCOMPLETE : TASK_STATUSES.COMPLETED
export const getTaskRenderNumber = isFullTask => isFullTask ? RENDER_NUMBERS.FULL_TASK : RENDER_NUMBERS.SIMPLE_TASK
// -- DnD
export const ordinalSet = dnd => {
	const mapping = {}
	const uniqueSortedArr = [...new Set(dnd)].sort((a, b) => a - b)
	uniqueSortedArr.forEach((num, index) => { mapping[num] = index })
	return dnd.map(num => mapping[num])
}
export const addDnDConfig = oldDnDConfig => [0].concat(oldDnDConfig.map(x => x + 1)) // TODO: Test this
export const rearrangeDnD = (dnd, source, destination) => {
	const both = (dnd.slice(0, source)).concat(dnd.slice(source + 1))
	return [...both.slice(0, destination), ...dnd.slice(source, source + 1), ...both.slice(destination)]
}
export const deleteDnDEvent = (dnd, indexRange) => ordinalSet(dnd.filter((_, i) => i < indexRange.startIndex || i > indexRange.endIndex))
export const reorderList = (tasks, reordering) => tasks.map((_, i) => tasks[reordering[i]])
// -- TaskList processing
export const pipe = (...f) => x => f.reduce((acc, fn) => fn(acc), x)
export const taskListPipe = ({ oldTaskList, dnd }) => { // TODO: pipe this properly
	// Note: I think this should be the ordering part of the pipe. The values should be calculated separately (?) 
	const dndApp = reorderList(oldTaskList, dnd) // 1. Apply DnD
	return dndApp
}
// -- Read-only TaskRow fields
// TODO: See if you can simplify by making the timestamps just ISO strings?
// TODO: Be sure to test these functions, something is fishy with calculate Waste and calculate Live Time
const epochToMillis = epoch => epoch * 1000
export const calculateLiveTime = (currentTaskRow, taskOrderPipeOptions, currentTime) => {
	const { id: taskID, liveTime: oldLiveTime, timestamp, status } = currentTaskRow || {}
	const properlyOrderedTaskList = taskListPipe(taskOrderPipeOptions)
	const firstIncompleteIndex = properlyOrderedTaskList?.findIndex(task => task?.status !== TASK_STATUSES.COMPLETED)
	const currentTaskIndex = properlyOrderedTaskList?.findIndex(task => task?.id === taskID)
	const lastCompletedTimeStamp = properlyOrderedTaskList?.[firstIncompleteIndex - 1]?.completedTimeStamp

	const base = currentTime // add(currentTime, oldLiveTime)
	const prev = new Date(firstIncompleteIndex === 0 ? epochToMillis(timestamp) : epochToMillis(lastCompletedTimeStamp))
	if (status === TASK_STATUSES.COMPLETED || currentTaskIndex !== firstIncompleteIndex) return oldLiveTime
	else return subtract(base, prev)
}
export const calculateWaste = (currentTaskRow, taskOrderPipeOptions, currentTime) => {
	const { status, waste } = currentTaskRow || {}
	if (status === TASK_STATUSES.COMPLETED) return waste
	else return calculateLiveTime(currentTaskRow, taskOrderPipeOptions, currentTime) - currentTaskRow?.ttc
}
export const calculateEta = (currentTaskRow, taskOrderPipeOptions, currentTime) => {
	const { id: taskID, ttc, liveTime: oldLiveTime } = currentTaskRow || {}

	const processedOldLiveTime = oldLiveTime || 0 // Must be done since some people won't have this update

	const properlyOrderedTaskList = taskListPipe(taskOrderPipeOptions)
	const firstIncompleteIndex = properlyOrderedTaskList?.findIndex(task => task?.status !== TASK_STATUSES.COMPLETED)
	const currentTaskIndex = properlyOrderedTaskList?.findIndex(task => task?.id === taskID)

	const prev = properlyOrderedTaskList
		.slice(0, currentTaskIndex)
		.reduce((acc, task) => add(acc, Math.max(task?.ttc, task?.liveTime)), currentTime)
	const adjustedTtc = Math.max(ttc, processedOldLiveTime)

	return currentTaskIndex === firstIncompleteIndex
		? formatISO(add(currentTime, adjustedTtc - processedOldLiveTime)) // current time + (max(ttc, live time) - live time)
		: formatISO(add(prev, adjustedTtc)) // prev + max(ttc, live time) 
}

// TODO: Write the correct efficiency function
export const calculateEfficiency = (currentTaskRow, taskOrderPipeOptions, currentTime) => {
	return currentTaskRow?.ttc / (calculateLiveTime(currentTaskRow, taskOrderPipeOptions, currentTime) + calculateWaste(currentTaskRow, taskOrderPipeOptions, currentTime))
}