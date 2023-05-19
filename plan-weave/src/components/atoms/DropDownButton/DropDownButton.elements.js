import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, dropDownButtonPreSets } from '../../../styles/theme.js'

// Styled component for the dropdown button
export const DropDownButtonStyled = styled.button`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    column-gap: 10px;
    max-height: 32px;
    max-width: 150px;
    /* Apply ellipsis for text overflow */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
// Styled component for the dropdown relative container
export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Styled component for the dropdown menu
export const DropdownMenu = styled.ul`
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  display: ${props => (props.open ? 'block' : 'none')};
`;

// Styled component for dropdown menu items
export const DropdownMenuItem = styled.li`
  display: ${props => props.open} ? block : none;
  cursor: pointer;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.lightNeutralLight};
  color: ${props => props.theme.colors.lightNeutral};
  &:hover {
    background-color: ${props => props.theme.colors.lightNeutralLightHover};
  }
  &:active {
    background-color: ${props => props.theme.colors.lightNeutralLightActive};
  }
`;
