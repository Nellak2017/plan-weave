import React from 'react'
import SimpleRow from './SimpleRow.js'
import { DueContainer, WeightContainer, ThreadContainer } from './TaskRow.elements.js'
import HoursInput from '../../atoms/HoursInput/HoursInput.js'
import { parseISO, format } from 'date-fns'

function FullRow({
	simpleTaskProps,
	services,
	state,
}) {
	const { provided, taskObject, variant, isChecked, setLocalTask, localTask, localTtc, setLocalTtc, handleCheckBoxClicked } = simpleTaskProps
	const { setLocalDueDate, setLocalWeight, setLocalThread } = services || {}
	const { localThread, localDueDate, localDependencies, localWeight } = state || {}
	const fullTask = { ...taskObject, ...state }
	return (
		<>
			<SimpleRow
				provided={provided}
				variant={variant}
				state={{ taskObject, isChecked, localTask, localTtc }}
				services={{ setLocalTask, setLocalTtc, handleCheckBoxClicked }}
			/>
			<DueContainer>
				{
					localDueDate ? format(parseISO(localDueDate), 'd-MMM @ HH:mm') : "invalid"
					
					// TODO: Get a Date-time picker and implement it here
				}
			</DueContainer>
			<WeightContainer>
				<HoursInput 
					onValueChange={value => setLocalWeight(parseFloat(value))}
					value={localWeight}
					initialValue={localWeight && localWeight > .01 ? localWeight : 1}
					variant={variant}
					placeholder='1'
				/>
				{
					// TODO: Create the Services that are able to update these things properly (Check TaskRow.events)
				}
			</WeightContainer>
			<ThreadContainer>
				{
				//'thread'
				//<button onClick={() => console.log(fullTask)}>{'Show Full Task'}</button>
				localThread
				// TODO: Create Thread Chooser Component (Input with drop down options as searching, that filters over available threads)
				}
			</ThreadContainer>
		</>
	)
}

export default FullRow