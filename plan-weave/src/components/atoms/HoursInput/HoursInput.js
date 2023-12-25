import {
	HoursInputStyled, HoursContainer
} from './HoursInput.elements'
import { useState, useMemo } from 'react'
import { THEMES } from '../../utils/constants'
import PropTypes from 'prop-types'

const HoursInput = ({
	placeholder = '0',
	text,
	variant = 'dark',
	maxwidth = 45,
	color,
	initialValue,
	controlledValue,
	onValueChange,
	onBlur,
	step = .1,
	min = 0,
	max = 24,
}) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const [localValue, setLocalValue] = useState(initialValue)

	// Use the controlledValue prop if it exists, otherwise, use localValue
	const value = useMemo(() => controlledValue || localValue, [controlledValue,localValue])

	const handleChange = e => {
		const newValue = e.target.value
		const cleanedValue = (newValue >= min && newValue <= max) || newValue === '' ? newValue : min
		
		setLocalValue(cleanedValue) // if it is in range, then it is that, default to min
		
		// Pass the new value to the parent component
		if (onValueChange) onValueChange(cleanedValue) 
	}
	const handleBlur = () => {
		let sanitizedValue = Math.max(min, Math.min(24, parseFloat(localValue) || min))
		sanitizedValue = isNaN(sanitizedValue) ? '' : sanitizedValue.toFixed(1)

		if (onBlur) onBlur() // From parent

		setLocalValue(sanitizedValue)

		// If it's being controlled, call the parent's onValueChange
		if (onValueChange && controlledValue !== undefined) onValueChange(sanitizedValue)
	}
	return (
		<HoursContainer variant={variant} color={color}>
			<HoursInputStyled
				variant={variant}
				placeholder={placeholder}
				maxwidth={maxwidth}
				color={color}
				type='text'
				min={min}
				max={max}
				step={step}
				inputMode='numeric'
				pattern='[0-9]*'
				onChange={handleChange}
				onBlur={handleBlur}
				value={value}
			/>
			<span>{text}</span>
		</HoursContainer>
	)
}

HoursInput.propTypes = {
	placeholder: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	text: PropTypes.string,
	variant: PropTypes.string,
	maxwidth: PropTypes.number,
	color: PropTypes.string,
	initialValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	controlledValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	onValueChange: PropTypes.func,
	onBlur: PropTypes.func,
	step: PropTypes.number,
	min: PropTypes.number,
	max: PropTypes.number,
  }

export default HoursInput