import { styled } from "@mui/material"
export const TimePickerWrapperStyled = styled('div')(({ theme }) => ({
	position: 'relative', display: 'inline-flex', columnGap: theme.spacing(2),
	'svg': { borderRadius: '50%', '&:hover': { color: theme.palette.primary.main, boxShadow: theme.shadows[3], } },
	'p, svg': { color: theme.palette.text.primary }
}))
export const TimeClockWrapper = styled('div')(({ theme, $verticalOffset, $showclock }) => ({
	position: 'absolute', top: `calc(100% + ${$verticalOffset + 12}px)`, zIndex: '10',
	borderRadius: `0 0 ${theme.spacing(3)} ${theme.spacing(3)}`, backgroundColor: theme.palette.background.paper,
	width: '211px', height: '211px', transition: 'opacity 0.3s linear', opacity: `${$showclock ? '1' : '0'}`, visibility: `${$showclock ? 'visible' : 'hidden'}`,
	'& > :first-of-type': { // Selects the Clock inside. Styled Clock causes style bugs
		transformOrigin: 'top left', transform: 'scale(.95)', justifyContent: 'center', outline: 'none', '& > :first-of-type': { margin: '0' }, width: '220px!important', // overrides material ui default
	}
}))
export const ClockIconWrapper = styled('div')({ display: 'flex', alignItems: 'center', cursor: 'pointer', })
export const Display = styled('div')(({ theme }) => ({ display: 'inline-flex', alignItems: 'center', columnGap: theme.spacing(2), fontSize: theme.spacing(3), '& > *': { fontSize: theme.spacing(3), }}))