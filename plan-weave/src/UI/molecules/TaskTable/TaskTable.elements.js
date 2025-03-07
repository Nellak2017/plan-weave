import { styled } from '@mui/system'
const getVariantStyles = ({ theme, variant }) => ({
	light: { backgroundColor: theme.palette.lightNeutral[50], color: theme.palette.grey[600], 'p, svg': { color: theme.palette.grey[600] }, },
	dark: { backgroundColor: theme.palette.lightNeutral[300], color: theme.palette.lightNeutral[50], 'p, svg': { color: theme.palette.lightNeutral[50], } },
}?.[variant])
export const TaskTableContainer = styled('div')(({ theme, variant, maxwidth }) => ({
	display: 'block', maxWidth: '-moz-fit-content', margin: '0 auto', overflowX: 'auto', whiteSpace: 'nowrap',
	table: { width: '100%', maxWidth: `${maxwidth}px`, borderCollapse: 'collapse', borderSpacing: '0', border: 'none', },
	tr: { maxWidth: `${maxwidth}px` }, // added to make the squeezing stop when dnd
	'td, th': { borderBottom: `1px solid ${theme.palette.lightNeutral[50]}50`, minWidth: '32px', },
	td: { display: 'table-cell', }, th: { padding: theme.spacing(2), fontWeight: 'normal', textAlign: 'left', fontSize: theme.typography.h3.fontSize, },
	...getVariantStyles({ theme, variant })
}))