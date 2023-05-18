import React from 'react'
import { SearchBarStyled } from './SearchBar.elements'
import { MdSearch } from 'react-icons/md'

// Icon is placed AFTER input but displayed before 
// because of ~ sibling selector limitations (SMH)
function SearchBar(props) {
	const { variant, placeholder="Search for a Task", maxwidth=240, ...rest } = props
	return (
		<SearchBarStyled variant={variant} maxwidth={maxwidth} {...rest}>
			<input type="text" placeholder={placeholder} />
			<MdSearch size={32} />
		</SearchBarStyled>
	)
}

export default SearchBar