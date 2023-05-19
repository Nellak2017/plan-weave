import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, taskControlPresets } from '../../../styles/theme'

export const TaskControlContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	height: ${props => props.theme.spaces.extraLarge};
	width: 100%;
	max-width: ${props => props.maxwidth}px;
	border-radius: 36px 36px 0 0;
	padding-left: ${props => props.theme.spaces.smaller};
	${space};
	${layout};
	${typography};
  	${getPresetCSS(taskControlPresets, 'variant')};
	${getPresetCSS(taskControlPresets, 'color')};
`