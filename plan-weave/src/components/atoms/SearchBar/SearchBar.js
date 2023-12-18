import React, { useState } from 'react'
import { SearchBarStyled } from './SearchBar.elements'
import { MdSearch } from 'react-icons/md'
import { THEMES } from '../../utils/constants'
import store from '../../../redux/store.js' // temporary only
import { createTaskEditorServices } from '../../../services/PlanWeavePage/TaskEditorServices' // temporary only

// Icon is placed AFTER input but displayed before 
// because of ~ sibling selector limitations (SMH)
function SearchBar({ variant, placeholder = "Search for a Task", maxwidth = 240, tabIndex, onChange, ...rest }) {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const services = createTaskEditorServices(store) // temporary only
	const [searchValue, setSearchValue] = useState('')

	const handleSearchChange = (event) => {
		const newValue = event.target.value.trimStart() // remove left whitespace
		services?.taskControl?.search(newValue) // temporary only
		setSearchValue(newValue)
		// Call the onChange function from props to pass the value to the parent
		if (onChange) onChange(newValue)
	}

	return (
		<SearchBarStyled variant={variant} maxwidth={maxwidth} {...rest}>
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

export default SearchBar