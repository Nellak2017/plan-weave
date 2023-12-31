import React from 'react'
import SimpleRow from './SimpleRow.js'
import {
	EfficiencyContainer,
	DueContainer,
	WeightContainer,
	ThreadContainer,
	DependencyContainer
} from './TaskRow.elements.js'
import HoursInput from '../../atoms/HoursInput/HoursInput.js'
import { parseISO, format } from 'date-fns'
import DateTimePickerWrapper from '../../atoms/DateTimePickerWrapper/DateTimePickerWrapper.js'
import { TASK_ROW_TOOLTIPS } from '../../utils/constants.js'
import Select from '../../atoms/Select/Select.js'
import { validateTaskField } from '../../utils/helpers.js'
import { taskSchema } from '../../schemas/taskSchema/taskSchema.js'

function FullRow({
	simpleTaskProps,
	services,
	state,
}) {
	const { provided, taskObject, variant, isChecked, setLocalTask, localTask, localTtc, setLocalTtc, handleCheckBoxClicked } = simpleTaskProps
	const { setLocalDueDate, setLocalWeight, setLocalThread, setLocalDependencies, addThread } = services || {}
	const { availableThreads, localThread, localDueDate, localDependencies, localWeight } = state || {}
	const { efficiency: efficencyToolTip, due: dueToolTip, weight: weightToolTip, thread: threadToolTip, dependencies: dependencyToolTip } = TASK_ROW_TOOLTIPS
	const fullTask = { ...taskObject, ...state }
	return (
		<>
			<SimpleRow
				provided={provided}
				variant={variant}
				state={{ taskObject, isChecked, localTask, localTtc }}
				services={{ setLocalTask, setLocalTtc, handleCheckBoxClicked }}
			/>
			<EfficiencyContainer title={efficencyToolTip}>
				<p>
					{
						!fullTask?.efficiency || fullTask?.efficiency <= 0
							? '-'
							: `${(parseFloat(fullTask?.efficiency) * 100).toFixed(0)}%`
					}
				</p>
			</EfficiencyContainer>
			<DueContainer title={dueToolTip}>
				{isChecked
					? localDueDate ? format(parseISO(localDueDate), 'MMM-d-yyyy @ h:mm a') : "invalid"
					: <DateTimePickerWrapper
						variant={variant}
						services={{
							onTimeChange: (newDateTime) => setLocalDueDate(newDateTime.toISOString())
						}}
						state={{
							defaultTime: format(parseISO(localDueDate), 'HH:mm'),
							defaultDate: parseISO(localDueDate),
						}}
					/>
				}
			</DueContainer>
			<WeightContainer title={weightToolTip}>
				{isChecked
					? parseFloat(localWeight).toFixed(2) || 1
					: <HoursInput
						onValueChange={value => setLocalWeight(parseFloat(value))}
						value={localWeight}
						initialValue={localWeight && localWeight > .01 ? localWeight : 1}
						variant={variant}
						placeholder='1'
						min={1}
					// TODO: Establish maximum weight
					/>}
			</WeightContainer>
			<ThreadContainer title={threadToolTip}>
				{
					// NOTE: You do the 'addThread' service here because the taskRow events file already updates the task itself!
					<Select
						variant={variant}
						services={
							{
								onChange: e => setLocalThread(e),
								onBlur: e => {
									const isValidTask = validateTaskField({ field: 'parentThread', payload: e, schema: taskSchema })?.valid
									const isUniqueThread = !availableThreads.includes(e)
									if (isValidTask && isUniqueThread) addThread(e)
								},
							}
						}
						state={
							{
								initialValue: localThread,
								options: availableThreads,
								minLength: 2, // Select stops onBlur, and even if it didn't the schema validation would (defensive programming)
								maxLength: 50,// This is here to ensure valid range no matter what (defense in depth)
							}
						}
					/>
				}
			</ThreadContainer>
			<DependencyContainer title={dependencyToolTip}>
				Predecessors
			</DependencyContainer>
		</>
	)
}

export default FullRow