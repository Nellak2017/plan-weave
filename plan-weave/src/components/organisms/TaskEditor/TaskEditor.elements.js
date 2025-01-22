import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../styles/theme'

const taskEditorPresets = {
	variant: {
		light: css` h1 { color: ${props => props.theme.colors.lightNeutral};} `,
		dark: css` h1 { color: ${props => props.theme.colors.lightNeutralLight};}`
	},
}

// TODO: Finish Styling this
export const StyledTaskEditor = styled.div`
  	${getPresetCSS(taskEditorPresets, 'variant')};
	background-color: black; // Stand-in color
	width: 100%;
	max-width: ${props => props.maxwidth}px;
	border-radius: 36px;
`

export const TaskEditorContainer = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	h1 {
		font-size: ${props => props.theme.fontSizes.larger};
		font-weight: 300;
	}
  	${getPresetCSS(taskEditorPresets, 'variant')};
`