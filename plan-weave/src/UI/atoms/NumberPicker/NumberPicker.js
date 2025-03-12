import { PickerContainer, DropdownWrapper } from './NumberPicker.elements'
import NativeSelect from '@mui/material/NativeSelect'

const NumberPicker = ({
	state: { options = [10], pickerText = 'Tasks per page' } = {},
	services: { onValueChange } = {}, ...rest
}) => (
	<PickerContainer>
		{pickerText && <p>{pickerText}</p>}
		<DropdownWrapper>
			<NativeSelect defaultValue={options?.[0] || 10} inputProps={{ name: 'tasks per page', id: 'uncontrolled-native', }} onChange={e => onValueChange?.(e.target.value)} {...rest}>
				{options?.map((opt, index) => (<option key={opt.toString().concat(index)} value={opt}>{opt}</option>))}
			</NativeSelect>
		</DropdownWrapper>
	</PickerContainer>
)
export default NumberPicker