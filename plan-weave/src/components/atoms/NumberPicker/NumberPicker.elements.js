import styled from "styled-components"
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, numberPickerPresets } from '../../../styles/theme.js'

export const PickerContainer = styled.section`
	display: flex; 
	column-gap: 10px; 
	align-items: center;

	${space} 
    ${layout}
    ${typography}
	${getPresetCSS(numberPickerPresets, 'variant')}
	${getPresetCSS(numberPickerPresets, 'color')}
`

export const DropdownWrapper = styled.div`
	position: relative;
  	display: inline-block;
`

export const StyledNumberPicker = styled.select`
	//appearance: none; /* Remove default select styles */
	padding: 5px; 
	border: 1px solid #ccc; 
	width: 60px; 
	cursor: pointer; 
	outline: none; 
	background-color: white; 
	border-radius: ${props => props.theme.spaces.small}; // standard button 

	&:hover {
		border-color: ${props => props.theme.colors.primary};
		box-shadow: ${props => props.theme.elevations.small};
	}
	&:active {
        box-shadow: ${props => props.theme.insets.normal};
    }

	& > option {
		padding: 5px;
  		background-color: white;
	}
`