import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, buttonPreSets } from '../../../styles/theme'

export const ButtonStyled = styled.button`
	// --- Common styles of most button variants ---
	color: #fff;
    min-width: 85px; // I want all buttons, standard width
	outline: none;
    outline: 0px solid transparent;
    border-radius: ${props => props.theme.spaces.small};
    padding: ${props => props.theme.spaces.small} ${props => props.theme.spaces.small};
    &:hover {
        box-shadow: ${props => props.theme.elevations.small};
      }
	&:active {
        box-shadow: ${props => props.theme.insets.normal};
    }
    // ------ 
    ${space} // lowest precedence
    ${layout}
    ${typography}
    ${getPresetCSS(buttonPreSets, 'variant')}
    ${getPresetCSS(buttonPreSets, 'size')}
    ${getPresetCSS(buttonPreSets, 'color')} // highest precedence
`