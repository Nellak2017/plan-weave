import styled, { css } from "styled-components"
import { MdDragIndicator } from 'react-icons/md'
import { getPresetCSS } from '../../styles/theme.js'

const commonOverlayStyles = css`
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	pointer-events: none; /* Make the overlay non-interactive */
`
const tdStyle = color => css`
  td {
    position: relative;
    &::before {
      ${commonOverlayStyles}
      background-color: ${color}70;
    }
  }
`
const variantStyle = ({ bg, color }) => css`
	background-color: ${bg};
	color: ${color};
	p, svg { color: ${color};}
`
const taskRowPresets = {
	variant: {
		light: variantStyle({ bg: props => props.theme.colors.lightNeutralLight, color: props => props.theme.colors.darkNeutralDark }),
		dark: variantStyle({ bg: props => props.theme.colors.lightNeutral, color: props => props.theme.colors.lightNeutralLight }),
	},
	status: {
		completed: tdStyle(props => props.theme.colors.success),
		incomplete: tdStyle(),
		waiting: tdStyle(props => props.theme.colors.warning),
		inconsistent: tdStyle(props => props.theme.colors.danger),
	},
	highlight: {
		old: tdStyle(props => props.theme.colors.lightNeutral),
		selected: css`outline: 1px solid ${props => props.theme.colors.lightNeutralLight};`
	},
}

// Style the td's from here unless specifics are needed
export const TaskRowStyled = styled.tr`
  	${getPresetCSS(taskRowPresets, 'variant')};
	${getPresetCSS(taskRowPresets, 'status')};
	${getPresetCSS(taskRowPresets, 'highlight')}; // intended to gray out old tasks if old prop ='old'

	* > svg:hover {
		cursor: pointer;
		color: ${props => props.theme.colors.primary};
	}
	td {
		display: table-cell;
		vertical-align: middle;
		svg { vertical-align: middle;}
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
	p, pre { font-size: ${props => props.theme.fontSizes.medium};}
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
	input { min-width: 40px;}
	p, pre { font-size: ${props => props.theme.fontSizes.medium};}
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
export const IconContainer = styled.td``
export const TrashContainer = styled.td`padding-right: 5px;`
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
	input { width: 160px;}
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

export const ThreadContainer = styled.td`padding: ${props => props.theme.spaces.small};`

export const DependencyContainer = styled.td`
	padding: ${props => props.theme.spaces.small};
	& > div { width: 100%;}
	.css-3w2yfm-ValueContainer {
		-webkit-flex-wrap: nowrap;
		flex-wrap: nowrap;
		column-gap: 5px;
		padding-right: 45px;
		max-width: 370px;
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		div { flex: none;}
	}
`