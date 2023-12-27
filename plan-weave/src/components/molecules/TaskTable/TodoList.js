import React from "react"
import { parseISO } from 'date-fns'
import { isTimestampFromToday, validateTask } from '../../utils/helpers'
import { taskSchema, fillDefaults } from "../../schemas/taskSchema/taskSchema"
import TaskRow from '../TaskRow/TaskRow'

// TODO: Refactor this into smaller helpers to reduce code noise
// --- Extracted view logic for Task Table (Covers both Simple and Full Tasks)
export const todoList = (services, state, taskList, startRange, endRange, timeRange, variant = 'dark') => {
	if (!taskList) return []

	const { start, end } = { ...timeRange }
		? { start: parseISO(timeRange?.start), end: parseISO(timeRange?.end) }
		: { 0: new Date(new Date().setHours(0, 0, 0, 0)), 1: new Date(new Date().setHours(24, 59, 59, 59)) }

	const epochDiff = (end - start) / 1000 // seconds between end and start
	const epochTimeSinceStart = (start.getTime() - new Date(start).setHours(0, 0, 0, 0)) / 1000 // seconds between 00:00 and start
	const epochTotal = epochDiff >= 0 ? epochDiff + epochTimeSinceStart : epochTimeSinceStart // seconds in our modified day. If negative, then default to full day

	// startRange, endRange is for pagination capabilities
	return taskList?.slice(startRange - 1, endRange)?.map((task, idx) => {
		const epochETA = parseISO(task?.eta)?.getTime() / 1000
		const isOld = !isTimestampFromToday(start, epochETA, epochTotal)
		const validatedFullTasks = validateTask({ task, schema: taskSchema, schemaDefaultFx: fillDefaults })

		return <TaskRow
			services={services}
			state={state}
			key={`task-${task.id}`}
			variant={variant}
			taskObject={validatedFullTasks}
			index={idx}
			old={isOld}
		/>
	})
}