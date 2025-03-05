import { styled } from '@mui/material'

export const HoursInputStyled = styled('input')(({ theme, maxwidth }) => ({
	outline: '1px solid white', lineHeight: '25px', borderRadius: '10px',
	textAlign: 'center', fontSize: theme.typography.body1.fontSize, 
	padding: '4px 8px', width: '100%',
	maxWidth: `${maxwidth ? maxwidth + 'px' : '100%'}`, background: 'none',
	'&:hover': { outlineColor: theme.palette.primary.main, background: 'none', },
}))
export const HoursContainer = styled('section')(({ theme }) => ({ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', columnGap: theme.spacing(1),}))