import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, tableHeaderPresets } from '../../../styles/theme'

// This is here in case we need custom styles for this
export const TableHeaderContainer = styled.th`
 	${space};
	${layout};
	${typography};
  	${getPresetCSS(tableHeaderPresets, 'variant')};
	${getPresetCSS(tableHeaderPresets, 'color')};
`

export const StyledRow = styled.tr`
	:nth-child(1), :nth-child(2) {
    	width: 5px; /* You can adjust the value to make them skinnier */
		padding: ${props => props.theme.spaces.smaller};
  	}
	${getPresetCSS(tableHeaderPresets, 'variant')};
	${getPresetCSS(tableHeaderPresets, 'color')};
`