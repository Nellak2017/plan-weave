import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, nextButtonPreSets } from '../../../styles/theme'

export const NextButtonStyled = styled.button`
	// --- Common Styles of most button variants ---
	border-radius: 50%; // This makes it a circle shape
	display: flex;

	padding: 0;

	// Todo: Add code to fix the look of this Component
	&:hover {
        box-shadow: ${props => props.theme.elevations.small};
      }
	&:active {
        box-shadow: ${props => props.theme.insets.normal};
    }
	// ---
	${space} // lowest precedence
    ${layout}
    ${typography}
    ${getPresetCSS(nextButtonPreSets, 'variant')}
    ${getPresetCSS(nextButtonPreSets, 'size')}
    ${getPresetCSS(nextButtonPreSets, 'color')} // highest precedence
`