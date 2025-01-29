import { VARIANTS } from '../../../Core/utils/constants.js'
import { PickerContainer, DropdownWrapper, StyledNumberPicker } from './NumberPicker.elements'

const NumberPicker = ({
	state: { variant = VARIANTS[0], options = [10], pickerText = 'Tasks per page' } = {},
	services: { onValueChange } = {}, ...rest
}) => (
	<PickerContainer variant={variant}>
		{pickerText && <p>{pickerText}</p>}
		<DropdownWrapper>
			<StyledNumberPicker onChange={e => { if (onValueChange) onValueChange(e.target.value) }} {...rest}>
				{options?.map((opt, index) => (<option key={opt.toString().concat(index)} value={opt}>{opt}</option>))}
			</StyledNumberPicker>
		</DropdownWrapper>
	</PickerContainer>
)
export default NumberPicker