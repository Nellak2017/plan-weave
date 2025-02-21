import { MdDragIndicator } from 'react-icons/md'
import { styled } from '@mui/system'

const commonOverlayStyles = { content: '', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '1', pointerEvents: 'none', }
const tdStyle = color => ({
	'td': {
		position: 'relative',
		'&::before': { backgroundColor: `${color}70`, ...commonOverlayStyles, }
	}
})
const variantStyle = ({ bg, color }) => ({ backgroundColor: bg, color, 'p, svg': { color, } })
const getVariantStyles = variant => ({
	light: variantStyle({ bg: '#eeedee', color: '#2b252c' }), //variantStyle({ bg: props => props.theme.colors.lightNeutralLight, color: props => props.theme.colors.darkNeutralDark }),
	dark: variantStyle({ bg: '#504651', color: '#eeedee' }), //variantStyle({ bg: props => props.theme.colors.lightNeutral, color: props => props.theme.colors.lightNeutralLight }),
}?.[variant])
const getStatusStyles = status => ({
	completed: tdStyle('#80de71'),// tdStyle(props => props.theme.colors.success),
	incomplete: tdStyle(),
	waiting: tdStyle('#e8bb79'),//tdStyle(props => props.theme.colors.warning),
	inconsistent: tdStyle('#d64444'),//tdStyle(props => props.theme.colors.danger),
}?.[status])
const getHighlightStyles = highlight => ({
	old: tdStyle('#504651'), //tdStyle(props => props.theme.colors.lightNeutral),
	selected: { outline: `1px solid #eeedee` } // ${props => props.theme.colors.lightNeutralLight}
}?.[highlight])
export const TaskRowStyled = styled('tr')(({ theme, variant, status, highlight }) => ({
	...getVariantStyles(variant),
	...getStatusStyles(status),
	...getHighlightStyles(highlight), // intended to gray out old tasks if old prop ='old'
	'* > svg:hover': { cursor: 'pointer', color: theme.palette.primary.main, },
	td: { display: 'table-cell', verticalAlign: 'middle', svg: { verticalAlign: 'middle' }, }
}))
export const DragIndicator = styled(MdDragIndicator)(({ theme }) => ({ '&:hover': { cursor: 'grab!important', color: theme.palette.primary.main, } }))
// Containers
export const TaskContainer = styled('td')(({ theme }) => ({
	width: '375px',
	padding: '8px', // ${props => props.theme.spaces.small}
	'p, pre': { fontSize: '16px', }, // ${props => props.theme.fontSizes.medium}
	input: { verticalAlign: 'middle', minWidth: '200px', maxWidth: '360px', width: '100%', }
}))
export const WasteContainer = styled('td')(({ theme }) => ({
	padding: '8px',//${props => props.theme.spaces.small};
	maxWidth: '170px', minWidth: '100px', textAlign: 'left',
	input: { minWidth: '40px', },
	'p, pre': { fontSize: '16px', }, // ${props => props.theme.fontSizes.medium}
}))
export const TimeContainer = styled('td')(({ theme }) => ({
	padding: '8px', //${props => props.theme.spaces.small};
	maxWidth: '200px', minWidth: '100px', textAlign: 'left',
	input: { width: '40px', paddingLeft: '0', paddingRight: '0', },
	'p, pre': { fontSize: '16px' },//${ props => props.theme.fontSizes.medium};
}))
export const IconContainer = styled('td')(() => ({}))
export const TrashContainer = styled('td')(() => ({ paddingRight: '5px', }))
export const DragContainer = styled('td')(() => ({ paddingLeft: '0px', maxWidth: '32px', }))
// Full Task Exclusives
export const EfficiencyContainer = styled('td')(({ theme }) => ({
	width: '50px', fontSize: '16px',// ${props => props.theme.fontSizes.medium};
	'& p': { display: 'inline-flex', width: '100%', alignItems: 'center', justifyContent: 'center', }
}))
export const DueContainer = styled('td')(({ theme }) => ({
	minWidth: '160px', padding: '8px',//${props => props.theme.spaces.small};
	input: { width: '160px', },
}))
export const WeightContainer = styled('td')(({ theme }) => ({
	paddingLeft: '25px', padding: '8px',//${props => props.theme.spaces.small};
	input: { width: '40px', paddingLeft: '0', paddingRight: '0', },
}))
export const ThreadContainer = styled('td')(({ theme }) => ({ padding: '8px' })) // ${props => props.theme.spaces.small}
export const DependencyContainer = styled('td')(({ theme }) => ({
	padding: '8px',// ${props => props.theme.spaces.small}
	'& > div': { width: '100%' },
	'.css-3w2yfm-ValueContainer': {
		WebkitFlexWrap: 'nowrap', flexWrap: 'nowrap', columnGap: '5px',
		paddingRight: '45px', maxWidth: '370px', width: '100%',
		overflowX: 'auto', overflowY: 'hidden',
		div: { flex: 'none', }
	}
}))