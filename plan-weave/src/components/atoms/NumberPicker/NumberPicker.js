import { useState, useMemo } from 'react'
import { THEMES } from '../../utils/constants'
import {
	PickerContainer,
	DropdownWrapper,
	StyledNumberPicker
} from './NumberPicker.elements'

function NumberPicker({ 
	variant = 'dark', 
	defaultNumber = 10, 
	options = [10], 
	text = 'Tasks per page', 
	onValueChange,
	controlledValue
}) {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const [number, setNumber] = useState(defaultNumber)

	const value = useMemo(() => controlledValue || number, [number])

	//console.log(value)

	const handleNumberChange = e => {
		// Pass the new value to the parent component
		if (onValueChange) onValueChange(e.target.value)
		
		setNumber(e.target.value)

		// If it's not being controlled, update the local state
		if (controlledValue !== 0 && !controlledValue) setNumber(e.target.value)
	}

	return (
		<>
			<PickerContainer variant={variant}>
				{text && <p>{text}</p>}
				<DropdownWrapper>
					<StyledNumberPicker onChange={handleNumberChange} value={value}>
						{options?.map((opt, index) => (
							<option key={opt.toString().concat(index)} value={opt}>{opt}</option>
						))}
					</StyledNumberPicker>
				</DropdownWrapper>
			</PickerContainer>
		</>
	)
}

export default NumberPicker