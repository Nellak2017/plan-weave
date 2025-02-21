import { styled } from '@mui/system'
const getVariantStyles = variant => ({
	light: {
		backgroundColor: '#eeedee',// ${props => props.theme.colors.lightNeutralLight};
		color: '#2b252c', //${props => props.theme.colors.darkNeutralDark};
		'p, svg': { color: '#2b252c' }, // ${props => props.theme.colors.darkNeutralDark}
	},
	dark: {
		backgroundColor: '#504651', // ${props => props.theme.colors.lightNeutral};
		color: '#eeedee',// ${props => props.theme.colors.lightNeutralLight};
		'p, svg': { color: '#eeedee', }  // ${props => props.theme.colors.lightNeutralLight}
	},
}?.[variant])
export const TaskTableContainer = styled('div')(({ theme, variant, maxwidth }) => ({
	display: 'block', maxWidth: '-moz-fit-content', margin: '0 auto', overflowX: 'auto', whiteSpace: 'nowrap',
	table: { width: '100%', maxWidth: `${maxwidth}px`, borderCollapse: 'collapse', borderSpacing: '0', border: 'none',},
	tr : { maxWidth: `${maxwidth}px`}, // added to make the squeezing stop when dnd
	'td, th': {
		borderBottom: `1px solid ${'#eeedee'}50`, // props => props.theme.colors.lightNeutralLight
		minWidth:'32px',
	},
	td: { display: 'table-cell',},
	th: {
		padding: '8px',// ${props => props.theme.spaces.small};
		fontWeight: 'normal', textAlign: 'left',
		fontSize: '24px',//${props => props.theme.fontSizes.large};
	},
	...getVariantStyles(variant)
}))