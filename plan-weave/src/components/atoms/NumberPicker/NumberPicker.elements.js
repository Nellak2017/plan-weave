import styled, { css } from "styled-components"
import { getPresetCSS } from '../../styles/theme.js'

const variantStyle = color => css`p { color: ${color};}`
const numberPickerPresets = {
	variant: {
		light: variantStyle(props => props.theme.colors.darkNeutralDark),
		dark: variantStyle(props => props.theme.colors.lightNeutralLight),
	},
}

export const PickerContainer = styled.section`
	display: flex; 
	column-gap: 10px; 
	align-items: center;
	${getPresetCSS(numberPickerPresets, 'variant')}
`

export const DropdownWrapper = styled.div`
	position: relative;
  	display: inline-block;
`

export const StyledNumberPicker = styled.select`
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
	&:active { box-shadow: ${props => props.theme.insets.normal};}
	& > option {
		padding: 5px;
  		background-color: white;
	}
`