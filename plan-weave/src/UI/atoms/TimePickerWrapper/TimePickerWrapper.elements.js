import { styled } from "@mui/material"
// TODO: Change $ to regular names
// TODO: Use theme for all 
const timePickerPresets = ({ theme, variant }) => ({
	light: { 'p, svg': { color: 'black' } }, // `${theme.colors.darkNeutralDark}`
	dark: { 'p, svg': { color: 'white' } }, // `${theme.colors.lightNeutralLight}`
}?.[variant])
export const TimePickerWrapperStyled = styled('div')(({ theme, variant }) => ({
	position: 'relative', display: 'inline-flex',
	columnGap: '8px', // ${props => props.theme.spaces.small}
	'svg': { borderRadius: '50%', '&:hover': { color: theme.palette.primary.main, boxShadow: theme.shadows[3], } },
	...timePickerPresets({ theme, variant })
}))
export const TimeClockWrapper = styled('div')(({ theme, variant, $verticalOffset, $showclock }) => ({
	position: 'absolute',
	top: `calc(100% + ${$verticalOffset + 12}px)`,
	left: '${props => props.$horizontalOffset}px',
	zIndex: '10',
	borderRadius: '0 0 16px 16px', // spaces medium
	backgroundColor: 'white', // ${props => props.theme.colors.lightNeutralLight}
	width: '211px', height: '211px', transition: 'opacity 0.3s linear',
	opacity: `${$showclock ? '1' : '0'}`, visibility: `${$showclock ? 'visible' : 'hidden'}`,
	'& > :first-of-type': { // Selects the Clock inside. Styled Clock causes style bugs
		transformOrigin: 'top left', transform: 'scale(.95)', justifyContent: 'center',
		width: '220px!important', // overrides material ui default
		outline: 'none', '& > :first-of-type': { margin: '0' }
	}
}))
export const ClockIconWrapper = styled('div')({ display: 'flex', alignItems: 'center', cursor: 'pointer', })
export const Display = styled('div')(({ theme }) => ({
	display: 'inline-flex', alignItems: 'center',
	columnGap: '8px', // ${props => props.theme.spaces.small}
	fontSize: '16px', // ${props => props.theme.fontSizes.medium}
	'& > *': { fontSize: '16px', } // ${props => props.theme.fontSizes.medium}
}))