import { styled } from '@mui/system'
export const TaskTableContainer = styled('div')(({ theme, maxwidth }) => ({
	display: 'block', maxWidth: '-moz-fit-content', margin: '0 auto', overflowX: 'auto', whiteSpace: 'nowrap',
	table: { width: '100%', maxWidth: `${maxwidth}px`, borderCollapse: 'collapse', borderSpacing: '0', border: 'none', },
	tr: { maxWidth: `${maxwidth}px` }, // added to make the squeezing stop when dnd
	'td, th': { borderBottom: `1px solid ${theme.palette.grey[50]}50`, minWidth: '32px', },
	td: { display: 'table-cell', }, th: { padding: theme.spacing(2), fontWeight: 'normal', textAlign: 'left', fontSize: theme.typography.h3.fontSize, },
	backgroundColor: theme.palette.background.paper,
}))