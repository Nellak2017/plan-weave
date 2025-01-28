import { styled } from "@mui/material"

// TODO: Use MUI theme properly
const infoSectionPresets = ({ theme, variant }) => ({
	light: {
		backgroundColor: '#fff',
		'.reverse': { flexDirection: 'row-reverse' },
		'h2': { color: theme.palette.primary.main, },
		'h1': { color: `#2b252c`, }, // ${props => props.theme.colors.darkNeutralDark}
		'p': { color: `#39313a`, }, // ${props => props.theme.colors.darkNeutral}
	},
	dark: {
		backgroundColor: `#2b252c`, // ${props => props.theme.colors.darkNeutralDark}
		'h2, p': { color: `#fff`, }, // ${props => props.theme.colors.backgroundTextColor}
	},
}?.[variant])

export const StyledInfoContainer = styled('section')(({ theme, variant }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
	height: '720px', width: '100vw',
	margin: '0', padding: '0',
	...infoSectionPresets({ theme, variant }),
})) // Top level container for Info Section

export const ColumnContainer = styled('div')(({ theme }) => ({
	display: 'flex', alignItems: 'center',
	[theme.breakpoints.down('md')]: {
		flexDirection: 'column!important', // overrides light-mode's row-reverse when hitting this breakpoint
		rowGap: '16px', // theme.spaces.medium
		maxWidth: '100%', flexBasis: '100%', alignItems: 'center',
	},
}))

export const Column = styled('div')(({ theme }) => ({
	padding: `0 16px`, // theme.spaces.medium
	width: '100%',
}))

export const TextContainer = styled('div')(({ theme }) => ({
	display: 'flex', flexDirection: 'column',
	maxWidth: '540px', width: '100%',
	'& h2': {
		fontSize: '16px', // theme.fontSizes.medium
		lineHeight: '16px', // theme.fontSizes.medium
		marginBottom: '16px', // theme.fontSizes.medium
		letterSpacing: '1.4px',
	},
	'& h1': { marginBottom: '24px', fontSize: '48px', lineHeight: '1.1', },
	'& p': {
		marginBottom: '32px', // theme.spaces.large
		fontSize: '16px', // theme.fontSizes.medium
		lineHeight: '24px', // theme.fontSizes.large
	},
	'& a': { width: '50%', alignSelf: 'center', },
	'& button': {
		width: '100%',
		fontSize: '16px', // theme.fontSizes.medium
	},
}))