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

	th,
	td {
		padding: 8px; // Adjust padding as needed
		border-bottom: 1px solid ${props => props.theme.colors.lightNeutralLight}50; // Add border to bottom of each cell
	}

	th {
		font-weight: bold;
		text-align: left;
	}
	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskTablePresets, 'variant')};
	${getPresetCSS(taskTablePresets, 'color')};
`