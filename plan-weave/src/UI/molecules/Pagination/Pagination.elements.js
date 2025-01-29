import { styled } from '@mui/material/styles'

const paginationIconStyles = ({ theme }) => ({
	fontSize: '32px', // theme.spaces.large
	cursor: 'pointer', borderRadius: '50%', '&:hover': { color: theme.palette.primary.main, boxShadow: theme.shadows[2], }
})
const paginationPresets = ({ theme, variant }) => ({
	light: {
		backgroundColor: `#eeedee`, // theme.colors.lightNeutralLight
		'.pagination-icon': { ...paginationIconStyles({ theme }), color: `#2b252c` } // props.theme.colors.darkNeutralDark
	},
	dark: {
		backgroundColor: `#2b252c`, // props.theme.colors.darkNeutralDark
		'.pagination-icon': { ...paginationIconStyles({ theme }), color: `#eeedee` }, // theme.colors.lightNeutralLight
	}
}?.[variant])

export const PaginationContainer = styled('div')(({ theme, variant, maxWidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-between',
	padding: `4px 5%`, // theme.spaces.smaller
	maxWidth: `${maxWidth || '100%'}`, borderRadius: '0 0 32px 32px',
	'input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': {
		WebkitAppearance: 'none', appearance: 'none', margin: 0,
	},
	'input[type=number]': { MozAppearance: 'textfield', },
	input: { textAlign: 'center', },
	...paginationPresets({ theme, variant })
}))
export const PageChooserContainer = styled('div')(({ theme }) => ({
	display: 'flex', alignItems: 'center', marginLeft: '18%',
	columnGap: `16px`, // props.theme.spaces.medium
}))