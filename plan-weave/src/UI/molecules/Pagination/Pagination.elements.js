import { styled } from '@mui/material/styles'

export const PaginationContainer = styled('div')(({ theme }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-between',
	padding: `${theme.spacing(1)} 5%`, maxWidth: '100%', borderRadius: `0 0 ${theme.spacing(4)} ${theme.spacing(4)}`,
	'input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', appearance: 'none', margin: 0, },
	'input[type=number]': { MozAppearance: 'textfield', },
	input: { textAlign: 'center', color: theme.palette.text.primary, outline: `1px solid ${theme.palette.text.primary}` },
	span: { color: theme.palette.text.primary, },
	backgroundColor: theme.palette.background.paperBackground, color: theme.palette.text.primary,
	'.pagination-icon': { fontSize: theme.spacing(4), cursor: 'pointer', borderRadius: '50%', color: theme.palette.text.primary, '&:hover': { color: theme.palette.primary.main, boxShadow: theme.shadows[2], },}
}))
export const PageChooserContainer = styled('div')(({ theme }) => ({ display: 'flex', alignItems: 'center', marginLeft: '18%', columnGap: theme.spacing(3), }))