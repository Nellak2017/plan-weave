import React, { useState } from 'react'
import { SearchBarStyled } from './SearchBar.elements'
import { MdSearch } from 'react-icons/md'
import { THEMES, VARIANTS, TASKEDITOR_SEARCH_PLACEHOLDER } from '../../utils/constants'
import PropTypes from 'prop-types'

// Icon is placed AFTER input but displayed before 
// because of ~ sibling selector limitations (SMH)
// services = {search}
function SearchBar({
	services,
	variant = VARIANTS[0],
	placeholder = TASKEDITOR_SEARCH_PLACEHOLDER,
	maxwidth = 240,
	tabIndex,
	onChange,
	...rest }) {

	const processedVariant = (variant && !THEMES.includes(variant)) ? VARIANTS[0] : variant
	const [searchValue, setSearchValue] = useState('')

	const handleSearchChange = e => {
		const newValue = e.target.value.trimStart() // remove left whitespace
		services?.search(newValue)
		setSearchValue(newValue)
		// Call the onChange function from props to pass the value to the parent
		if (onChange) onChange(newValue)
	}

	return (
		<SearchBarStyled variant={processedVariant} maxwidth={maxwidth} {...rest}>
			<input
				tabIndex={tabIndex}
				type="text"
				placeholder={placeholder}
				value={searchValue}
				onChange={handleSearchChange}
			/>
			<MdSearch size={32} />
		</SearchBarStyled>
	)
}

SearchBar.propTypes = {
	services: PropTypes.object,
	variant: PropTypes.oneOf(VARIANTS),
	placeholder: PropTypes.string,
	maxwidth: PropTypes.number,
	tabIndex: PropTypes.number,
	onChange: PropTypes.func,
}

export default SearchBar