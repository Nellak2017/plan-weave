import { useState } from 'react'
import { HoursInputStyled, HoursContainer } from './HoursInput.elements'
import { parseBlur, parseChange } from '../../../Core/utils/helpers.js'

const HoursInput = ({
	state: { step = 0.1, precision = 2, pattern = /^(\d*\.?\d*)$/, placeholder = 1, text, maxwidth = 45, min = 0, max = 24, maxLength = '5', } = {},
	services: { onValueChange, onBlur } = {},
	value, defaultValue, // possible controlled or uncontrolled value
	...props
}) => {
	const [val, setVal] = useState(defaultValue || 1) // used locally to always have correct local value, then synced with caller when ready
	const updateState = newValue => { if (value === undefined) { setVal(newValue) } } // update local state only if it is uncontrolled
	return (
		<HoursContainer>
			<HoursInputStyled
				maxwidth={maxwidth} placeholder={placeholder} type='text' inputMode='numeric' min={min} max={max} step={step} maxLength={maxLength} pattern={pattern}
				onChange={e => {
					const newValue = parseChange({ value: e.target.value, pattern, min, max })
					updateState(newValue); onValueChange?.(newValue)
				}}
				onBlur={e => {
					const newValue = parseBlur({ value: e.target.value, min, max, precision })
					updateState(newValue); onBlur?.(newValue)
				}}
				value={value ?? val}
				{...props}
			/>
			<span>{text}</span>
		</HoursContainer>
	)
}
export default HoursInput

export const HoursInputPositiveFloat = ({ state, services, ...props }) => (<HoursInput state={state} services={services} {...props} />)
export const HoursInputPositiveInt = ({ state, services, ...props }) => (<HoursInput state={{ ...state, step: 1, precision: 0, pattern: /^\d*$/, }} services={services} {...props} />)