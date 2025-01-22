import styled from 'styled-components'
import { getPresetCSS, taskInputPreSets } from '../../styles/theme.js'

export const TaskInputStyled = styled.input`
	outline: 1px solid ${props => props.theme.colors.lightNeutralLight};
	border-radius: 10px;
	font-size: ${props => props.theme.fontSizes.medium};
	font-family: var(--font-poppins), sans-serif;
	padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.small};
	width: 100%;
	max-width: ${props => (props.maxwidth ? props.maxwidth+'px' : '100%')};
	background: none;
	&:hover {
		outline-color: ${props => props.theme.colors.primary};
		background: none;
	}
	${getPresetCSS(taskInputPreSets, 'variant')} 
`;