import React from "react"
import { validateTask, isTaskOld, findLastCompletedTask, filterPages } from '../../utils/helpers'
import { taskSchema, fillDefaults } from "../../schemas/taskSchema/taskSchema"
import TaskRow from '../TaskRow/TaskRow'
import { VARIANTS } from "../../utils/constants"

// --- Extracted view logic for Task Table (Covers both Simple and Full Tasks)
export const todoList = ({
	services,
	state,
	taskList,
	startRange,
	endRange,
	timeRange,
	options,
	variant = VARIANTS[0]
}) => {
	if (!taskList) return []

	const lastCompletedTask = findLastCompletedTask(taskList)

	// startRange, endRange is for pagination capabilities
	// filterPages is here because if it is in the pipe, it doesn't always update when you need it to
	return filterPages(startRange, endRange)(taskList)?.map((task, idx) => {
		const isOld = isTaskOld(timeRange, task)
		try {
			const validatedFullTask = validateTask({ task, schema: taskSchema, schemaDefaultFx: fillDefaults })
			return (
				<TaskRow
					services={services}
					state={state}
					key={`task-${task.id}`}
					variant={variant}
					taskObject={validatedFullTask}
					prevCompletedTask={lastCompletedTask} // Used for Efficiency Calculations. No need to validate again
					index={idx}
					old={isOld}
					options={options} // Used for Predecessor Options
				/>
			)
		} catch (e) {
			return <>{e.message + '\n'}</>
		}

	})
}