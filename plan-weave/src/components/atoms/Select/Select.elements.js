import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import {
	getPresetCSS,
	selectWrapperPresets,
} from '../../../styles/theme'

export const StyledContainer = styled.div`
	position: relative;
    display: flex; // or inline-block?
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

	padding: 0;
	width: 200px;
	${space} 
    ${layout}
    ${typography}
	${getPresetCSS(selectWrapperPresets, 'variant')}
    ${getPresetCSS(selectWrapperPresets, 'color')} 
`

// Styled component for the dropdown menu
export const DropdownMenu = styled.ul`
	position: absolute;
	width: 100%;
	height: 4rem; // 2rem for each item * 8 max items 
	top: 100%;
	left: 0;
	display: ${props => (props.open ? 'block' : 'none')};
	z-index: 999; // be above all other stuff
	overflow-y: auto;
	border: 1px solid red;
`;

// Styled component for dropdown menu items
export const DropdownMenuItem = styled.li`
	display: ${props => (props.open ? 'block' : 'none')};
	cursor: pointer;
	height: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${props => props.theme.colors.lightNeutralLight};
	color: ${props => props.theme.colors.lightNeutral};
	&:hover {
		background-color: ${props => props.theme.colors.lightNeutralLightHover};
	}
	&:active {
		background-color: ${props => props.theme.colors.lightNeutralLightActive};
	}
`;
