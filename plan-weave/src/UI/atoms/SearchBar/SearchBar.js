import { SearchBarStyled } from './SearchBar.elements'
import { MdSearch } from 'react-icons/md'
import { VARIANTS, TASKEDITOR_SEARCH_PLACEHOLDER } from '../../../Core/utils/constants.js'

export const SearchBar = ({
	state: { variant = VARIANTS[0], maxwidth = 240, placeholder = TASKEDITOR_SEARCH_PLACEHOLDER } = {},
	services: { search } = {}, ...rest
}) => ( // Icon is placed AFTER input but displayed before because of ~ sibling selector limitations (SMH) services = {search}
	<SearchBarStyled variant={variant} maxwidth={maxwidth} {...rest}>
		<input type="text" placeholder={placeholder} onChange={e => search(e.target.value.trimStart())} {...rest} />
		<MdSearch size={32} />
	</SearchBarStyled>)
export default SearchBar