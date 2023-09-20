import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, authFormPresets } from '../../../styles/theme'

export const StyledAuthContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: ${props => props.theme.spaces.medium};

	max-width: ${props => props.maxwidth}px;
	width: 100%;

	border: 1px solid red;

`