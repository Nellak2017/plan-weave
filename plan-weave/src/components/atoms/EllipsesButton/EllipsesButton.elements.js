import styled, { css } from 'styled-components'
import { getPresetCSS, colorPreset } from '../../styles/theme.js'

const ellipsesButtonPreSets = {
	variant: {
		light: css`
			color: ${props => props.theme.colors.lightNeutral};
			&:hover { color: ${props => props.theme.colors.lightNeutralLightHover};}
			&:active { color: ${props => props.theme.colors.primaryActive};}
	  `,
		dark: css`color: ${props => props.theme.colors.lightNeutralLight};`
	},
	size: { // Note: spaces is used for font sizes because it is supposed to be an 'Icon'
		xs: css`
			padding: 4px 5.1px 8px 5.1px; // Default for extra small, 16 x 16
			font-size: ${props => props.theme.spaces.small};
		`,
		s: css`
			padding: 8px 10.25px 16px 10.25px; // Default for small, 32 x 32
			font-size: ${props => props.theme.spaces.medium};
		`,
		m: css`
			padding: 16px 20.5px 32px 20.5px; // Default for medium, 64 x 64
			font-size: ${props => props.theme.spaces.large};
		`,
		l: css`
			padding: 22px 29.75px 48px 29.75px; // Default for large, 94 x 94
			font-size: ${props => props.theme.spaces.larger};
		`,
		xl: css`
			padding: 28px 43.75px 72px 43.75px; // Default for large, 128 x 128
			font-size: ${props => props.theme.spaces.extraLarge};
		`
	},
	color: colorPreset
}

export const EllipsesButtonStyled = styled.button`
	background-color: transparent;
	display: flex;
	padding: 16px 20.5px 32px 20.5px; // Default for medium
	line-height: .5;
	font-size: ${props => props.theme.spaces.large};// default size if size not given
	&:hover { background-color: ${props => props.theme.colors.primaryHover};}
    &:active { background-color: ${props => props.theme.colors.primaryActive};}
    ${getPresetCSS(ellipsesButtonPreSets, 'size')}
    ${getPresetCSS(ellipsesButtonPreSets, 'color')} 
	${getPresetCSS(ellipsesButtonPreSets, 'variant')}
`