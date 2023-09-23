import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, navPresets } from '../../../styles/theme'

export const StyledNav = styled.nav`
	margin: 0 ${props => props.theme.spaces.small};
	padding: 0;

	display: flex;
	align-items: center;
	justify-content: space-between;

	border: 1px solid red;

	${space};
	${layout};
	${typography};
  	${getPresetCSS(navPresets, 'variant')};
	${getPresetCSS(navPresets, 'color')};
`

export const Logo = styled.span`

`

export const LoginContainer = styled.span`
	display: flex;

	button {
		display: flex;
		align-items: center;

		svg {
			//font-size;
		}
	}
`