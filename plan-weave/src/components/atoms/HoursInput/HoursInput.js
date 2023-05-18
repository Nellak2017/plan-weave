import {
	HoursInputStyled, HoursContainer
} from './HoursInput.elements'
import { useState } from 'react'

const HoursInput = ({ placeholder='0', text, variant, maxwidth=61, color, ...rest }) => {
	const [value, setValue] = useState('')
	const handleChange = e => { setValue(e.target.value) }
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
				{...rest} />
			<span>{text}</span>
		</HoursContainer>
	)
}

export default HoursInput