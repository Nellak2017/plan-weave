import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, navPresets } from '../../../styles/theme'

export const StyledNav = styled.nav`
	margin: 0 ${props => props.theme.spaces.small};
	padding: 0 ${props => props.theme.spaces.small};

	display: flex;
	align-items: center;
	justify-content: space-between;

	background-color: transparent;
	box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.12); // BAD Copy-Pasted from theme

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
	column-gap: ${props => props.theme.spaces.small};

	a {
		font-size: ${props => props.theme.fontSizes.small};
	}
	& a:hover {
		color: ${props => props.theme.colors.primary};
		cursor: pointer;
	}

	button {
		display: flex;
		align-items: center;

		svg {
			font-size: ${props => props.theme.fontSizes.large};
		}
	}
`