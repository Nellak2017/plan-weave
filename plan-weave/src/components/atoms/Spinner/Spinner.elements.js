import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'

export const SpinnerContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	path {
		// the color value given by user or if none, default to primary color
		stroke: ${props => props.color || props.theme.colors.primary};
	}

	${space};
	${layout};
	${typography};
`