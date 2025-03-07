import { styled } from '@mui/material'

export const HoursInputStyled = styled('input')(({ theme, maxwidth }) => ({
	outline: `1px solid ${theme.palette.grey[50]}`, lineHeight: theme.typography.h3.fontSize, borderRadius: theme.spacing(2),
	textAlign: 'center', fontSize: theme.typography.body1.fontSize, 
	padding: `${theme.spacing(1)} ${theme.spacing(2)}`, width: '100%', maxWidth: `${maxwidth ? maxwidth + 'px' : '100%'}`, background: 'none',
	'&:hover': { outlineColor: theme.palette.primary.main, background: 'none', },
}))
export const HoursContainer = styled('section')(({ theme }) => ({ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', columnGap: theme.spacing(1),}))