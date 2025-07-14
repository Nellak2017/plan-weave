import { styled } from '@mui/system'

export const TaskControlContainer = styled('div')(({ theme, maxwidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'column',
	minHeight: theme.spacing(6), width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px 36px 0 0', paddingLeft: theme.spacing(1),
	'svg': { cursor: 'pointer', borderRadius: '50%', '&:hover': { color: theme.palette.primary.main, boxShadow: theme.shadows[3], } },
	backgroundColor: theme.palette.background.paperBackground, color: theme.palette.text.primary,
	'p, i': { color: theme.palette.text.primary, },
	'span > p, span > svg': { color: theme.palette.text.primary, fontSize: theme.typography.body1.fontSize, },
}))
export const TopContainer = styled('div')(({ theme, maxwidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
	height: theme.spacing(6), width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px 36px 0 0',
	paddingTop: theme.spacing(2), paddingLeft: theme.spacing(3), paddingRight: theme.spacing(3),
	'& > p': { fontSize: theme.typography.h3.fontSize, },
	[theme.breakpoints.down('sm')]: { justifyContent: 'center' }
}))
export const BottomContainer = styled('div')(({ theme, maxwidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
	width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px 36px 0 0', paddingLeft: theme.spacing(3), paddingRight: theme.spacing(3),
	[theme.breakpoints.down('sm')]: { justifyContent: 'center', columnGap: theme.spacing(4) }
}))
export const BottomContentContainer = styled('span')(({ theme }) => ({ display: 'inline-flex', alignItems: 'center', flexDirection: 'row', columnGap: theme.spacing(2), fontSize: theme.typography.h4.fontSize, paddingBottom: theme.spacing(2), }))
export const Separator = styled('i')(({ theme }) => ({ width: '1px', height: theme.typography.h3.fontSize, margin: `0 ${theme.spacing(1)}`, backgroundColor: theme.palette.text.primary, }))
export const TimePickerContainer = styled('div')(({ theme }) => ({ display: 'flex', columnGap: theme.spacing(2), marginLeft: theme.spacing(5)})) /* marginLeft added since the start time was removed, it is not maintainable but an easy fix */