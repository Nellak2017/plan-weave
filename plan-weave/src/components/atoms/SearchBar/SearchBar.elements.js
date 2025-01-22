import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../styles/theme.js'

const variantStyles = ({ bg, color, border }) => css`
  background-color: ${bg};
  color: ${color};
  border: 1px solid ${border}60;
  input {
    color: ${color}60;
    &::placeholder { color: ${color}60;}
    &:hover,&:focus,&:active {
      color: ${color};
      &::placeholder {color: ${color};}
    }
    &:active,&:focus { &::placeholder {color: ${color}00;}}
    &:focus ~ svg, &:hover ~ svg { color: ${color};}
  }
`
const searchBarPreSets = {
  variant: {
    light: variantStyles({ bg: props => props.theme.colors.lightNeutralLight, color: props => props.theme.colors.darkNeutral, border: props => props.theme.colors.lightNeutral}),
    dark: variantStyles({ bg: props => props.theme.colors.lightNeutral, color: props => props.theme.colors.lightNeutralLight, border: props => props.theme.colors.lightNeutralLight}),
  },
}
export const SearchBarStyled = styled.div`
    display: flex;
    justify-content: flex-end; // used instead of flex-start because of sibling selector row-reverse
    align-items: center;
    flex-direction: row-reverse; // used to get around sibling selector limitation
    border-radius: 22px;
    padding: 0 0 0 ${props => props.theme.spaces.small};
    max-width: ${props => props.maxwidth}px;
    &:hover {
      box-shadow: ${props => props.theme.elevations.small};
      border: 1px solid ${props => props.theme.colors.primary};
    }
    svg {
      padding: 0;
      color: #979797; 
    } // Icon color for most cases except dark inactive
    input {
      padding: 0 0 0 ${props => props.theme.spaces.smaller};
      font-size: ${props => props.theme.fontSizes.medium};
      border: none;
      background: none; // This is to simplify the code, just take on bg of parent
      outline: none;
      width: 80%;
      box-shadow: none;
      border-radius: 0;
      &:hover { background: none;}
    }
    ${getPresetCSS(searchBarPreSets, 'variant')} // highest precedence
`