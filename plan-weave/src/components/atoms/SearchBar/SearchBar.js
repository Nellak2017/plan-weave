import React from 'react'
import { SearchBarStyled } from './SearchBar.elements'
import { MdSearch } from 'react-icons/md'
import { THEMES } from '../../utils/constants'

// Icon is placed AFTER input but displayed before 
// because of ~ sibling selector limitations (SMH)
function SearchBar({ variant, placeholder="Search for a Task", maxwidth=240, tabIndex, ...rest }) {
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	return (
		<SearchBarStyled variant={variant} maxwidth={maxwidth} {...rest}>
			<input tabIndex={tabIndex} type="text" placeholder={placeholder} />
			<MdSearch size={32} />
		</SearchBarStyled>
	)
}

export default SearchBar