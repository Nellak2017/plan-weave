import styled, { css } from 'styled-components'
import { getPresetCSS, colorPreset } from '../../styles/theme.js'

const dropDownButtonPreSets = { // normal medium, but small default
  size: {
    xs: css`
      padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.smaller};
      border-radius: ${props => props.theme.spaces.small};
      font-size: ${props => props.theme.fontSizes.extraSmall};
    `,
    s: css`
      padding: ${props => props.theme.spaces.small} ${props => props.theme.spaces.small};
      font-size: ${props => props.theme.fontSizes.smaller};
    `,
    m: css`
      padding: ${props => props.theme.spaces.medium} ${props => props.theme.spaces.medium};
      font-size: ${props => props.theme.fontSizes.medium};
    `,
    l: css`
      padding: ${props => props.theme.spaces.large} ${props => props.theme.spaces.large};
      font-size: ${props => props.theme.fontSizes.large};
    `,
    xl: css`
      padding: ${props => props.theme.spaces.larger} ${props => props.theme.spaces.larger};
      font-size: ${props => props.theme.fontSizes.larger};
    `
  },
  color: colorPreset,
}

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
    &:hover { box-shadow: ${props => props.theme.elevations.small};}
    &:active { box-shadow: ${props => props.theme.insets.normal};}
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
  z-index: 999; // be above all other stuff
`;

// Styled component for dropdown menu items
export const DropdownMenuItem = styled.li`
  display: ${props => (props.open ? 'block' : 'none')};
  cursor: pointer;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.lightNeutralLight};
  color: ${props => props.theme.colors.lightNeutral};
  &:hover { background-color: ${props => props.theme.colors.lightNeutralLightHover};}
  &:active { background-color: ${props => props.theme.colors.lightNeutralLightActive};}
`;