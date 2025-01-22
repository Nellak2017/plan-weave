// Simple React Select Wrapper with styles applied
import React, { useState } from 'react'
import { default as ReactSelect } from 'react-select' // You alias this to be clear about what it is
import { StyledReactSelectContainer } from './ReactSelectWrapper.elements.js'
import PropTypes from 'prop-types'

function ReactSelectWrapper({
	variant = 'dark',
	value,
	onChange,
	options,
	isMulti = true,
	isSearchable = false,
	isClearable = false,
	isDisabled = false,
	initialSelectedPredecessors = [], // Parent can define initial predecessors
	...props
}) {
	const [selectedPredecessors, setSelectedPredecessors] = useState(initialSelectedPredecessors)
	const handleSelectChange = selectedOptions => {
		if (onChange) onChange(selectedOptions) // call the parent if it exists
		setSelectedPredecessors(selectedOptions)
	}
	return (
		<StyledReactSelectContainer variant={variant}>
			<ReactSelect
				value={value || selectedPredecessors} // if no value is provided default to selectedPredecessors
				onChange={handleSelectChange}
				options={options}
				isMulti={isMulti}
				isSearchable={isSearchable}
				isClearable={isClearable}
				isDisabled={isDisabled}
				{...props}
			/>
		</StyledReactSelectContainer>
	)
}

ReactSelectWrapper.propTypes = {
	variant: PropTypes.string,
	value: PropTypes.any,
	onChange: PropTypes.func,
	options: PropTypes.arrayOf(PropTypes.object),
	isMulti: PropTypes.bool,
	isSearchable: PropTypes.bool,
	isClearable: PropTypes.bool,
	isDisabled: PropTypes.bool,
	initialSelectedPredecessors: PropTypes.array,
  }

export default ReactSelectWrapper