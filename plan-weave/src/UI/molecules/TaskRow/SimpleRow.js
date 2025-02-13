import { TASK_STATUSES, TASK_ROW_TOOLTIPS } from "../../../Core/utils/constants.js"
import { TaskInput } from '../../atoms/TaskInput/TaskInput.js'
import HoursInput from '../../atoms/HoursInput/HoursInput.js'
import { MdOutlineCheckBoxOutlineBlank, MdOutlineCheckBox } from 'react-icons/md'
import { DragIndicator, TaskContainer, WasteContainer, TimeContainer, IconContainer, DragContainer, } from './TaskRow.elements.js'
import { formatTimeLeft } from '../../../Core/utils/helpers.js'
import { format, parseISO } from 'date-fns'

export const displayTimeLeft = waste => {
	if (waste && !isNaN(waste) && waste !== 0) {
		return waste > 0
			? formatTimeLeft({ timeDifference: waste, minuteText: 'minutes', hourText: 'hour', hourText2: 'hours' })
			: `-${formatTimeLeft({ timeDifference: -waste, minuteText: 'minutes', hourText: 'hour', hourText2: 'hours' })}`
	} else { return '0 minutes' }
}

export const SimpleRow = ({ services, state, variant, provided, }) => { // Task View Logic (Simple, Full) (Just Simple for now)
	const { setLocalTask, setLocalTtc, handleCheckBoxClicked } = services
	const { taskObject, isChecked, localTask, localTtc } = state
	const { task, waste, ttc, eta, status, index } = { ...taskObject }
	const { dndTooltip, completedTooltip, incompleteTooltip, taskTooltip, wasteTooltip, ttcTooltip, etaTooltip } = TASK_ROW_TOOLTIPS
	const iconSize = 36
	return (
		<>
			<DragContainer title={dndTooltip} {...provided?.dragHandleProps ?? ''}><DragIndicator size={iconSize} /></DragContainer>
			<IconContainer title={isChecked ? completedTooltip : incompleteTooltip}>
				{isChecked ? <MdOutlineCheckBox size={iconSize} onClick={handleCheckBoxClicked} /> : <MdOutlineCheckBoxOutlineBlank size={iconSize} onClick={handleCheckBoxClicked} />}
			</IconContainer>
			<TaskContainer aria-label={taskTooltip} title={taskTooltip}>
				{status === TASK_STATUSES.COMPLETED
					? <p>{task}</p>
					: <TaskInput
						maxLength='50'
						defaultValue={localTask}
						onBlur={e => { setLocalTask(e.target.value) }}
					// TODO: Add the proper Redux Thunk to update task on Blur
					/>}
			</TaskContainer>
			<WasteContainer title={wasteTooltip} style={{ width: '200px' }}>
				<p>{displayTimeLeft(waste)}</p>
			</WasteContainer>
			<TimeContainer title={ttcTooltip}>
				{status === TASK_STATUSES.COMPLETED ?
					<pre>{ttc && !isNaN(ttc) && ttc > 0 ? formatTimeLeft({ timeDifference: ttc, minuteText: 'minutes', hourText: 'hour', hourText2: 'hours' }) : '0 minutes'}</pre>
					: <HoursInput
						state={{ variant, placeholder: 'hours', text: 'hours' }}
						defaultValue={1}
						services={{ onValueChange: value => setLocalTtc(value), onBlur: () => setLocalTtc(localTtc) }}
					/>
				}
			</TimeContainer>
			<TimeContainer title={etaTooltip}>
				<p aria-label={`eta for task ${index}`}> {eta && typeof eta === 'string' && !isNaN(parseISO(eta).getTime()) ? format(parseISO(eta), "HH:mm") : '00:00'}</p>
			</TimeContainer>
		</>)
}
export default SimpleRow