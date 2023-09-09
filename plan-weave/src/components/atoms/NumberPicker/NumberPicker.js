import { useState } from 'react'
import { THEMES } from '../../utils/constants'
import {
	PickerContainer,
	DropdownWrapper,
	StyledNumberPicker
} from './NumberPicker.elements'

function NumberPicker({ variant = 'dark', defaultNumber = 10, options = [10], text = 'Tasks per page', onValueChange }) {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const [number, setNumber] = useState(defaultNumber)
	const handleNumberChange = e => {
		setNumber(e.target.value)
		if (onValueChange) {
			onValueChange(e.target.value)
		}
	}

	return (
		<>
			<PickerContainer variant={variant}>
				{text && <p>{text}</p>}
				<DropdownWrapper>
					<StyledNumberPicker onChange={handleNumberChange} value={number}>
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