import {
	HoursInputStyled, HoursContainer
} from './HoursInput.elements'
import { useState, useMemo } from 'react'
import { THEMES, VARIANTS } from '../../utils/constants'
import PropTypes from 'prop-types'

const HoursInput = ({
	placeholder = '0',
	text,
	variant = VARIANTS[0],
	maxwidth = 45,
	color,
	initialValue,
	controlledValue,
	onValueChange,
	step = .01,
	min = 0,
	max = 24,
	maxLength = '5',
	onBlur,
	...props
}) => {
	const processedVariant = (variant && !THEMES.includes(variant)) ? VARIANTS[0] : variant

	const [localValue, setLocalValue] = useState(initialValue)

	// Use the controlledValue prop if it exists, otherwise, use localValue
	const value = useMemo(() => controlledValue || localValue, [controlledValue,localValue])

	const handleChange = e => {
		const newValue = e.target.value
		const cleanedValue = (parseFloat(newValue) >= min && parseFloat(newValue) <= max) || newValue === '' || newValue === '.' ? String(newValue) : String(min)
		
		setLocalValue(cleanedValue) // if it is in range, then it is that, default to min
		
		// Pass the new value to the parent component
		if (onValueChange) onValueChange(cleanedValue) 
	}

	// TODO: remove this function or make it work still
	const handleBlur = () => {
		const sanitizedValue = (parseFloat(localValue) || .1).toFixed(2) // Fail-safe default on blur, fixes ttc crash site bug on edge case

		if (onBlur) onBlur(String(sanitizedValue))

		setLocalValue(String(sanitizedValue))

		// If it's being controlled, call the parent's onValueChange
		if (onValueChange && controlledValue !== undefined) onValueChange(String(sanitizedValue))
	}
	return (
		<HoursContainer variant={processedVariant} color={color}>
			<HoursInputStyled
				variant={processedVariant}
				placeholder={placeholder}
				maxwidth={maxwidth}
				color={color}
				type='text'
				min={min}
				max={max}
				step={step}
				inputMode='numeric'
				pattern='^$|^[0-9]*\.?[0-9]*$' // Empty, ".", decimal
				onChange={handleChange}
				onBlur={handleBlur}
				value={value}
				maxLength={maxLength}
				{...props} // TODO:  maybe remove
			/>
			<span>{text}</span>
		</HoursContainer>
	)
}

HoursInput.propTypes = {
	placeholder: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	text: PropTypes.string,
	variant: PropTypes.oneOf(VARIANTS),
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