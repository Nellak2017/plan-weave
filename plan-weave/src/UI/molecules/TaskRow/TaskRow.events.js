import { millisToHours, correctEfficiencyCase } from '../../../Core/utils/helpers.js'
import { TASK_STATUSES } from '../../../Core/utils/constants.js'
import { parseISO, formatISO } from 'date-fns'

// ------ Helpers
const currentCompletedTimes = () => ({ currentTime: new Date(), completedTimeStamp: new Date().getTime() / 1000 }) // it returns { currentTime, completedTimeStamp }
const standardTaskUpdate = ({ task, localTask, localTtc, prevCompletedTask, taskObject, completedTimeStamp, localDueDate, localWeight, localDependencies, localThread }) => ({
	...task,
	task: localTask.slice(0, 50),
	ttc: parseFloat(localTtc) || .1,
	efficiency: correctEfficiencyCase(prevCompletedTask, taskObject, completedTimeStamp, parseFloat(localTtc) || .1),
	dueDate: localDueDate,
	weight: parseFloat(localWeight) || 1,
	dependencies: localDependencies,
	parentThread: localThread,
}) // Standard update for a task (what is shared in the updates for the tasks, to make it DRY)
const wasteFeature = ({ taskObject, isChecked, localTask, newETA, localTtc, prevCompletedTask, localDueDate, localWeight, localDependencies, localThread, taskRow, id, userId, index }) => {
	const { currentTime, completedTimeStamp } = currentCompletedTimes() // epoch in seconds, NOT millis
	const updatedTask = {
		...standardTaskUpdate({ task: taskObject, localTask, localTtc, prevCompletedTask, taskObject, completedTimeStamp, localDueDate, localWeight, localDependencies, localThread }), //...validateTask({ task: taskObject }),
		status: isChecked ? TASK_STATUSES.INCOMPLETE : TASK_STATUSES.COMPLETED,
		waste: millisToHours(currentTime.getTime() - newETA.getTime()), // millisToHours(currentTime.getTime() - eta.getTime())
		eta: isChecked && newETA instanceof Date ? newETA.toISOString() : currentTime.toISOString(),
		completedTimeStamp,
	}
	taskRow?.complete({ id, updatedTask, index, userId })
}
const multipleDeleteFeature = ({ isHighlighting, updateSelectedTasks, selectedTasks, index }) => {
	if (isHighlighting) {
		updateSelectedTasks((() => {
			const updatedSelection = [...selectedTasks]
			updatedSelection[index] = !updatedSelection[index]
			return updatedSelection
		})()) // we need to update what task is to be deleted in the context list
		return null // So that the task is NOT updated
	}
}

// ------ Handlers
// services = (updateSelectedTasks, taskRow), setIsChecked
// state = taskObject, prevCompletedTask, isChecked, isHighlighting, selectedTasks, index, localTask, localTtc, newETA, id, localDueDate
export const handleCheckBoxClicked = ({ services, state }) => {
	const { updateSelectedTasks, taskRow, setIsChecked } = services || {}
	const { taskObject, prevCompletedTask,
		isChecked, isHighlighting, selectedTasks, index, newETA, id,
		localTask, localTtc,
		localDueDate, localWeight, localThread, localDependencies,
		userId } = state || {}
	// Change the Checkmark first before all so we don't forget!
	setIsChecked(!isChecked) // It is placed before the redux dispatch because updating local state is faster than api
	// Multiple Deletion feature (Multi-Delete) : update tasks for multi-delete feature locally 
	if (multipleDeleteFeature({ isHighlighting, updateSelectedTasks, selectedTasks, index }) === null) return
	// Waste Feature (Task Completed) : update task with current waste, eta, efficiency, etc. when a task completes 
	wasteFeature({ taskObject, isChecked, localTask, newETA, localTtc, prevCompletedTask, localDueDate, localWeight, localDependencies, localThread, taskRow, id, userId, index })
}

// services: taskRow
// state: id, taskObject, localTask, localTtc, localDueDate
export const handleUpdateTask = ({ services, state }) => {
	const { taskRow } = services || {}
	const { id, taskObject, localTask, localTtc,
		localDueDate, localWeight, localThread, localDependencies,
		userId, prevCompletedTask } = state || {}
	const { completedTimeStamp } = currentCompletedTimes() // epoch in seconds, NOT millis
	const updatedTask = {
		...standardTaskUpdate({ task: taskObject, localTask, localTtc, prevCompletedTask, taskObject, completedTimeStamp, localDueDate, localWeight, localDependencies, localThread }),
		eta: parseISO(taskObject?.eta) && parseISO(taskObject.eta) instanceof Date
			? formatISO(parseISO(taskObject.eta).getTime() / 1000) // eta must be an ISO string
			: formatISO(new Date().getTime() / 1000),
	}
	taskRow?.update(id, updatedTask, userId)
}