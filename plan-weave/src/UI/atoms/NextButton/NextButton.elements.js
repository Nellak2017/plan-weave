import { styled } from '@mui/material/styles'
import { Button } from "@mui/material"

export const NextButtonStyled = styled(Button)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main, minWidth: 0, borderRadius: '50%', display: 'flex', padding: 0,
	'&:hover, &:active': { backgroundColor: theme.palette.primary.main },
	'&:hover': { boxShadow: theme.shadows[3], },
	'&:active': { boxShadow: theme.insets?.normal, },
}))