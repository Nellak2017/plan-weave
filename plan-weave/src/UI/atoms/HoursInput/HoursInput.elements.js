import { styled } from '@mui/material'

// TODO: taskInputPreSets needs to be used in HoursContainer
export const HoursInputStyled = styled('input')(({ theme, maxwidth }) => ({
	outline: '1px solid white', lineHeight: '25px', borderRadius: '10px',
	textAlign: 'center', fontSize: theme.typography.body1.fontSize, 
	padding: '4px 8px', width: '100%',
	maxWidth: `${maxwidth ? maxwidth + 'px' : '100%'}`, background: 'none',
	'&:hover': { outlineColor: theme.palette.primary.main, background: 'none', },
	// ${getPresetCSS(taskInputPreSets, 'variant')},
}))
export const HoursContainer = styled('section')(({ theme, variant }) => ({
	display: 'inline-flex', justifyContent: 'center', alignItems: 'center', columnGap: '4px',
	// 	${getPresetCSS(taskInputPreSets, 'variant')};
}))