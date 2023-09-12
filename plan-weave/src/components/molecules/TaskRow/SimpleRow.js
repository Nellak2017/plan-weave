import { TASK_STATUSES } from "../../utils/constants"
import TaskInput from '../../atoms/TaskInput/TaskInput.js'
import HoursInput from '../../atoms/HoursInput/HoursInput.js'
import {
	MdOutlineCheckBoxOutlineBlank,
	MdOutlineCheckBox
} from 'react-icons/md'
import { BiTrash } from 'react-icons/bi'
import {
	DragIndicator,
	TaskContainer,
	TimeContainer,
	IconContainer
} from './TaskRow.elements.js'
import { formatTimeLeft } from '../../utils/helpers.js'
import { format } from 'date-fns'

// Task View Logic (Simple, Full) (Just Simple for now)
const SimpleRow = ({ provided, taskObject, variant, isChecked, setLocalTask, localTask, localTtc, handleCheckBoxClicked, handleDeleteTask }) => {

	const { task, waste, ttc, eta, status, id, timestamp } = { ...taskObject }
	return (
		<>
			<IconContainer title={'Drag-n-Drop tasks to change view'} {...provided?.dragHandleProps ?? ''}>
				<DragIndicator size={32} />
			</IconContainer>
			<IconContainer title={isChecked ? 'Mark Incomplete' : 'Mark Complete'}>
				{isChecked
					? (<MdOutlineCheckBox size={32} onClick={handleCheckBoxClicked} />)
					: (<MdOutlineCheckBoxOutlineBlank size={32} onClick={handleCheckBoxClicked} />)
				}
			</IconContainer>
			<TaskContainer title={'Task Name'}>
				{status === TASK_STATUSES.COMPLETED ?
					<p>{task}</p>
					: <TaskInput onChange={e => setLocalTask(e.target.value)} value={localTask} variant={variant} />
				}
			</TaskContainer>
			<TimeContainer title={'Wasted Time on this Task'} style={{ width: '200px' }}>
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
			</TimeContainer>
			<TimeContainer style={{ width: '120px' }} title={'Time To Complete Task'}>
				{status === TASK_STATUSES.COMPLETED ?
					<pre>{ttc && !isNaN(ttc) && ttc > 0 ?
						formatTimeLeft({
							timeDifference: ttc,
							minuteText: 'minutes',
							hourText: 'hour',
							hourText2: 'hours'
						}) :
						'0 minutes'}</pre>
					: <HoursInput onValueChange={value => setLocalTtc(value)} value={localTtc} initialValue={localTtc && localTtc > .01 ? localTtc : 1} variant={variant} placeholder='hours' text='hours' />
				}
			</TimeContainer>
			<TimeContainer style={{ width: '40px' }} title={'Estimated Time to Finish Task'}>
				<p>
					{eta && eta instanceof Date && !isNaN(eta.getTime())
						? format(eta, "HH:mm")
						: typeof eta === 'number' // assuming epoch 
							? format(new Date(eta * 1000), "HH:mm")
							: '00:00'
					}
				</p>
			</TimeContainer>
			<IconContainer>
				<BiTrash title={'Delete this task'} onClick={handleDeleteTask} size={32} />
			</IconContainer>
		</>)
}

export default SimpleRow