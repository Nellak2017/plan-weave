import { VARIANTS } from '../../../Core/utils/constants.js'
import { StyledTextField, StyledChip, StyledOption } from './OptionPicker.elements.js'
import { Autocomplete } from '@mui/material'

export const OptionPicker = ({
	state: { variant = VARIANTS[0], options = [], label = 'Select Predecessors', multiple = true } = {},
	services: { onChange } = {}, ...props
}) => (
	<Autocomplete
		multiple={multiple} disableCloseOnSelect={true} clearOnBlur={false}
		options={options}
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