import { useRef } from 'react'
import SimpleRow from './SimpleRow.js'
import { EfficiencyContainer, DueContainer, WeightContainer, ThreadContainer, DependencyContainer } from './TaskRow.elements.js'
import HoursInput from '../../atoms/HoursInput/HoursInput.js'
import { parseISO, format } from 'date-fns'
import DateTimePickerWrapper from '../../atoms/DateTimePickerWrapper/DateTimePickerWrapper.js'
import { TASK_ROW_TOOLTIPS } from '../../../Core/utils/constants.js'
import OptionPicker from '../../atoms/OptionPicker/OptionPicker.js'

/* NOTE: You do the 'addThread' service here because the taskRow events file already updates the task itself!
   NOTE: I removed the isValidTask step since it should be valid by definition*/
// TODO: Establish maximum weight
const formatDate = localDueDate => localDueDate ? format(parseISO(localDueDate), 'MMM-d-yyyy @ h:mm a') : "invalid"
const formatEfficiency = efficiency => !efficiency || efficiency <= 0 ? '-' : `${(parseFloat(efficiency) * 100).toFixed(0)}%`

function FullRow({ simpleTaskProps, services, state, }) {
	const { provided, taskObject, variant, isChecked, setLocalTask, localTask, localTtc, setLocalTtc, handleCheckBoxClicked } = simpleTaskProps
	const { setLocalDueDate, setLocalWeight, setLocalThread, setLocalDependencies, addThread } = services || {}
	const { availableThreads, localThread, localDueDate, localDependencies, localWeight, options } = state || {}
	const { efficencyToolTip, dueToolTip, weightToolTip, threadToolTip, dependencyToolTip } = TASK_ROW_TOOLTIPS
	const fullTask = { ...taskObject, ...state }
	const initialThread = useRef(localThread), initialDependencies = useRef(localDependencies)
	return (
		<>
			<SimpleRow provided={provided} variant={variant} state={{ taskObject, isChecked, localTask, localTtc }} services={{ setLocalTask, setLocalTtc, handleCheckBoxClicked }} />
			<EfficiencyContainer title={efficencyToolTip}><p>{formatEfficiency(fullTask?.efficiency)}</p></EfficiencyContainer>
			<DueContainer title={dueToolTip}>
				{isChecked ? formatDate(localDueDate) : <DateTimePickerWrapper state={{ variant, defaultTime: format(parseISO(localDueDate), 'HH:mm'), defaultDate: parseISO(localDueDate), }} services={{ onTimeChange: (newDateTime) => setLocalDueDate(newDateTime.toISOString()) }} />}
			</DueContainer>
			<WeightContainer title={weightToolTip}>
				{isChecked ? parseFloat(localWeight).toFixed(2) || 1 : <HoursInput state={{ variant, placeholder: 1, min: 1 }} defaultValue={(localWeight && localWeight > .01 ? localWeight : 1)} services={{ onValueChange: value => setLocalWeight(parseFloat(value)) }} />}
			</WeightContainer>
			<ThreadContainer title={threadToolTip}>
				<OptionPicker
					state={{ variant, options: availableThreads, label: 'Select Thread', multiple: false }}
					services={{ onChange: e => setLocalThread(e) }}
					defaultValue={initialThread.current}
					onBlur={e => { if (!availableThreads.includes(e.target.value)) addThread(e.target.value) }}
				/>
			</ThreadContainer>
			<DependencyContainer title={dependencyToolTip}>
				<OptionPicker
					state={{ variant, options, multiple: true }}
					services={{ onChange: setLocalDependencies }}
					defaultValue={initialDependencies.current}
				/>
			</DependencyContainer>
		</>
	)
}
export default FullRow