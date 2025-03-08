import { styled } from "@mui/material"

const infoSectionPresets = ({ theme, variant }) => ({
	light: { backgroundColor: theme.palette.grey[50], '.reverse': { flexDirection: 'row-reverse' }, 'h2': { color: theme.palette.primary.main, }, 'h1': { color: theme.palette.grey[600], }, 'p': { color: theme.palette.grey[300], }, },
	dark: { backgroundColor: theme.palette.grey[600], 'h2, p': { color: theme.palette.grey[50], }, },
}?.[variant])
export const StyledInfoContainer = styled('section')(({ theme, variant }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
	height: '720px', width: '100vw', margin: '0', padding: '0', 
	...infoSectionPresets({ theme, variant }), // Actually necessary since I want to use multiple versions of this later in the same page
})) // Top level container for Info Section
export const ColumnContainer = styled('div')(({ theme }) => ({
	display: 'flex', alignItems: 'center',
	[theme.breakpoints.down('md')]: { maxWidth: '100%', flexBasis: '100%', alignItems: 'center', rowGap: theme.spacing(3), flexDirection: 'column!important', /* overrides light-mode's row-reverse when hitting this breakpoint */ },
}))
export const Column = styled('div')(({ theme }) => ({ padding: `0 ${theme.spacing(3)}`, width: '100%', }))
export const TextContainer = styled('div')(({ theme }) => ({
	display: 'flex', flexDirection: 'column', maxWidth: '540px', width: '100%',
	'& h2': { fontSize: theme.typography.h4.fontSize, lineHeight: theme.typography.h4.fontSize, marginBottom: theme.spacing(3), letterSpacing: '1.4px', },
	'& h1': { marginBottom: theme.spacing(4), fontSize: theme.typography.h2.fontSize, lineHeight: '1.1', },
	'& p': { marginBottom: theme.spacing(4), fontSize: theme.typography.h4.fontSize, lineHeight: theme.typography.h3.fontSize, },
	'& a': { width: '50%', alignSelf: 'center', },
	'& button': { width: '100%', fontSize: theme.typography.h4.fontSize, },
}))