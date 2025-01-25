import { useState } from 'react'
import { VARIANTS } from '../../../Core/utils/constants.js'
import { StyledTextField, StyledChip, StyledOption } from './OptionPicker.elements.js'
import { Autocomplete } from '@mui/material'

const OptionPicker = ({ state, services, ...props }) => {
	const { variant = VARIANTS[0], initialSelectedPredecessors = [], options } = state || {}
	const { onChange } = services || {}
	const [selectedPredecessors, setSelectedPredecessors] = useState(initialSelectedPredecessors)
	const handleSelectChange = (_, selectedOptions) => {
		if (onChange) onChange(selectedOptions) // call the parent if it exists
		setSelectedPredecessors(selectedOptions)
	}
	return (
		<Autocomplete
			multiple={true} disableCloseOnSelect={true} clearOnBlur={false}
			variant={variant} value={selectedPredecessors} options={options}
			getOptionLabel={option => (typeof option === 'string' ? option : option.label || '')}
			isOptionEqualToValue={(option, value) => option.value === value.value}
			renderOption={(props, option, { selected }) => (<StyledOption theme={theme} variant={variant} selected={selected} {...props} >{option.label || option}</StyledOption>)}
			renderInput={params => (<StyledTextField {...params} label="Select options" variant="outlined" InputProps={{ ...params.InputProps, readOnly: true }} />)}
			renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (<StyledChip label={option.label || option} {...getTagProps({ index })} key={option.value || option} />))}
			onChange={handleSelectChange}
			{...props}
		/>
	)
}
export default OptionPicker