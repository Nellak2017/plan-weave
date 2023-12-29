import styled from 'styled-components'
import {
	getPresetCSS,
	dateTimePickerPresets,
} from '../../../styles/theme'

export const PickerContainer = styled.div`
	margin-top: 5px;
	border: 0px solid transparent;

	input {
		border: 0px solid transparent;
		box-shadow: none;
		border-radius: 0px;
	} 
	& svg:hover {
        color: ${props => props.theme.colors.primary};
    }

	${getPresetCSS(dateTimePickerPresets, 'variant')};
`