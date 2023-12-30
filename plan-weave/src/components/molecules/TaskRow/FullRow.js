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

function FullRow({
	simpleTaskProps,
	services,
	state,
}) {
	const { provided, taskObject, variant, isChecked, setLocalTask, localTask, localTtc, setLocalTtc, handleCheckBoxClicked } = simpleTaskProps
	const { setLocalDueDate, setLocalWeight, setLocalThread } = services || {}
	const { localThread, localDueDate, localDependencies, localWeight } = state || {}
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
					? parseFloat(localWeight).toFixed(2)
					: <HoursInput
					onValueChange={value => setLocalWeight(parseFloat(value))}
					value={localWeight}
					initialValue={localWeight && localWeight > .01 ? localWeight : 1}
					variant={variant}
					placeholder='1'
				/>}
				{
					// TODO: Create the Services that are able to update these things properly (Check TaskRow.events)
					// TODO: Refactor TaskRow.events to use Service/State pattern
				}
			</WeightContainer>
			<ThreadContainer title={threadToolTip}>
				{
					//'thread'
					//<button onClick={() => console.log(fullTask)}>{'Show Full Task'}</button>
					localThread
					// TODO: Create Thread Chooser Component (Input with drop down options as searching, that filters over available threads)
				}
			</ThreadContainer>
			<DependencyContainer title={dependencyToolTip}>
				Predecessors
			</DependencyContainer>
		</>
	)
}

export default FullRow