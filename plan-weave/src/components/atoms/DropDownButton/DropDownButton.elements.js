import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, dropDownButtonPreSets } from '../../../styles/theme.js'

export const DropDownButtonStyled = styled.button`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	column-gap: 10px;
	padding: ${props => props.theme.spaces.small} ${props => props.theme.spaces.small};

    &:hover {
        box-shadow: ${props => props.theme.elevations.small};
      }
    &:active {
        box-shadow: ${props => props.theme.insets.normal};
    }
    ${space} 
    ${layout}
    ${typography}
    ${getPresetCSS(dropDownButtonPreSets, 'size')}
    ${getPresetCSS(dropDownButtonPreSets, 'color')} 
`
