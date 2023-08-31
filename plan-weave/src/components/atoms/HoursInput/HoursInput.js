import {
	HoursInputStyled, HoursContainer
} from './HoursInput.elements'
import { useState } from 'react'
import { THEMES } from '../../utils/constants'

const HoursInput = ({ placeholder = '0', text, variant, maxwidth = 61, color, initialValue, onValueChange }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const [value, setValue] = useState(initialValue)
	const handleChange = e => {
		const newValue = e.target.value
		setValue(newValue)
		if (onValueChange) {
			onValueChange(newValue) // Pass the new value to the parent component
		}
	}
	const handleBlur = () => {
		let sanitizedValue = Math.max(0, Math.min(24, parseFloat(value) || 0))
		sanitizedValue = isNaN(sanitizedValue) ? '' : sanitizedValue.toFixed(1)
		setValue(sanitizedValue)
	}
	return (
		<HoursContainer variant={variant} color={color}>
			<HoursInputStyled
				variant={variant}
				placeholder={placeholder}
				maxwidth={maxwidth}
				color={color}
				type='number'
				min='0'
				max='24'
				step='.1'
				onChange={handleChange}
				onBlur={handleBlur}
				value={value}
			/>
			<span>{text}</span>
		</HoursContainer>
	)
}

export default HoursInput