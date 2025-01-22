import React, { useState, useMemo } from 'react'
import { THEMES, VARIANTS } from '../../../Core/utils/constants.js'
import { PickerContainer, DropdownWrapper, StyledNumberPicker } from './NumberPicker.elements'

function NumberPicker({
	variant = VARIANTS[0],
	defaultNumber = 10,
	options = [10],
	text = 'Tasks per page',
	onValueChange,
	controlledValue
}) {
	const processedVariant = (variant && !THEMES.includes(variant)) ? VARIANTS[0] : variant
	const [number, setNumber] = useState(defaultNumber)
	const value = useMemo(() => controlledValue || number, [controlledValue, number])
	const handleNumberChange = e => {
		if (onValueChange) onValueChange(e.target.value) // Pass the new value to the parent component
		setNumber(e.target.value)
		if (controlledValue !== 0 && !controlledValue) setNumber(e.target.value) // If it's not being controlled, update the local state
	}
	return (
		<PickerContainer variant={processedVariant}>
			{text && <p>{text}</p>}
			<DropdownWrapper>
				<StyledNumberPicker onChange={handleNumberChange} value={value}>
					{options?.map((opt, index) => (
						<option key={opt.toString().concat(index)} value={opt}>{opt}</option>
					))}
				</StyledNumberPicker>
			</DropdownWrapper>
		</PickerContainer>
	)
}
export default NumberPicker