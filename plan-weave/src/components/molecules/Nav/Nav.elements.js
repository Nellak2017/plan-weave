import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, navPresets } from '../../../styles/theme'

export const StyledNav = styled.nav`
	margin: 0;
	padding: 0 ${props => props.theme.spaces.small};

	display: flex;
	align-items: center;
	justify-content: center;
	
	position: sticky;
	top: 0;
	z-index: 999;

	//background-color: transparent;
	background-color: ${props => props.theme.colors.darkNeutral}99;
	box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.12); // BAD Copy-Pasted from theme

	* {
		color: #fff; // To pass contrast WGAG requirement
		// See also: https://accessibleweb.com/color-contrast-checker/
		// with foreground = #fff, background = #815AF1 (primary) 
	}

	${space};
	${layout};
	${typography};
  	${getPresetCSS(navPresets, 'variant')};
	${getPresetCSS(navPresets, 'color')};
`

export const Logo = styled.span`
	cursor: pointer;
`

export const SiteTitle = styled.h1`
	font-size: ${props => props.theme.fontSizes.larger};
	a {
		font-size: ${props => props.theme.fontSizes.larger};
	}
`

export const LoginContainer = styled.span`
	display: flex;
	align-items: center;
	column-gap: ${props => props.theme.spaces.medium};
	height: 100%;

	a {
		display: inline-flex;
		align-items: center;
		height: 100%;
		font-size: ${props => props.theme.fontSizes.medium};
	}
	& a:hover {
		color: ${props => props.theme.colors.primary};
		cursor: pointer;
		border-bottom: 2px solid ${props => props.theme.colors.primary};
	}

	button {
		display: flex;
		align-items: center;
		
		p {
			font-size: ${props => props.theme.fontSizes.medium};
		}
		svg {
			font-size: ${props => props.theme.fontSizes.large};	
		}
	}
`

// This is to make the spacing proper even for large desktops
export const ContentContainer = styled.section`
	display: flex;
	flex-wrap: wrap; // 2 rows when it is small screen
	align-items: center;
	justify-content: space-evenly; // looks better than space-between on small screens
	column-gap: ${props => props.theme.spaces.small}; // to ensure it wraps at 688 px, to avoid awkward design
	max-width: 1290px;
	width: 100%;
	height: 100%;
`