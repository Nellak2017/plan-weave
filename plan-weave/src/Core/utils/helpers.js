import { getTime, parseISO, format } from 'date-fns'
import { MILLISECONDS_PER_HOUR, MILLISECONDS_PER_DAY, TASK_STATUSES, MAX_SAFE_DATE, FULL_TASK_HEADERS, RENDER_NUMBERS, EFFICIENCY_RANGE } from './constants.js'

// TODO: Modularize the helpers.js by breaking them down by respective Entity and PBT helpers and only have shared/global ones in here

// calculate waste helpers
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
export const add = (start, hours) => new Date(clamp(start.getTime() + hoursToMillis(hours), 0, MAX_SAFE_DATE)) // (Date: start, hours: hours) -> Date(start + hours)
export const subtract = (time, eta) => millisToHours(time.getTime() - eta.getTime()) // (Date: time, Date: eta) -> time - eta (hours)
// --- Uncategorized
export const between = (value, { start, end }) => start <= value && value <= end
export const greaterThan = (value, end) => value > end
// --- Helpers Exported
export const isTimestampFromToday = (today, timestamp, secondsFromStart = 86400) => {
	const startOfTodaySeconds = new Date(today).setHours(0, 0, 0, 0) / 1000 // seconds since 1970 from start of day
	return between(timestamp, { start: startOfTodaySeconds, end: startOfTodaySeconds + secondsFromStart })
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
const isoToMillis = isoDateString => new Date(isoDateString).getTime()
export const isTaskOld = ({ eta, end }) => greaterThan(isoToMillis(eta), isoToMillis(end)) // (iso, iso) => bool
export const tryCatchSyncFlat = (fn, errFn) => { try { return fn() } catch (e) { return errFn(e) } }
export const tryCatchAsyncFlat = async (fn, errFn) => { try { return await fn() } catch (e) { return errFn(e) } }
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
export const isOrdinalSet = arr => JSON.stringify(ordinalSet(arr)) === JSON.stringify(arr) // used for pbt properties
export const addDnDConfig = oldDnDConfig => [0].concat(oldDnDConfig.map(x => x + 1))
export const rearrangeDnD = (dnd, source, destination) => { // You _may_ have to modify this to account for completed tasks or maybe make a helper that separates responsibilities(?)
	const both = (dnd.slice(0, source)).concat(dnd.slice(source + 1))
	return [...both.slice(0, destination), ...dnd.slice(source, source + 1), ...both.slice(destination)]
}
export const deleteDnDEvent = (dnd, index) => ordinalSet(dnd.filter((_, i) => i !== index))
export const deleteMultipleDnDEvent = (dnd, indices) => ordinalSet(dnd.filter((_, i) => !indices.includes(i)))
export const indexOfTaskToBeDeleted = (dnd, tasks, taskID) => dnd.indexOf(tasks.findIndex(task => task.id === taskID))
// -- TaskList processing
// TODO: Example / PBT these individual functions. I had a bug with my filter tasks by search term algorithm in v1.0.0
const filterTasksBySearchTerm = searchTerm => (oldTaskList) => oldTaskList.filter(task => task?.task?.toLowerCase().trim().includes(searchTerm?.toLowerCase()?.trim()))
const sortTasksBySortAlgo = sortAlgo => (oldTaskList) => sortAlgo(oldTaskList)
const completedOnTop = (oldTaskList) => [...oldTaskList.filter(task => task?.status === TASK_STATUSES.COMPLETED), ...oldTaskList.filter(task => task?.status !== TASK_STATUSES.COMPLETED)]
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
const firstIndex = (lis, pred) => lis?.findIndex(val => pred(val))
const lastIndex = (lis, pred) => lis?.findLastIndex(val => pred(val))
// TODO: cacade delete: firstInded, lastIndex, firstCompleteIndex, lastCompleteIndex, firstIncompleteIndex (They are not needed in the Stopwatch model, most likely)
export const firstCompleteIndex = properlyOrderedTaskList => firstIndex(properlyOrderedTaskList, task => task?.status === TASK_STATUSES.COMPLETED)
export const lastCompleteIndex = properlyOrderedTaskList => lastIndex(properlyOrderedTaskList, task => task?.status === TASK_STATUSES.COMPLETED)
export const firstIncompleteIndex = properlyOrderedTaskList => firstIndex(properlyOrderedTaskList, task => task?.status === TASK_STATUSES.INCOMPLETE)
const isValidDate = date => (date !== "Invalid Date") && !isNaN(new Date(date))
// -- compute helpers for the live time, waste, efficiency, and eta functions
export const computeUpdatedLiveTime = ({ oldLiveTime, liveTimeStamp, currentTime }) => oldLiveTime + subtract(isValidDate(currentTime) ? currentTime : new Date(), new Date(liveTimeStamp))
export const computeUpdatedWaste = ({ liveTime, ttc }) => liveTime - ttc
export const computeUpdatedEfficiency = ({ liveTime, ttc }) => clamp(ttc / liveTime, EFFICIENCY_RANGE.min, EFFICIENCY_RANGE.max)
export const calculateEta = ({ liveTime, ttc, dependencyEtasMillis }) => new Date(Math.max(...dependencyEtasMillis) + hoursToMillis(Math.max((ttc - liveTime), 0))).toISOString()
export const computeDisplayedEta = ({ liveTime, ttc, dependencyEtasMillis, status, eta }) => status === TASK_STATUSES.COMPLETED ? eta : calculateEta({ liveTime, ttc, dependencyEtasMillis })
// -- HoursInput Component helpers
export const parseBlur = ({ value, min, max, precision }) => isNaN(parseFloat(value)) ? min : (clamp(parseFloat(value), min, max)).toFixed(precision)
export const parseChange = ({ value, pattern, min, max }) => (pattern.test(value.trim())) && (between(parseFloat(value), { start: min, end: max }) || /^[^.]*\.[^.]*$/.test(value)) ? value.trim() : ''
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
export const formatWaste = waste => waste < 0 ? `-${formatTTC(-waste)}` : formatTTC(waste)
export const formatEta = eta => eta && typeof eta === 'string' && !isNaN(parseISO(eta).getTime()) ? format(parseISO(eta), "HH:mm") : '00:00'
export const formatEfficiency = efficiency => !efficiency || efficiency <= 0 ? '-' : `${(parseFloat(efficiency) * 100).toFixed(0)}%`
export const getTaskRowDnDStyle = provided => ({ ...provided?.draggableProps?.style, boxShadow: provided?.isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none' })
export const processThreadOptions = (oldOptions, newThread) => Array.from(new Set([...oldOptions, newThread])).filter(option => option.trim() !== '')
export const getAvailableThreads = tasks => [...Array.from(new Set(tasks.map(task => task?.parentThread?.trim()))).filter(option => option.trim() !== '')]
// -- TaskControl helpers
export const formatTaskControlTimeLeft = ({ currentTime, endTime, overNightMode, }) => timeFormat(findTimeLeft((Math.max(0, (overNightMode ? getTime(new Date(endTime)) + MILLISECONDS_PER_DAY : getTime(endTime)) - currentTime.getTime()) / MILLISECONDS_PER_HOUR)), { minuteText: 'minutes left', hourText: 'hours left' })
// -- Task Reducer helpers
export const getInsertionIndex = ({ tasksPerPage, pageNumber, taskList }) => {
	const startIndex = (pageNumber - 1) * tasksPerPage
	const endIndex = startIndex + tasksPerPage
	if (taskList.length <= startIndex) { return taskList.length }
	return taskList.slice(startIndex, endIndex).length === tasksPerPage ? endIndex - 1 : taskList.length
}
export const insertTaskAtIndex = ({ taskList, insertLocation, addedTask }) => [...taskList.slice(0, insertLocation), addedTask, ...taskList.slice(insertLocation)]