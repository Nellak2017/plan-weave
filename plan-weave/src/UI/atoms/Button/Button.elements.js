import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../styles/theme.js'

const overlay = ({ bg, hover, active }) => css`
    background-color: ${bg};
    &:hover { background-color: ${hover};}
    &:active { background-color: ${active};}
`
const buttonPreSets = {
    variant: {
        standardButton: css``,
        newTask: css`
            padding-left: ${props => props.theme.spaces.small};
            padding-right: ${props => props.theme.spaces.small};
            ${overlay({ bg: props => props.theme.colors.successDark, hover: props => props.theme.colors.successHover, active: props => props.theme.colors.successActive })}
        `,
        delete: css`${overlay({ bg: props => props.theme.colors.danger, hover: props => props.theme.colors.dangerHover, active: props => props.theme.colors.dangerActive })}`
    },
    size: {
        xs: css`
            padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.smaller};
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
}

export const ButtonStyled = styled.button`
	color: #fff;
    min-width: 85px; // I want all buttons, standard width
	outline: none;
    outline: 0px solid transparent;
    border-radius: ${props => props.theme.spaces.small};
    padding: ${props => props.theme.spaces.small} ${props => props.theme.spaces.small};
    &:hover { box-shadow: ${props => props.theme.elevations.small};}
	&:active { box-shadow: ${props => props.theme.insets.normal};}
    &:focus { outline: 2px solid white;}
    ${getPresetCSS(buttonPreSets, 'variant')}
    ${getPresetCSS(buttonPreSets, 'size')}
`