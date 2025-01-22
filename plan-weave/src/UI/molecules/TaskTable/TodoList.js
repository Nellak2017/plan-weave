import { isTaskOld, findLastCompletedTask, filterPages } from '../../../Core/utils/helpers.js'
import TaskRow from '../TaskRow/TaskRow'
import { VARIANTS } from "../../../Core/utils/constants.js"

// --- Extracted view logic for Task Table (Covers both Simple and Full Tasks)
export const todoList = ({ services, state, taskList, startRange, endRange, timeRange, options, variant = VARIANTS[0] }) => (!taskList)
	? []
	: filterPages(startRange, endRange)(taskList)?.map((task, idx) => { // startRange, endRange is for pagination capabilities. filterPages is here because if it is in the pipe, it doesn't always update when you need it to
		try {
			return (
				<TaskRow services={services} state={state} key={`task-${task.id}`} variant={variant} taskObject={task}
					prevCompletedTask={findLastCompletedTask(taskList)} // Used for Efficiency Calculations. No need to validate again
					index={idx} old={isTaskOld(timeRange, task)} options={options} // Used for Predecessor Options
				/>
			)
		} catch (e) { return <>{e.message + '\n'}</> }
	})