import { styled } from '@mui/material/styles'
import { Button } from '../Button/Button.js'

export const NextButtonStyled = styled(Button)(({ theme }) => ({
	minWidth: 0, borderRadius: '50%', display: 'flex', padding: 0,
	'&:hover': { boxShadow: theme.shadows[3], },
	'&:active': { boxShadow: theme.insets?.normal, },
}))