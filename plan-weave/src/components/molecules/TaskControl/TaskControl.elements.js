import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, taskControlPresets } from '../../../styles/theme'

// TODO: Fix sizing prop. It needs to switch based on xs,s,m, l,.. not custom px values
// TODO: Add Size switch
export const TaskControlContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	flex-direction: column;
	min-height: ${props => props.theme.spaces.extraLarge};
	width: 100%;
	max-width: ${props => props.maxwidth}px;
	border-radius: 36px 36px 0 0;
	padding-left: ${props => props.theme.spaces.smaller};
	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskControlPresets, 'variant')};
	${getPresetCSS(taskControlPresets, 'color')};
	svg {
		cursor: pointer;
		border-radius: 50%;
		&:hover {
			color: ${props => props.theme.colors.primary};
          	box-shadow: ${props => props.theme.elevations.small};
		}
	}
`

export const TopContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: row;
	height: ${props => props.theme.spaces.extraLarge};
	width: 100%;
	max-width: ${props => props.maxwidth}px;
	border-radius: 36px 36px 0 0;
	padding-top: ${props => props.theme.spaces.small};
	padding-left: ${props => props.theme.spaces.medium};
	padding-right: ${props => props.theme.spaces.medium};
	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskControlPresets, 'variant')};
	${getPresetCSS(taskControlPresets, 'color')};

	& > p {
		font-size: ${props => props.theme.fontSizes.large};
	}
`

export const BottomContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: row;
	width: 100%;
	max-width: ${props => props.maxwidth}px;
	border-radius: 36px 36px 0 0;
	padding-left: ${props => props.theme.spaces.medium};
	padding-right: ${props => props.theme.spaces.medium};
	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskControlPresets, 'variant')};
	${getPresetCSS(taskControlPresets, 'color')};
`

export const BottomContentContainer = styled.span`
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	font-size: ${props => props.theme.fontSizes.medium};
	column-gap: ${props => props.theme.spaces.small};
	padding-bottom: ${props => props.theme.spaces.small};
`

export const Separator = styled.i`
	width: 1px;
	height: ${props => props.theme.fontSizes.large}; 
	margin: 0 5px;
	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskControlPresets, 'variant')};
	${getPresetCSS(taskControlPresets, 'color')}; 
`;

export const TimePickerContainer = styled.div`
	display: flex;
	column-gap: 8px;
`