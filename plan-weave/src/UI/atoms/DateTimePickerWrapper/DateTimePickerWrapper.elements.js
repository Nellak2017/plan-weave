import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../styles/theme.js'

const variantStyle = ({ color, hoverColor, hoverBg }) => css`
	& svg, input, label { color: ${color};}
	& input:hover, div:hover {
		color: ${hoverColor};
		background: ${hoverBg};
	}
`
const dateTimePickerPresets = {
	variant: {
		light: variantStyle({ color: props => props.theme.colors.darkNeutralDark, hoverColor: props => props.theme.colors.darkNeutralDark, hoverBg: props => props.theme.colors.lightNeutralLight}),
		dark: variantStyle({ color: props => props.theme.colors.lightNeutralLight, hoverColor: props => props.theme.colors.lightNeutralLight, hoverBg: props => props.theme.colors.darkNeutralHover}),
	},
}

export const PickerContainer = styled.div`
	margin: 0px;
	border: 0px solid transparent;
	& div { border-radius: ${props => props.theme.spaces.small};}
	input {
		border: 0px solid transparent;
		box-shadow: none;
		border-radius: 0px;
		padding-top: ${props => props.theme.spaces.smaller};
		padding-bottom: ${props => props.theme.spaces.smaller};
	} 
	& svg:hover { color: ${props => props.theme.colors.primary};}
	${getPresetCSS(dateTimePickerPresets, 'variant')};
`