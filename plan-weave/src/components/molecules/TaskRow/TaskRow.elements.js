import styled from "styled-components"
import {
	MdDragIndicator,
} from 'react-icons/md'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, taskRowPresets } from '../../../styles/theme.js'

// TODO: Clean up uneeded styled components when you know you won't need it anymore

// Style the td's from here unless specifics are needed
export const TaskRowStyled = styled.tr`
	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskRowPresets, 'variant')};
	${getPresetCSS(taskRowPresets, 'status')};
	${getPresetCSS(taskRowPresets, 'color')};
	${getPresetCSS(taskRowPresets, 'highlight')}; // intended to gray out old tasks if old prop ='old'

	* > svg:hover {
		cursor: pointer;
		color: ${props => props.theme.colors.primary};
	}

	td {
		display: table-cell;
		vertical-align: middle;
		svg {
			vertical-align: middle;
		}
	}
`

export const DragIndicator = styled(MdDragIndicator)`
	&:hover {
		cursor: grab!important; // Important is needed bc * > svg:hover has more precedence than this
		color: ${props => props.theme.colors.primary};
	}
`
// Containers

export const TaskContainer = styled.td`
	width: 375px;
	padding: ${props => props.theme.spaces.small};
	p, pre {
		font-size: ${props => props.theme.fontSizes.medium};
	}
	input {
		vertical-align: middle;
		min-width: 200px;
		max-width: 360px;
		width: 100%;
	}
`

export const WasteContainer = styled.td`
	padding: ${props => props.theme.spaces.small};
	max-width: 170px;
	min-width: 100px;
	text-align: left;
	input {
		min-width: 40px;
	}
	p, pre {
		font-size: ${props => props.theme.fontSizes.medium};
	}
`


export const TimeContainer = styled.td`
	padding: ${props => props.theme.spaces.small};
	max-width: 200px;
	min-width: 100px;
	text-align: left;
	input {
		width: 40px;
		padding-left: 0;
		padding-right: 0;
	}
	p, pre {
		font-size: ${props => props.theme.fontSizes.medium};
		font-family: var(--font-poppins);
	}
`
export const IconContainer = styled.td`
	
`
export const TrashContainer = styled.td`
	padding-right: 5px;
`
export const DragContainer = styled.td`
	padding-left: 0px;
	max-width: 32px;
`

// Full Task Exclusives

export const EfficiencyContainer = styled.td`
	width: 50px;
	font-size: ${props => props.theme.fontSizes.medium};
	& p {
		display: inline-flex;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
`

export const DueContainer = styled.td`
	min-width: 160px;
	input {
		width: 160px;
	}
	padding: ${props => props.theme.spaces.small};
`

export const WeightContainer = styled.td`
	padding: ${props => props.theme.spaces.small};
	padding-left: 25px;
	input {
		width: 40px;
		padding-left: 0;
		padding-right: 0;
	}
`

export const ThreadContainer = styled.td`
	padding: ${props => props.theme.spaces.small};
`

export const DependencyContainer = styled.td`
	padding: ${props => props.theme.spaces.small};

	& > div {
		width: 100%;
	}
	.css-3w2yfm-ValueContainer {
		-webkit-flex-wrap: nowrap;
		flex-wrap: nowrap;
		column-gap: 5px;

		padding-right: 45px;
		max-width: 370px;
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;

		div {
			flex: none;	
		}
	}
`