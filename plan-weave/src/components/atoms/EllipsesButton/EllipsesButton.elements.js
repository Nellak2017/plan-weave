import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, ellipsesButtonPreSets } from '../../../styles/theme'

// @Todo: Add variations of padding for all size cases in theme

export const EllipsesButtonStyled = styled.button`
	// --- Common Styles of most button variants ---
	background-color: transparent;
	display: flex;
	padding: 16px 20.5px 32px 20.5px; // Default for medium
	line-height: .5;
	font-size: 32px; // default size if size not given
	&:hover {
      background-color: ${props => props.theme.colors.primaryHover};
    }
    &:active {
      background-color: ${props => props.theme.colors.primaryActive};
    }
	// ---
	${space} 
    ${layout}
    ${typography}
    ${getPresetCSS(ellipsesButtonPreSets, 'size')}
    ${getPresetCSS(ellipsesButtonPreSets, 'color')} // highest precedence
	${getPresetCSS(ellipsesButtonPreSets, 'variant')}
`