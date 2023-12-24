import { validateTask, millisToHours } from '../../utils/helpers'
import { TASK_STATUSES } from '../../utils/constants.js'
import { parseISO } from 'date-fns'

export const handleCheckBoxClicked = ({ services, taskObject, setIsChecked, isChecked, isHighlighting, selectedTasks, index, localTask, localTtc, newETA, id }) => {
	const { updateSelectedTasks, taskRow } = services
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
	const updatedTask = {
		...validateTask({ task: taskObject }),
		status: isChecked ? TASK_STATUSES.INCOMPLETE : TASK_STATUSES.COMPLETED,
		task: localTask,
		waste: millisToHours(currentTime.getTime() - newETA.getTime()), // millisToHours(currentTime.getTime() - eta.getTime())
		ttc: localTtc,
		eta: isChecked && newETA instanceof Date ? newETA.toISOString() : currentTime.toISOString(), 
		completedTimeStamp: currentTime.getTime() / 1000 // epoch in seconds, NOT millis
	}
	taskRow?.complete(id, updatedTask, index)
}

export const handleUpdateTask = ({ taskRow, id, taskObject, localTask, localTtc }) => {
	taskRow?.update(id, {
		...taskObject,
		eta: parseISO(taskObject?.eta) && parseISO(taskObject.eta) instanceof Date
			? parseISO(taskObject.eta).getTime() / 1000
			: new Date().getTime() / 1000,
		task: localTask,
		ttc: localTtc
	})
}