import styled from "styled-components"
import {
	MdDragIndicator,
	MdOutlineCheckBoxOutlineBlank,
	MdOutlineCheckBox
} from 'react-icons/md'
import { AiOutlineEllipsis } from 'react-icons/ai'

// Style the td's from here unless specifics are needed
export const TaskRowStyled = styled.tr`
	border: 1px solid red;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	column-gap: ${props => props.theme.spaces.small};
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

export const TaskContainer = styled.div`
	display: flex;
	align-items: center;
	column-gap: ${props => props.theme.spaces.small};
`

export const TimeContainer = styled.div`
	display: flex;
	align-items: center;
	column-gap: ${props => props.theme.spaces.small};
`