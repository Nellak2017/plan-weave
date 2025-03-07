import { styled } from '@mui/material/styles'

const paginationIconStyles = ({ theme }) => ({ fontSize: theme.spacing(4), cursor: 'pointer', borderRadius: '50%', '&:hover': { color: theme.palette.primary.main, boxShadow: theme.shadows[2], } })
const paginationPresets = ({ theme, variant }) => ({
	light: { backgroundColor: theme.palette.lightNeutral[50], '.pagination-icon': { ...paginationIconStyles({ theme }), color: theme.palette.grey[600] } },
	dark: { backgroundColor: theme.palette.grey[600], '.pagination-icon': { ...paginationIconStyles({ theme }), color: theme.palette.lightNeutral[50] }, }
}?.[variant])

export const PaginationContainer = styled('div')(({ theme, variant }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-between',
	padding: `${theme.spacing(1)} 5%`, maxWidth: '100%', borderRadius: '0 0 32px 32px',
	'input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', appearance: 'none', margin: 0, },
	'input[type=number]': { MozAppearance: 'textfield', },
	input: { textAlign: 'center', }, ...paginationPresets({ theme, variant })
}))
export const PageChooserContainer = styled('div')(({ theme }) => ({ display: 'flex', alignItems: 'center', marginLeft: '18%', columnGap: theme.spacing(3), }))