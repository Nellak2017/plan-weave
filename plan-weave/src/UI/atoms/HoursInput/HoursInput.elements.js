import { styled } from '@mui/material'

// const taskInputOverlay = ({ color, placeholderColor }) => css`
// 	color: ${color};
// 	&::placeholder { color: ${placeholderColor}60;}
// `
// const taskInputVariantStyles = ({ color, hoverColor, focusColor, focusPlaceholderColor }) => css`
// 	& > span {
// 		color: ${color};
// 		&::placeholder { color: ${color}60;}
// 		&:hover { ${taskInputOverlay({ color: hoverColor, placeholderColor: hoverColor })}}
// 		&:focus { ${taskInputOverlay({ color: focusColor, placeholderColor: focusPlaceholderColor })}}
// 	}
// `
// export const taskInputPreSets = {
//   variant: {
//     light: taskInputVariantStyles({
//       color: props => props.theme.colors.lightNeutral,
//       hoverColor: props => props.theme.colors.lightNeutralHover,
//       focusColor: props => props.theme.colors.lightNeutralActive,
//       focusPlaceholderColor: props => props.theme.colors.lightNeutralActive,
//     }),
//     dark: taskInputVariantStyles({
//       color: props => props.theme.colors.lightNeutralLight,
//       hoverColor: props => props.theme.colors.lightNeutralLightHover,
//       focusColor: props => props.theme.colors.lightNeutralLight,
//       focusPlaceholderColor: props => props.theme.colors.lightNeutralLightActive,
//     }),
//   },
// }

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