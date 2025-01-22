import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../styles/theme.js'

const timePickerPresets = {
	variant: {
		light: css`p, svg { color: ${props => props.theme.colors.darkNeutralDark};}`,
		dark: css`p, svg { color: ${props => props.theme.colors.lightNeutralLight};}`
	}
}
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
	& > :first-child { // Selects the Clock inside. Styled Clock causes style bugs
		transform-origin: top left;
		transform: scale(.95); 
		justify-content: center;
		width: 220px!important; // overrides material ui default
		outline: none;		
		& > :first-child { margin: 0;}
	}
`
TimeClockWrapper.displayName = 'TimeClockWrapper' // https://javascript.plainenglish.io/test-styled-components-in-react-efficiently-using-displayname-53281a0c1f2d
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
	& > * { font-size: ${props => props.theme.fontSizes.medium};} 
`