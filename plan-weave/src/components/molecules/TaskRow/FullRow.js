import React from 'react'
import { TASK_ROW_TOOLTIPS } from "../../utils/constants"
import SimpleRow from './SimpleRow.js'
import { DueContainer, WeightContainer, ThreadContainer } from './TaskRow.elements.js'
import HoursInput from '../../atoms/HoursInput/HoursInput.js'
import { parseISO, format } from 'date-fns'

function FullRow({
	simpleTaskProps
}) {
	const {
		provided,
		taskObject,
		variant,
		isChecked,
		setLocalTask,
		localTask,
		localTtc,
		setLocalTtc,
		handleCheckBoxClicked,
		handleDeleteTask
	} = simpleTaskProps
	const { dueDate } = taskObject
	return (
		<>
			<SimpleRow
				provided={provided}
				taskObject={taskObject}
				variant={variant}
				isChecked={isChecked}
				setLocalTask={setLocalTask}
				localTask={localTask}
				localTtc={localTtc}
				setLocalTtc={setLocalTtc}
				handleCheckBoxClicked={handleCheckBoxClicked}
				handleDeleteTask={handleDeleteTask}
				tooltips={TASK_ROW_TOOLTIPS}
			/>
			<DueContainer>
				{
				 dueDate ? format(parseISO(dueDate), 'd-MMM @ HH:mm') : "invalid"
				 //<button onClick={() => console.log(taskObject)}>localTask</button>
				 // TODO: Get a Date-time picker and implement it here
				}
			</DueContainer>
			<WeightContainer>
				<HoursInput />
			</WeightContainer>
			<ThreadContainer>
				thread
			</ThreadContainer>
		</>
	)
}

export default FullRow