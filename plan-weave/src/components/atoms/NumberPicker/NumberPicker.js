import { useState } from 'react'
import { THEMES } from '../../utils/constants'
import {
	DropdownWrapper,
	StyledNumberPicker
} from './NumberPicker.elements'

function NumberPicker({ variant = 'dark', defaultNumber = 10, options = [10] }) {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const [number, setNumber] = useState(defaultNumber)
	const handleNumberChange = e => setNumber(e.target.value)

	return (
		<DropdownWrapper>
			<StyledNumberPicker onChange={handleNumberChange} value={number}>
				{options?.map((opt, index) => (
					<option key={opt.toString().concat(index)} value={opt}>{opt}</option>
				))}
			</StyledNumberPicker>
		</DropdownWrapper>
	)
}

export default NumberPicker