import { styled } from '@mui/system'

const variantStyle = ({ theme, bg, color, italicBg }) => ({ backgroundColor: bg, color, p: { color }, i: { backgroundColor: italicBg }, 'pan > p, span > svg': { color, fontSize: theme.typography.h4.fontSize, }, })
const taskControlPresets = ({ theme, variant }) => ({
	light: variantStyle({ theme, bg: theme.palette.lightNeutral[50], color: theme.palette.grey[300], italicBg: theme.palette.lightNeutral[200] }),
	dark: variantStyle({ theme, bg: theme.palette.grey[600], color: theme.palette.lightNeutral[50], italicBg: theme.palette.grey[200] }),
}?.[variant])
export const TaskControlContainer = styled('div')(({ theme, variant, maxwidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'column',
	minHeight: theme.spacing(6), width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px 36px 0 0', paddingLeft: theme.spacing(1),
	'svg': { cursor: 'pointer', borderRadius: '50%', '&:hover': { color: theme.palette.primary.main, boxShadow: theme.shadows[3], } },
	...taskControlPresets({ theme, variant })
}))
export const TopContainer = styled('div')(({ theme, maxwidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
	height: theme.spacing(6), width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px 36px 0 0',
	paddingTop: theme.spacing(2), paddingLeft: theme.spacing(3), paddingRight: theme.spacing(3),
	'& > p': { fontSize: theme.typography.h3.fontSize, },
}))
export const BottomContainer = styled('div')(({ theme, maxwidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
	width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px 36px 0 0', paddingLeft: theme.spacing(3), paddingRight: theme.spacing(3),
}))
export const BottomContentContainer = styled('span')(({ theme }) => ({
	display: 'inline-flex', alignItems: 'center', flexDirection: 'row',
	fontSize: theme.typography.h4.fontSize, columnGap: theme.spacing(2), paddingBottom: theme.spacing(2),
}))
export const Separator = styled('i')(({ theme, variant }) => ({ width: '1px', height: theme.typography.h3.fontSize, margin: '0 5px', ...taskControlPresets({ theme, variant }) }))
export const TimePickerContainer = styled('div')(({ theme }) => ({ display: 'flex', columnGap: theme.spacing(2), }))