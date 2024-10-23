import styled, { css } from 'styled-components'
import { getPresetCSS, colorPreset } from '../../../styles/theme'

const nextButtonPreSets = { variant: { left: css``, right: css`` }, size: {}, color: colorPreset }
export const NextButtonStyled = styled.button`
	border-radius: 50%; // This makes it a circle shape
	display: flex;
	padding: 0;
	&:hover { box-shadow: ${props => props.theme.elevations.small};}
	&:active { box-shadow: ${props => props.theme.insets.normal};}
    ${getPresetCSS(nextButtonPreSets, 'variant')}
    ${getPresetCSS(nextButtonPreSets, 'size')}
    ${getPresetCSS(nextButtonPreSets, 'color')} // highest precedence
`