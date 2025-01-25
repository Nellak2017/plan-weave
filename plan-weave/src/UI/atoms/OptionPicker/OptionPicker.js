import { VARIANTS } from '../../../Core/utils/constants.js'
import { StyledTextField, StyledChip, StyledOption } from './OptionPicker.elements.js'
import { Autocomplete } from '@mui/material'

const OptionPicker = ({
	state: { variant = VARIANTS[0], initialSelectedPredecessors = [], options, label = 'Select Predecessors' } = {},
	services: { onChange } = {}, ...props
}) => (
	<Autocomplete
		defaultValue={initialSelectedPredecessors}
		multiple={true} disableCloseOnSelect={true} clearOnBlur={false}
		variant={variant} options={options}
		getOptionLabel={option => (typeof option === 'string' ? option : option.label || '')}
		isOptionEqualToValue={(option, value) => option.value === value.value}
		renderOption={(props, option, { selected }) => (<StyledOption variant={variant} selected={selected} {...props} >{option.label || option}</StyledOption>)}
		renderInput={params => (<StyledTextField {...params} label={label} variant="outlined" InputProps={{ ...params.InputProps, readOnly: true }} />)}
		renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (<StyledChip label={option.label || option} {...getTagProps({ index })} key={option.value || option} />))}
		onChange={(_, selectedOptions) => { if (onChange) onChange(selectedOptions) }}
		{...props}
	/>
)
export default OptionPicker