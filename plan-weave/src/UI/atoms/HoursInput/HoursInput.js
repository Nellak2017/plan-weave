import { HoursInputStyled, HoursContainer } from './HoursInput.elements'
import { useState, useMemo } from 'react'
import { VARIANTS } from '../../../Core/utils/constants.js'

// TODO: Test this input and verify invalid input can not go into it
// TODO: Simplify this Input so that it has the least local state as possible
const HoursInput = ({
	state: { variant = VARIANTS[0], placeholder = 0, text, initialValue, maxwidth = 45, controlledValue, step = .01, min = 0, max = 24, maxLength = '5' } = {},
	services: { onValueChange, onBlur } = {}, ...props
}) => {
	const [localValue, setLocalValue] = useState(initialValue)
	const value = useMemo(() => controlledValue || localValue, [controlledValue, localValue]) // Use the controlledValue prop if it exists, otherwise, use localValue
	const handleChange = e => {
		const newValue = e.target.value
		const cleanedValue = (parseFloat(newValue) >= min && parseFloat(newValue) <= max) || newValue === '' || newValue === '.' ? String(newValue) : String(min)
		setLocalValue(cleanedValue) // if it is in range, then it is that, default to min
		if (onValueChange) onValueChange(cleanedValue) // Pass the new value to the parent component
	}
	const handleBlur = () => { // TODO: remove this function or make it work still
		const sanitizedValue = (parseFloat(localValue) || .1).toFixed(2) // Fail-safe default on blur, fixes ttc crash site bug on edge case
		if (onBlur) onBlur(String(sanitizedValue))
		setLocalValue(String(sanitizedValue))
		if (onValueChange && controlledValue !== undefined) onValueChange(String(sanitizedValue)) // If it's being controlled, call the parent's onValueChange
	}
	return (
		<HoursContainer variant={variant}>
			<HoursInputStyled
				variant={variant} maxwidth={maxwidth}
				value={value} placeholder={placeholder}
				type='text' min={min} max={max} step={step}
				inputMode='numeric' maxLength={maxLength} pattern='^$|^[0-9]*\.?[0-9]*$' // Empty, ".", decimal
				onChange={handleChange} onBlur={handleBlur}
				{...props} // TODO: maybe remove
			/>
			<span>{text}</span>
		</HoursContainer>
	)
}
export default HoursInput