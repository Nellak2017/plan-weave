import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, tableHeaderPresets } from '../../../styles/theme'

// TODO: Remove !important from font-weight normal definition, figure out why 

export const TableHeaderContainer = styled.th`
	font-weight: normal!important; // Not sure why I have to specify this, leaving it for now
  	text-align: center;
	font-size: ${props => props.theme.fontSizes.large};
 	${space};
	${layout};
	${typography};
  	${getPresetCSS(tableHeaderPresets, 'variant')};
	${getPresetCSS(tableHeaderPresets, 'color')};
`

export const StyledRow = styled.tr`
	${getPresetCSS(tableHeaderPresets, 'variant')};
	${getPresetCSS(tableHeaderPresets, 'color')};
`