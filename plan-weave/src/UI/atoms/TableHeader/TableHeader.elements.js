import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../styles/theme.js'

const variantStyles = ({ bg, color }) => css`
	background-color: ${bg};
	color: ${color};
`
const tableHeaderPresets = {
	variant: {
		light: variantStyles({ bg: props => props.theme.colors.lightNeutralLight, color: props => props.theme.colors.darkNeutralDark }),
		dark: variantStyles({ bg: props => props.theme.colors.lightNeutral, color: props => props.theme.colors.lightNeutralLight }),
	},
}

export const TableHeaderContainer = styled.th` // This is here in case we need custom styles for this
  	${getPresetCSS(tableHeaderPresets, 'variant')};
`

export const StyledRow = styled.tr`
	:nth-child(1), :nth-child(2) {
    	width: 5px; /* You can adjust the value to make them skinnier */
		padding: ${props => props.theme.spaces.smaller};
  	}
	${getPresetCSS(tableHeaderPresets, 'variant')};
`