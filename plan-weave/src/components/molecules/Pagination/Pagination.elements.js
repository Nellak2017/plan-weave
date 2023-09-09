import styled from "styled-components"
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, paginationPresets } from '../../../styles/theme.js'

export const PaginationContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	column-gap: 20%;
	padding: ${props => props.theme.spaces.smaller} 5% ${props => props.theme.spaces.smaller} 0;
	max-width: ${props => props.maxWidth ? props.maxWidth : '100%'}; 
	

	// Switch based on size
	//height: 64px;
	border-radius: 0 0 32px 32px;

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
`