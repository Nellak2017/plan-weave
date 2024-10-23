import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../../styles/theme'

const infoSectionPresets = {
	variant: {
		light: css`
			background-color: #fff; // To pass contrast WGAG requirement. See also: https://accessibleweb.com/color-contrast-checker/
			.reverse { flex-direction: row-reverse;}
			h2 { color: ${props => props.theme.colors.primary};}
			h1 { color: ${props => props.theme.colors.darkNeutralDark};}
			p { color: ${props => props.theme.colors.darkNeutral};}
		`,
		dark: css`
			background-color: ${props => props.theme.colors.darkNeutralDark};
			h2, p { color: ${props => props.theme.colors.backgroundTextColor};}
		`
	},
}

// Top level container for Info Section
export const StyledInfoContainer = styled.section`
	display: flex;
    align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	height: 720px;
	width: 100vw;
	margin: 0;
	padding: 0;
  	${getPresetCSS(infoSectionPresets, 'variant')};
`

// Contains the columns so we can get accurate heights
export const ColumnContainer = styled.div`
	display: flex;
	align-items: center;
	@media screen and (max-width:${props => props.theme.breakpoints.md}){
        flex-direction: column!important; // overrides light-mode's row-reverse when hitting this breakpoint
		row-gap: ${props => props.theme.spaces.medium};
		max-width: 100%;
        flex-basis: 100%;
		align-items: center;
    }
`

// Column where text or images will be
export const Column = styled.div`
	padding: 0 ${props => props.theme.spaces.medium};
	width: 100%;
`

// Container for Text in Column
export const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 540px;
	width: 100%;
	h2 {
		font-size: ${props => props.theme.fontSizes.medium};
		line-height: ${props => props.theme.fontSizes.medium};
		letter-spacing: 1.4px;
		margin-bottom: ${props => props.theme.fontSizes.medium};
	}
	h1 {
		margin-bottom: 24px;
		font-size: 48px;
		line-height: 1.1;
	}
	p {
		margin-bottom: ${props => props.theme.spaces.large};
		font-size: ${props => props.theme.fontSizes.medium};
		line-height: ${props => props.theme.fontSizes.large};
	}
	a {
		width: 50%;
		align-self: center;
	}
	button {
		width: 100%;
		font-size: ${props => props.theme.fontSizes.medium};
	}
`