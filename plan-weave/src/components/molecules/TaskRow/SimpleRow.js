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
			<TaskContainer title={taskTooltip}>
				{status === TASK_STATUSES.COMPLETED ?
					<p>{task}</p>
					: <TaskInput onChange={e => setLocalTask(e.target.value)} value={localTask} variant={variant} />
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
						onValueChange={value => setLocalTtc(parseFloat(value))}
						value={localTtc}
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

export default SimpleRow