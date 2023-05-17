import React from 'react'
import { SearchBarStyled } from './SearchBar.elements'
import { MdSearch } from 'react-icons/md'

// Icon is placed AFTER input but displayed before 
// because of ~ sibling selector limitations (SMH)
function SearchBar(props) {
	const { variant, maxwidth=240, ...rest } = props
	return (
		<SearchBarStyled variant={variant} maxwidth={maxwidth} {...rest}>
			<input type="text" placeholder="Search for a Task" />
			<MdSearch size={32} />
		</SearchBarStyled>
	)
}

export default SearchBar