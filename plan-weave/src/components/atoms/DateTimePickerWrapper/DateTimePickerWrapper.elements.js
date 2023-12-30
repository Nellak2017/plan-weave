import styled from 'styled-components'
import {
	getPresetCSS,
	dateTimePickerPresets,
} from '../../../styles/theme'

export const PickerContainer = styled.div`
	margin: 0px;
	border: 0px solid transparent;

	& div {
		border-radius: ${props => props.theme.spaces.small};
	}

	input {
		border: 0px solid transparent;
		box-shadow: none;
		border-radius: 0px;
		padding-top: ${props => props.theme.spaces.smaller};
		padding-bottom: ${props => props.theme.spaces.smaller};
	} 
	& svg:hover {
        color: ${props => props.theme.colors.primary};
    }

	${getPresetCSS(dateTimePickerPresets, 'variant')};
`