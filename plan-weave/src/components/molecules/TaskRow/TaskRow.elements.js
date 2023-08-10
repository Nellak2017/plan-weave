import styled from "styled-components"
import {
	MdDragIndicator,
	MdOutlineCheckBoxOutlineBlank,
	MdOutlineCheckBox
} from 'react-icons/md'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, taskRowPresets } from '../../../styles/theme.js'


// Style the td's from here unless specifics are needed
export const TaskRowStyled = styled.tr`
	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskRowPresets, 'variant')};
	${getPresetCSS(taskRowPresets, 'color')};
`

export const DragIndicator = styled(MdDragIndicator)`
	&:hover {
		cursor: grab;
		color: ${props => props.theme.colors.primary};
	}
`

export const CheckBoxEmptyStyled = styled(MdOutlineCheckBoxOutlineBlank)`
	&:hover {
		cursor: pointer;
		color: ${props => props.theme.colors.primary};
	}
`

export const CheckBoxStyled = styled(MdOutlineCheckBox)`
	&:hover {
		cursor: pointer;
		color: ${props => props.theme.colors.primary};
	}
`

export const EllipsesStyled = styled(AiOutlineEllipsis)`
	&:hover {
		cursor: pointer;
		color: ${props => props.theme.colors.primary};
	}
`

// Containers

export const TaskContainer = styled.td`
	display: table-cell;
	padding: ${props => props.theme.spaces.small};
`

export const TimeContainer = styled.td`
	display: table-cell;
	padding: ${props => props.theme.spaces.small};
	p {
		font-size: ${props => props.theme.fontSizes.medium};
	}
`