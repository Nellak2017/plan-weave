import { validateTask, millisToHours, correctEfficiencyCase } from '../../utils/helpers'
import { TASK_STATUSES } from '../../utils/constants.js'
import { parseISO } from 'date-fns'

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

	// Multiple Deletion feature
	if (isHighlighting) {
		updateSelectedTasks((() => {
			const updatedSelection = [...selectedTasks]
			updatedSelection[index] = !updatedSelection[index]
			return updatedSelection
		})()) // we need to update what task is to be deleted in the context list
		return // So that the task is NOT updated
	}

	// Waste Feature 
	const currentTime = new Date()
	const completedTimeStamp = currentTime.getTime() / 1000 // epoch in seconds, NOT millis
	// efficiency = first task ? calcEff(timestamp,completedTimeStamp,localTtc) : calcEff(completedTimeStamp[n-1],completedTimeStamp,localTtc)

	const updatedTask = {
		...validateTask({ task: taskObject }),
		status: isChecked ? TASK_STATUSES.INCOMPLETE : TASK_STATUSES.COMPLETED,
		task: localTask,
		waste: millisToHours(currentTime.getTime() - newETA.getTime()), // millisToHours(currentTime.getTime() - eta.getTime())
		ttc: localTtc,
		eta: isChecked && newETA instanceof Date ? newETA.toISOString() : currentTime.toISOString(),
		completedTimeStamp,

		efficiency: correctEfficiencyCase(prevCompletedTask, taskObject, completedTimeStamp, localTtc),
		dueDate: localDueDate,
		weight: parseFloat(localWeight) || 1,
		dependencies: localDependencies,
		parentThread: localThread
	}
	taskRow?.complete(id, updatedTask, index, userId)
}

// services: taskRow
// state: id, taskObject, localTask, localTtc, localDueDate
export const handleUpdateTask = ({ services, state }) => {
	const { taskRow } = services || {}
	const { id, taskObject, localTask, localTtc,
		localDueDate, localWeight, localThread, localDependencies,
		userId, prevCompletedTask } = state || {}

	const currentTime = new Date()
	const completedTimeStamp = currentTime.getTime() / 1000 // epoch in seconds, NOT millis
	taskRow?.update(id, {
		...taskObject,
		eta: parseISO(taskObject?.eta) && parseISO(taskObject.eta) instanceof Date
			? parseISO(taskObject.eta).getTime() / 1000
			: new Date().getTime() / 1000,
		task: localTask,
		ttc: localTtc,
		efficiency: correctEfficiencyCase(prevCompletedTask, taskObject, completedTimeStamp, localTtc),
		dueDate: localDueDate,
		weight: parseFloat(localWeight) || 1,
		dependencies: localDependencies,
		parentThread: localThread
	}, userId)
}