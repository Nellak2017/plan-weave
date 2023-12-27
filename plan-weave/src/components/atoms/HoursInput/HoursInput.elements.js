import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import {
	getPresetCSS,
	taskInputPreSets,
	hoursInputContainerPreSets
} from '../../../styles/theme'

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

	// Switch based on size
	//font-size: 28px;
	//height: 48px;

	${space};
	${layout};
	${typography};
	${getPresetCSS(taskInputPreSets, 'variant')};
	${getPresetCSS(taskInputPreSets, 'color')};
`

export const HoursContainer = styled.section`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	column-gap: ${props => props.theme.spaces.smaller};

	// Switch based on size
	//height: 48px; // Switch based on size

	${getPresetCSS(hoursInputContainerPreSets, 'variant')};
	${getPresetCSS(taskInputPreSets, 'color')};
`




