import { SearchBarStyled } from './SearchBar.elements'
import { MdSearch } from 'react-icons/md'
import { TASKEDITOR_SEARCH_PLACEHOLDER, TASK_NAME_MAX_LENGTH } from '../../../Core/utils/constants.js'

export const SearchBar = ({
	state: { maxwidth = 240, maxLength = TASK_NAME_MAX_LENGTH, placeholder = TASKEDITOR_SEARCH_PLACEHOLDER } = {},
	services: { search } = {}, ...rest
}) => ( // Icon is placed AFTER input but displayed before because of ~ sibling selector limitations (SMH) services = {search}
	<SearchBarStyled maxwidth={maxwidth}>
		<input type="text" placeholder={placeholder} onChange={e => search?.({ value: e.target.value.trimStart() })} maxLength={maxLength} {...rest} />
		<MdSearch size={32} />
	</SearchBarStyled>)
export default SearchBar