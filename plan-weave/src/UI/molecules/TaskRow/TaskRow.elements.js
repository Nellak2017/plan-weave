import { MdDragIndicator } from 'react-icons/md'
import { styled } from '@mui/system'

const commonOverlayStyles = { content: "''", position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '1', pointerEvents: 'none', }
const tdStyle = color => ({ '& > td': { position: 'relative', '&::before': { backgroundColor: `${color}70`, ...commonOverlayStyles, } } })
const variantStyle = ({ bg, color }) => ({ backgroundColor: bg, color, 'p, svg': { color, } })
const getVariantStyles = ({ theme, variant }) => ({
	light: variantStyle({ bg: theme.palette.lightNeutral[50], color: theme.palette.grey[600] }),
	dark: variantStyle({ bg: theme.palette.lightNeutral[300], color: theme.palette.lightNeutral[50] }),
}?.[variant])
const getStatusStyles = ({ theme, status }) => ({ completed: tdStyle(theme.palette.success.main), incomplete: tdStyle(), waiting: tdStyle(theme.palette.warning.main), inconsistent: tdStyle(theme.palette.error.main), }?.[status])
const getHighlightStyles = ({ theme, highlight }) => ({ old: tdStyle(theme.palette.lightNeutral[300]), selected: { outline: `1px solid ${theme.palette.lightNeutral[50]}` } }?.[highlight])
export const TaskRowStyled = styled('tr')(({ theme, variant, status, highlight }) => ({
	...getVariantStyles({ theme, variant }), ...getStatusStyles({ theme, status }), ...getHighlightStyles({ theme, highlight }), /* intended to gray out old tasks if old prop ='old' */
	'* > svg:hover': { cursor: 'pointer', color: theme.palette.primary.main, },
	td: { display: 'table-cell', verticalAlign: 'middle', svg: { verticalAlign: 'middle' }, }
}))
export const DragIndicator = styled(MdDragIndicator)(({ theme }) => ({ '&:hover': { cursor: 'grab!important', color: theme.palette.primary.main, } }))
// Containers
export const TaskContainer = styled('td')(({ theme }) => ({
	width: '375px', padding: theme.spacing(2),
	input: { verticalAlign: 'middle', minWidth: '200px', maxWidth: '360px', width: '100%', },
	'p, pre': { fontSize: theme.typography.h4.fontSize, },
}))
export const WasteContainer = styled('td')(({ theme }) => ({
	padding: theme.spacing(2), maxWidth: '170px', minWidth: '100px', textAlign: 'left',
	input: { minWidth: '40px', },
	'p, pre': { fontSize: theme.typography.h4.fontSize, },
}))
export const TimeContainer = styled('td')(({ theme }) => ({
	padding: theme.spacing(2), maxWidth: '200px', minWidth: '100px', textAlign: 'left',
	input: { width: '40px', paddingLeft: '0', paddingRight: '0', },
	'p, pre': { fontSize: theme.spacing(3) },
}))
export const IconContainer = styled('td')(() => ({}))
export const TrashContainer = styled('td')(() => ({ paddingRight: '5px', }))
export const DragContainer = styled('td')(() => ({ paddingLeft: '0px', maxWidth: '32px', }))
// Full Task Exclusives
export const EfficiencyContainer = styled('td')(({ theme }) => ({
	width: '50px', fontSize: theme.typography.h4.fontSize,
	'& p': { display: 'inline-flex', width: '100%', alignItems: 'center', justifyContent: 'center', }
}))
export const DueContainer = styled('td')(({ theme }) => ({ minWidth: '160px', padding: theme.spacing(2), input: { width: '160px', }, }))
export const WeightContainer = styled('td')(({ theme }) => ({ paddingLeft: '25px', padding: theme.spacing(2), input: { width: '40px', paddingLeft: '0', paddingRight: '0', }, }))
export const ThreadContainer = styled('td')(({ theme }) => ({ padding: theme.spacing(2) }))
export const DependencyContainer = styled('td')(({ theme }) => ({
	padding: theme.spacing(2),
	'& > div': { width: '100%' },
	'.css-3w2yfm-ValueContainer': {
		WebkitFlexWrap: 'nowrap', flexWrap: 'nowrap', columnGap: '5px',
		paddingRight: '45px', maxWidth: '370px', width: '100%',
		overflowX: 'auto', overflowY: 'hidden',
		div: { flex: 'none', }
	}
}))