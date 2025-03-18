import { getTime, parseISO, formatISO, format } from 'date-fns'
import { MILLISECONDS_PER_HOUR, MILLISECONDS_PER_DAY, TASK_STATUSES, MAX_SAFE_DATE, FULL_TASK_HEADERS, RENDER_NUMBERS } from './constants.js'

// calculate waste helpers
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
export const add = (start, hours) => new Date(clamp(start.getTime() + hoursToMillis(hours), 0, MAX_SAFE_DATE)) // (Date: start, hours: hours) -> Date(start + hours)
export const subtract = (time, eta) => millisToHours(time.getTime() - eta.getTime()) // (Date: time, Date: eta) -> time - eta (hours)
// --- Helpers Exported
export const between = (value, { start, end }) => start <= value && end >= value
export const isTimestampFromToday = (today, timestamp, secondsFromStart = 86400) => {
	const startOfTodaySeconds = new Date(today).setHours(0, 0, 0, 0) / 1000 // seconds since 1970 from start of day
	return (startOfTodaySeconds <= timestamp) && (timestamp <= (startOfTodaySeconds + secondsFromStart))
}
export const hoursToMillis = hours => hours * 60000 * 60
export const millisToHours = milliseconds => (milliseconds / 60000) / 60
export const isRelativelyOrdered = (list1, list2) => ((list1.length !== list2.length) || list1.length <= 1)
	? list1.length <= 1
	: list1.slice(0, -1).reduce((acc, a, i) => {
		if (!acc) return false
		const [b, c, d] = [list1[i + 1], list2[i], list2[i + 1]]
		return (a < b && c < d) || (a > b && c > d)
	}, true) // useful for pbt testing deleteDnDEvent
