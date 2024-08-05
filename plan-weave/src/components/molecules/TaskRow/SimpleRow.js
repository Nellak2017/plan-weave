/* eslint-disable complexity */
import React, {useEffect} from "react"
import { TASK_STATUSES, TASK_ROW_TOOLTIPS } from "../../utils/constants"
import TaskInput from '../../atoms/TaskInput/TaskInput.js'
import HoursInput from '../../atoms/HoursInput/HoursInput.js'
import {
	MdOutlineCheckBoxOutlineBlank,
	MdOutlineCheckBox
} from 'react-icons/md'
import {
	DragIndicator,
	TaskContainer,
	WasteContainer,
	TimeContainer,
	IconContainer,
	DragContainer, // last in row
} from './TaskRow.elements.js'
import { formatTimeLeft } from '../../utils/helpers.js'
import { format, parseISO } from 'date-fns'
import PropTypes from 'prop-types'

// Task View Logic (Simple, Full) (Just Simple for now)
const SimpleRow = ({
	services,
	state,
	variant,
	provided,
}) => {
	const { setLocalTask, setLocalTtc, handleCheckBoxClicked } = services
	const { taskObject, isChecked, localTask, localTtc } = state

	const { task, waste, ttc, eta, status, index } = { ...taskObject }
	const { dnd: dndTooltip, completed: completedTooltip, incomplete: incompleteTooltip, task: taskTooltip,
		waste: wasteTooltip, ttc: ttcTooltip, eta: etaTooltip } = TASK_ROW_TOOLTIPS

	const iconSize = 36

	useEffect(() => console.log(taskObject), [])
	return (
		<>
			<DragContainer title={dndTooltip} {...provided?.dragHandleProps ?? ''}>
				<DragIndicator size={iconSize} />
			</DragContainer>
			<IconContainer title={isChecked ? completedTooltip : incompleteTooltip}>
				{isChecked
					? (<MdOutlineCheckBox size={iconSize} onClick={handleCheckBoxClicked} />)
					: (<MdOutlineCheckBoxOutlineBlank size={iconSize} onClick={handleCheckBoxClicked} />)
				}
			</IconContainer>
			<TaskContainer aria-label={taskTooltip} title={taskTooltip}>
				{status === TASK_STATUSES.COMPLETED ?
					<p>{task}</p>
					: <TaskInput maxLength="50" onChange={e => setLocalTask(e.target.value)} value={localTask} variant={variant} />
				}
			</TaskContainer>
			<WasteContainer title={wasteTooltip} style={{ width: '200px' }}>
				<p>
					{(() => {
						// This function displays the waste for the positive, 0, and negative cases
						if (waste && !isNaN(waste) && waste > 0) {
							return formatTimeLeft({
								timeDifference: waste,
								minuteText: 'minutes',
								hourText: 'hour',
								hourText2: 'hours'
							})
						} else if (waste && !isNaN(waste) && waste < 0) {
							return `-${formatTimeLeft({
								timeDifference: -waste,
								minuteText: 'minutes',
								hourText: 'hour',
								hourText2: 'hours'
							})}`
						} else {
							return '0 minutes'
						}
					})()
					}
				</p>
			</WasteContainer>
			<TimeContainer title={ttcTooltip}>
				{status === TASK_STATUSES.COMPLETED ?
					<pre>{ttc && !isNaN(ttc) && ttc > 0 ?
						formatTimeLeft({
							timeDifference: ttc,
							minuteText: 'minutes',
							hourText: 'hour',
							hourText2: 'hours'
						}) :
						'0 minutes'}</pre>
					: <HoursInput
						onValueChange={value => setLocalTtc(value)}
						onBlur={() => setLocalTtc(localTtc)} 
						controlledValue={localTtc}
						initialValue={localTtc && localTtc > .01 ? localTtc : 1}
						variant={variant}
						placeholder='hours'
						text='hours'
					/>
				}
			</TimeContainer>
			<TimeContainer title={etaTooltip}>
				<p aria-label={`eta for task ${index}`}>
					{eta && typeof eta === 'string' && !isNaN(parseISO(eta).getTime())
						? format(parseISO(eta), "HH:mm")
						: '00:00'
					}
				</p>
			</TimeContainer>
		</>)
}

SimpleRow.propTypes = {
	services: PropTypes.shape({
		setLocalTask: PropTypes.func.isRequired,
		setLocalTtc: PropTypes.func.isRequired,
		handleCheckBoxClicked: PropTypes.func.isRequired,
	}).isRequired,
	state: PropTypes.shape({
		taskObject: PropTypes.shape({
			task: PropTypes.string.isRequired,
			waste: PropTypes.number.isRequired,
			ttc: PropTypes.number.isRequired,
			eta: PropTypes.string.isRequired,
			status: PropTypes.string.isRequired,
			index: PropTypes.number.isRequired,
		}).isRequired,
		isChecked: PropTypes.bool.isRequired,
		localTask: PropTypes.string.isRequired,
		localTtc: PropTypes.oneOfType([
			PropTypes.string.isRequired,
			PropTypes.number.isRequired,
		]), // To account for '', '*.*' cases when typing
	}).isRequired,
	variant: PropTypes.string.isRequired,
	provided: PropTypes.object,
}

export default SimpleRow