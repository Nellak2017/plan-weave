import React, { useState } from 'react'
import {
	TaskRowStyled,
	DragIndicator,
	CheckBoxEmptyStyled,
	CheckBoxStyled,
	EllipsesStyled,
	TaskContainer,
	TimeContainer
} from './TaskRow.elements.js'
import TaskInput from '../../atoms/TaskInput/TaskInput.js'
import HoursInput from '../../atoms/HoursInput/HoursInput.js'

function TaskRow({ variant, task, waste, ttc, eta = '0 hours' }) {
	const [isChecked, setIsChecked] = useState(false)
	const handleCheckBoxClicked = () => setIsChecked(!isChecked)
	return (
		<tbody>
			<TaskRowStyled variant={variant}>
				<td><DragIndicator size={32} /></td>
				<TaskContainer>
					{isChecked ? (
						<CheckBoxStyled size={32} onClick={handleCheckBoxClicked} />
					) : (
						<CheckBoxEmptyStyled size={32} onClick={handleCheckBoxClicked} />
					)}
				</TaskContainer>
				<TaskContainer>
					<TaskInput initialValue={task} variant={variant} />
				</TaskContainer>
				<TimeContainer>
					<p>{waste}</p>
				</TimeContainer>
				<TimeContainer>
					<HoursInput initialValue={ttc} variant={variant} />
				</TimeContainer>
				<TimeContainer>
					<p>{eta ? eta : '0 hours'}</p>
				</TimeContainer>
				<td>
					<EllipsesStyled size={32} />
				</td>
			</TaskRowStyled>
		</tbody>
	)
}

export default TaskRow