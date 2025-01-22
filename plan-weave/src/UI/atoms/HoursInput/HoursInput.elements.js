import styled from 'styled-components'
import { getPresetCSS, taskInputPreSets } from '../../styles/theme.js' 

// TODO: Add switch based on size in the theme.js
export const HoursInputStyled = styled.input`
	outline: 1px solid ${props => props.theme.colors.lightNeutralLight};
	line-height: 25px;
	text-align: center;
	font-family: var(--font-poppins), sans-serif;
	border-radius: 10px;
	font-size: ${props => props.theme.fontSizes.small};
	padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.small};
	width: 100%;
	max-width: ${props => (props.maxwidth ? props.maxwidth + 'px' : '100%')};
	background: none;
	&:hover {
		outline-color: ${props => props.theme.colors.primary};
		background: none;
	};
	${getPresetCSS(taskInputPreSets, 'variant')};
	${getPresetCSS(taskInputPreSets, 'color')};
`

export const HoursContainer = styled.section`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	column-gap: ${props => props.theme.spaces.smaller};
	${getPresetCSS(taskInputPreSets, 'variant')};
	${getPresetCSS(taskInputPreSets, 'color')};
`




