import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import {
	getPresetCSS,
	timePickerPresets,
} from '../../../styles/theme'
import { TimeClock } from '@mui/x-date-pickers'

export const ClockStyled = styled(TimeClock)`
	transform-origin: top left;
    transform: scale(.95); /* Adjust the scale as needed */
    display: block;
    &.css-1m3ruz6-MuiTimeClock-root {
      flex-direction: row;
      justify-content: flex-start;
	  width: 220px;
    }
    .css-1j9v0by-MuiClock-root {
      margin: 0; 
    }
	width: 150px;
	outline: none;
`

export const TimePickerWrapperStyled = styled.div`
	position: relative;
	display: inline-flex;
	column-gap: ${props => props.theme.spaces.small};
	svg {
        border-radius: 50%;
        &:hover {
          color: ${props => props.theme.colors.primary};
          box-shadow: ${props => props.theme.elevations.small};
        }
      }
	${getPresetCSS(timePickerPresets, 'variant')};
`
export const TimeClockWrapper = styled.div`
	position: absolute;
	top: calc(100% + ${props => props.$verticalOffset + 12}px);
	left: ${props => props.$horizontalOffset}px;
	z-index: 10;
	border-radius: 0 0 ${props => props.theme.spaces.medium} ${props => props.theme.spaces.medium};
	background-color: ${props => props.theme.colors.lightNeutralLight};
	width: 211px; /* Adjust the width as needed */
	height: 211px;

	transition: opacity 0.3s linear;
	opacity: ${props => (props.$showclock ? '1' : '0')};
	visibility: ${props => (props.$showclock ? 'visible' : 'hidden')};
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