import styled from "styled-components"
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, paginationPresets } from '../../../styles/theme.js'

// TODO: Switch based on size, using xs, s, m, l, etc. based on the theme
export const PaginationContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${props => props.theme.spaces.smaller} 5%;
	max-width: ${props => props.maxWidth ? props.maxWidth : '100%'}; 

	//height: 64px;
	border-radius: 0 0 32px 32px;

	// class made to prevent conflicts with other svgs
	.pagination-icon {
		font-size: ${props => props.theme.spaces.large};
		cursor: pointer;
		border-radius: 50%;
		&:hover {
			color: ${props => props.theme.colors.primary};
          	box-shadow: ${props => props.theme.elevations.small};
		}
	}

	// Styles To remove the up/down buttons on the number inputs 
	input[type=number]::-webkit-inner-spin-button,
	input[type=number]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		appearance: none;
		margin: 0;
	}
	input[type=number] {
		-moz-appearance: textfield;
	}

	// Style to center the number in the input
	input {
		text-align: center;
	}

	${space} 
    ${layout}
    ${typography}
	${getPresetCSS(paginationPresets, 'variant')}
	${getPresetCSS(paginationPresets, 'color')}

`

export const PageChooserContainer = styled.div`
	display: flex;
	align-items: center;
	column-gap: ${props => props.theme.spaces.medium};

	margin-left: 18%; // Don't question it, it just works
`