import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, taskTablePresets } from '../../../styles/theme'

export const TaskTableContainer = styled.div`
	table {
		width: 100%;
		max-width: ${props => props.maxwidth}px;
		border-collapse: collapse; // This property is important for the desired effect
		border-spacing: 0; // Remove any additional spacing between cells
		border: none; // Add border for entire table
  	}

	tr {
		width: ${props => props.maxwidth}px !important;
		max-width: ${props => props.maxwidth}px; // added to make the squeezing stop when dnd
	}

	td, th {
		border-bottom: 1px solid ${props => props.theme.colors.lightNeutralLight}50;
	}

	td {
		display: table-cell;
	}

	th {
		padding: ${props => props.theme.spaces.small};
		font-weight: normal;
		text-align: left;
		font-size: ${props => props.theme.fontSizes.large};
	}
	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskTablePresets, 'variant')};
	${getPresetCSS(taskTablePresets, 'color')};
`