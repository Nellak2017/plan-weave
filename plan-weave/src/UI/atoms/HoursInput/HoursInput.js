import { HoursInputStyled, HoursContainer } from './HoursInput.elements'
import { VARIANTS } from '../../../Core/utils/constants.js'

// TODO: Test this input and verify invalid input can not go into it and that it is correct
// TODO: When Pagination uses this it incorrectly shows decimals, make sure it never does
const HoursInput = ({
	state: { variant = VARIANTS[0], placeholder = 0, text, maxwidth = 45, step = .01, min = 0, max = 24, maxLength = '5' } = {},
	services: { onValueChange, onBlur } = {}, ...props
}) => (
	<HoursContainer variant={variant}>
		<HoursInputStyled
			variant={variant} maxwidth={maxwidth} placeholder={placeholder}
			type='text' min={min} max={max} step={step}
			inputMode='numeric' maxLength={maxLength} pattern='^$|^[0-9]*\.?[0-9]*$' // Empty, ".", decimal
			onChange={e => {
				const newValue = e.target.value
				if ((newValue === '' || newValue === '.' || (parseFloat(newValue) >= min && parseFloat(newValue) <= max)) && onValueChange) onValueChange(newValue)
			}}
			onBlur={e => { if (onBlur) onBlur((parseFloat(e.target.value) || 0.1).toFixed(2)) }}
			{...props}
		/>
		<span>{text}</span>
	</HoursContainer>
)
export default HoursInput