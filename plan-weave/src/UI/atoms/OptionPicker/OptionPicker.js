import { StyledTextField, StyledChip, StyledOption } from './OptionPicker.elements.js'
import { Autocomplete } from '@mui/material'

export const OptionPicker = ({
	state: { options = [], label = 'Select Predecessors', multiple = true } = {}, ...props
}) => (
	<Autocomplete
		multiple={multiple} disableCloseOnSelect={true} clearOnBlur={false}
		options={options}
		getOptionLabel={option => (typeof option === 'string' ? option : option?.label || '')}
		isOptionEqualToValue={(option, value) => option?.value === value?.value}
		renderOption={(props, option, { selected }) => {
			const { key, ...rest} = props // this destructuring is done to prevent the react error that says you can't destructure keys
			return (<StyledOption key={key} selected={selected} {...rest} >{option?.label || option}</StyledOption>)
		}}
		renderInput={params => (<StyledTextField {...params} label={label} variant="outlined" InputProps={{ ...params.InputProps, readOnly: true }} />)}
		renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (<StyledChip label={option.label || option} {...getTagProps({ index })} key={option.value || option} />))}
		{...props}
	/>
)
export default OptionPicker