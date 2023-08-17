import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, taskEditorPresets } from '../../../styles/theme'

// TODO: Finish Styling this
export const StyledTaskEditor = styled.div`
 	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskEditorPresets, 'variant')};
	${getPresetCSS(taskEditorPresets, 'color')};

	background-color: black; // Stand-in color
	//height: 1000px;
	max-width: ${props => props.maxwidth}px;
`