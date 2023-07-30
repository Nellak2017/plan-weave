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
		<TaskRowStyled variant={variant}>
			<td><DragIndicator size={32} /></td>
			<TaskContainer>
				<td>
					{isChecked ? (
						<CheckBoxStyled size={32} onClick={handleCheckBoxClicked} />
					) : (
						<CheckBoxEmptyStyled size={32} onClick={handleCheckBoxClicked} />
					)}
				</td>
				<td><TaskInput initialValue={task} variant={variant} /></td>
			</TaskContainer>
			<TimeContainer>
				<td><HoursInput initialValue={waste} variant={variant} /></td>
				<td><HoursInput initialValue={ttc} variant={variant} /></td>
			</TimeContainer>
			<td><p>{eta ? eta : '0 hours'}</p></td>
			<td><EllipsesStyled size={32} /></td>
		</TaskRowStyled>
	)
}

export default TaskRow