export const highlightTaskRow = (isHighlighting, isChecked, isOld) => {
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
// -- Most of DnD
export const ordinalSet = dnd => {
	const mapping = {}
	const uniqueSortedArr = [...new Set(dnd)].sort((a, b) => a - b)
	uniqueSortedArr.forEach((num, index) => { mapping[num] = index })
	return dnd.map(num => mapping[num])
}
export const addDnDConfig = oldDnDConfig => [0].concat(oldDnDConfig.map(x => x + 1))
export const rearrangeDnD = (dnd, source, destination) => { // You _may_ have to modify this to account for completed tasks or maybe make a helper that separates responsibilities(?)
	const both = (dnd.slice(0, source)).concat(dnd.slice(source + 1))
	return [...both.slice(0, destination), ...dnd.slice(source, source + 1), ...both.slice(destination)]
}
export const deleteDnDEvent = (dnd, index) => ordinalSet(dnd.filter((_, i) => i !== index))
export const deleteMultipleDnDEvent = (dnd, indices) => ordinalSet(dnd.filter((_, i) => !indices.includes(i)))
export const indexOfTaskToBeDeleted = (dnd, tasks, taskID) => dnd.indexOf(tasks.findIndex(task => task.id === taskID))
// -- TaskList processing
const filterTasksBySearchTerm = searchTerm => (oldTaskList) => oldTaskList.filter(task => task?.task?.trim().includes(searchTerm?.toLowerCase()?.trim()))
const sortTasksBySortAlgo = sortAlgo => (oldTaskList) => sortAlgo(oldTaskList)
const completedOnTop = (oldTaskList) => [...oldTaskList.filter(task => task?.status === TASK_STATUSES.COMPLETED), ...oldTaskList.filter(task => task?.status === TASK_STATUSES.INCOMPLETE)]
const reorderList = reordering => (oldTaskList) => oldTaskList.map((_, i) => oldTaskList[reordering[i]])
const pagination = ({ start, end }) => (oldTaskList) => oldTaskList.slice(start - 1, end)
export const pipe = (...f) => x => f.reduce((acc, fn) => fn(acc), x)
export const taskListPipe = ({ oldTaskList, dnd, filter, sortAlgo, paginationRange }) => pipe(
	filterTasksBySearchTerm(filter),
	sortTasksBySortAlgo(sortAlgo),
	reorderList(dnd),
	completedOnTop,
	pagination(paginationRange),
)(oldTaskList)
// -- Read-only TaskRow fields
// TODO: See if you can simplify by making the timestamps just ISO strings?
// TODO: Be sure to test these functions, something is fishy with calculate Waste and calculate Live Time
const firstIndex = (lis, pred) => lis?.findIndex(val => pred(val))
const lastIndex = (lis, pred) => lis?.findLastIndex(val => pred(val))
export const firstCompleteIndex = properlyOrderedTaskList => firstIndex(properlyOrderedTaskList, task => task?.status === TASK_STATUSES.COMPLETED)
export const lastCompleteIndex = properlyOrderedTaskList => lastIndex(properlyOrderedTaskList, task => task?.status === TASK_STATUSES.COMPLETED) 
const firstIncompleteIndex = properlyOrderedTaskList => firstIndex(properlyOrderedTaskList, task => task?.status !== TASK_STATUSES.COMPLETED)
const isValidDate = date => (date !== "Invalid Date") && !isNaN(new Date(date))
const epochToMillis = epoch => epoch * 1000
export const calculateLiveTime = (currentTaskRow, taskOrderPipeOptions, currentTime) => {
	const { id: taskID, liveTime: oldLiveTime, timestamp, status } = currentTaskRow || {}
	const properlyOrderedTaskList = taskListPipe(taskOrderPipeOptions)
	const firstIncompleteIdx = firstIncompleteIndex(properlyOrderedTaskList)
	const currentTaskIndex = firstIndex(properlyOrderedTaskList, task => task?.id === taskID)
	const lastCompletedTimeStamp = properlyOrderedTaskList?.[firstIncompleteIdx - 1]?.completedTimeStamp

	const base = isValidDate(currentTime) ? currentTime : new Date()// add(currentTime, oldLiveTime)
	const prev = new Date(firstIncompleteIdx === 0 ? epochToMillis(timestamp) : epochToMillis(lastCompletedTimeStamp))
	if (status === TASK_STATUSES.COMPLETED || currentTaskIndex !== firstIncompleteIdx) return oldLiveTime
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

	const base = isValidDate(currentTime) ? currentTime : new Date()
	const prev = properlyOrderedTaskList
		.slice(0, currentTaskIndex)
		.reduce((acc, task) => add(acc, Math.max(task?.ttc, task?.liveTime)), base)
	const adjustedTtc = Math.max(ttc, processedOldLiveTime)

	const firstIncompleteSum = add(base, adjustedTtc - processedOldLiveTime), otherIncompleteSum = add(prev, adjustedTtc)
	const processedFirstIncompleteSum = isValidDate(firstIncompleteSum) ? firstIncompleteSum : new Date()
	const processedOtherIncompleteSum = isValidDate(otherIncompleteSum) ? otherIncompleteSum : new Date()

	return currentTaskIndex === firstIncompleteIndex
		? formatISO(processedFirstIncompleteSum) // current time + (max(ttc, live time) - live time)
		: formatISO(processedOtherIncompleteSum) // prev + max(ttc, live time) 
}

// TODO: Write the correct efficiency function
export const calculateEfficiency = (currentTaskRow, taskOrderPipeOptions, currentTime) => {
	return currentTaskRow?.ttc / (calculateLiveTime(currentTaskRow, taskOrderPipeOptions, currentTime) + calculateWaste(currentTaskRow, taskOrderPipeOptions, currentTime))
}
// -- HoursInput Component helpers
export const isInRangeInclusive = (value, min, max) => value >= min && value <= max
export const parseBlur = ({ value, min, max, precision }) => !isNaN(parseFloat(value)) ? (clamp(parseFloat(value), min, max)).toFixed(precision) : min
export const parseChange = ({ value, pattern, min, max }) => (pattern.test(value.trim())) && (isInRangeInclusive(parseFloat(value), min, max) || /^[^.]*\.[^.]*$/.test(value)) ? value.trim() : ''
// -- Format helpers
const findTimeLeft = hours => ({ timeLeftInHours: Math.floor(hours), timeLeftInMinutes: Math.floor((hours - Math.floor(hours)) * 60) })
const timeFormat = ({ timeLeftInMinutes, timeLeftInHours }, { minuteText = 'minutes', hourText = 'hours' }) => {
	if (timeLeftInHours <= 0) return `${timeLeftInMinutes} ${minuteText}`
	if (timeLeftInMinutes <= 0) return `${timeLeftInHours} ${hourText}`
	return `${timeLeftInHours} hour${timeLeftInHours > 1 ? 's' : ''} ${timeLeftInMinutes} ${minuteText}`
}
// -- TaskRow Slots helpers
export const formatTTC = ttc => (!ttc || isNaN(ttc)) ? '0 minutes' : timeFormat(findTimeLeft(ttc), { minuteText: 'minutes', hourText: 'hours' })
export const formatDate = localDueDate => localDueDate ? format(parseISO(localDueDate), 'MMM-d-yyyy @ h:mm a') : "invalid"
export const formatWaste = waste => waste < 0 ? `-${formatTTC(waste)}` : formatTTC(waste)
export const formatEta = eta => eta && typeof eta === 'string' && !isNaN(parseISO(eta).getTime()) ? format(parseISO(eta), "HH:mm") : '00:00'
export const formatEfficiency = efficiency => !efficiency || efficiency <= 0 ? '-' : `${(parseFloat(efficiency) * 100).toFixed(0)}%`
export const getTaskRowDnDStyle = provided => ({ ...provided?.draggableProps?.style, boxShadow: provided?.isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none' })
export const processThreadOptions = (oldOptions, newThread) => Array.from(new Set([...oldOptions, newThread])).filter(option => option.trim() !== '')
export const getAvailableThreads = tasks => [...Array.from(new Set(tasks.map(task => task?.parentThread))).filter(option => option.trim() !== '')]
// -- TaskControl helpers
export const formatTaskControlTimeLeft = ({ currentTime, endTime, overNightMode, }) => timeFormat(findTimeLeft((Math.max(0, (overNightMode ? getTime(new Date(endTime)) + MILLISECONDS_PER_DAY : getTime(endTime)) - currentTime.getTime()) / MILLISECONDS_PER_HOUR)), { minuteText: 'minutes left', hourText: 'hours left' })