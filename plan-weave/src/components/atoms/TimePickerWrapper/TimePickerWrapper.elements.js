import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import {
	getPresetCSS,
	taskInputPreSets,
	hoursInputContainerPreSets
} from '../../../styles/theme'
import { TimeClock } from '@mui/x-date-pickers'

export const ClockStyled = styled(TimeClock)`
	transform-origin: top left;
    transform: scale(.95); /* Adjust the scale as needed */
    display: block;
    &.css-1m3ruz6-MuiTimeClock-root {
      flex-direction: row;
      justify-content: flex-start;
    }
    .css-1j9v0by-MuiClock-root {
      margin: 0; 
    }
`

export const TimePickerWrapperStyled = styled.div`
	position: relative;
	display: inline-flex;
	column-gap: ${props => props.theme.spaces.small};
`
export const TimeClockWrapper = styled.div`
	position: absolute;
	top: calc(100% + 12px);
	left: 0;
	z-index: 1;
	border-radius: 0 0 ${props => props.theme.spaces.medium} ${props => props.theme.spaces.medium};
	background-color: ${props => props.theme.colors.lightNeutralLight};
	width: 211px; /* Adjust the width as needed */
	height: 211px;

	//display: none;

`

export const ClockIconWrapper = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;

`


export const Display = styled.div`
	display: inline-flex;
	align-items: center;
	column-gap: ${props => props.theme.spaces.small};
	font-size: ${props => props.theme.fontSizes.medium};
	& > * {
		font-size: ${props => props.theme.fontSizes.medium};
	} 
`