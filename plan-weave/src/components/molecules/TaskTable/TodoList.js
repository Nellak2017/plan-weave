import React from "react"
import { validateTask, isTaskOld } from '../../utils/helpers'
import { taskSchema, fillDefaults } from "../../schemas/taskSchema/taskSchema"
import TaskRow from '../TaskRow/TaskRow'

// --- Extracted view logic for Task Table (Covers both Simple and Full Tasks)
export const todoList = (services, state, taskList, startRange, endRange, timeRange, variant = 'dark') => {
	if (!taskList) return []

	// startRange, endRange is for pagination capabilities
	return taskList?.slice(startRange - 1, endRange)?.map((task, idx) => {
		const isOld = isTaskOld(timeRange, task)
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