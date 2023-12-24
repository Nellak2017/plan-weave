import React from "react"
import { parseISO } from 'date-fns'
import { isTimestampFromToday } from '../../utils/helpers'
import TaskRow from '../TaskRow/TaskRow'
import { GiConsoleController } from "react-icons/gi"

// --- Extracted view logic for Task Table
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
		//const highlightOld = isTimestampFromToday(start, epochETA, epochTotal) ? ' ' : 'old'
		const isOld = !isTimestampFromToday(start, epochETA, epochTotal)
		
		return <TaskRow
			services={services}
			state={state}
			key={`task-${task.id}`}
			variant={variant}
			taskObject={{
				task: task.task,
				waste: task.waste,
				ttc: task.ttc,
				eta: task.eta,
				id: task.id,
				status: task.status,
				timestamp: task.timestamp,
			}}
			index={idx}
			//highlight={highlightOld}
			old={isOld}
		/>
	})
}