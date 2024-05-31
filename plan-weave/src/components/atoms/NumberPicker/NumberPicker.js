import React, { useState, useMemo } from 'react'
import { THEMES, VARIANTS } from '../../utils/constants'
import {
	PickerContainer,
	DropdownWrapper,
	StyledNumberPicker
} from './NumberPicker.elements'
import PropTypes from 'prop-types'

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
		// Pass the new value to the parent component
		if (onValueChange) onValueChange(e.target.value)
		setNumber(e.target.value)
		// If it's not being controlled, update the local state
		if (controlledValue !== 0 && !controlledValue) setNumber(e.target.value)
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

NumberPicker.propTypes = {
	variant: PropTypes.oneOf(VARIANTS),
	defaultNumber: PropTypes.number,
	options: PropTypes.arrayOf(PropTypes.number),
	text: PropTypes.string,
	onValueChange: PropTypes.func,
	controlledValue: PropTypes.number,
}

export default NumberPicker