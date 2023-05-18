import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import {
	getPresetCSS,
	taskInputPreSets,
	hoursInputContainerPreSets
} from '../../../styles/theme'

export const HoursInputStyled = styled.input`
	outline: 1px solid ${props => props.theme.colors.lightNeutralLight};
	border-radius: 10px;
	font-size: ${props => props.theme.fontSizes.smaller};
	padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.small};
	width: 100%;
	max-width: ${props => (props.maxwidth ? props.maxwidth + 'px' : '100%')};
	background: none;
	&:hover {
		outline-color: ${props => props.theme.colors.primary};
		background: none;
	};

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
	${getPresetCSS(hoursInputContainerPreSets, 'variant')};
	${getPresetCSS(taskInputPreSets, 'color')};
`




