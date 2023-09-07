import {
	HoursInputStyled, HoursContainer
} from './HoursInput.elements'
import { useState } from 'react'
import { THEMES } from '../../utils/constants'

const HoursInput = ({
	placeholder = '0',
	text,
	variant = 'dark',
	maxwidth = 61,
	color,
	initialValue,
	controlledValue,
	onValueChange,
	step = .1,
	min = 0,
	max = 24,
	integer
}) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const [localValue, setLocalValue] = useState(initialValue)

	// Use the controlledValue prop if it exists, otherwise, use localValue
	const value = controlledValue !== undefined ? controlledValue : localValue;

	const handleChange = e => {
		const newValue = e.target.value
		const cleanedValue = (newValue >= min && newValue <= max) || newValue === '' ? newValue : min
		setLocalValue(cleanedValue) // if it is in range, then it is that, default to min
		if (onValueChange) {
			onValueChange(cleanedValue) // Pass the new value to the parent component
		}
		// If it's not being controlled, update the local state
		if (controlledValue === undefined) {
			setLocalValue(cleanedValue)
		}
	}
	const handleBlur = () => {
		let sanitizedValue = Math.max(min, Math.min(24, parseFloat(localValue) || min))
		sanitizedValue = isNaN(sanitizedValue) ? '' : sanitizedValue.toFixed(1)

		// If it's being controlled, call the parent's onValueChange
		if (onValueChange && controlledValue !== undefined) {
			onValueChange(sanitizedValue)
		}

		// If it's not being controlled, update the local state
		if (controlledValue === undefined) {
			setLocalValue(sanitizedValue)
		}
	}
	return (
		<HoursContainer variant={variant} color={color}>
			<HoursInputStyled
				variant={variant}
				placeholder={placeholder}
				maxwidth={maxwidth}
				color={color}
				type='number'
				min={min}
				max={max}
				step={step}
				onChange={handleChange}
				onBlur={handleBlur}
				value={integer ? parseInt(value) : value}
			/>
			<span>{text}</span>
		</HoursContainer>
	)
}

export default HoursInput