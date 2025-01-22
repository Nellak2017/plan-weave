import styled from 'styled-components'
import { getPresetCSS, selectWrapperPresets,} from '../../styles/theme'

export const StyledReactSelectContainer = styled.div`
	& * { font-family: var(--font-poppins), sans-serif;}
	& div { box-shadow: none;}
	& div:hover, div:active, div:focus {
		box-shadow: none;
		cursor: pointer;
	}
	& .css-t3ipsp-control, .css-t3ipsp-control:hover, .css-t3ipsp-control:focus, .css-t3ipsp-control:active { 
		box-shadow: none; // NOTE: it took me forever to find these classes, as the react select created these classes dynamically
		border: 1px solid ${props => props.theme.colors.primary};
	}
	& .css-13cymwt-control, .css-t3ipsp-control { // Control Container before it is being focused
		background: none;
		box-shadow: none;
	}
	& .css-13cymwt-control:hover, .css-13cymwt-control:active, .css-13cymwt-control:focus {
		box-shadow: none;
		border: 1px solid ${props => props.theme.colors.primary};
		border-color: ${props => props.theme.colors.primary}
	}
	svg:hover, svg:focus { color: ${props => props.theme.colors.primary};} // Drop Down Svg
	svg:focus {
		outline: none;
		border-radius: ${props => props.theme.spaces.smaller};
		border: 1px solid ${props => props.theme.colors.primary};
	}
	.css-12a83d4-MultiValueRemove > .css-tj5bde-Svg:hover, 
	.css-12a83d4-MultiValueRemove > .css-tj5bde-Svg:focus { // X Svgs
		color: ${props => props.theme.colors.danger};
	}
	${getPresetCSS(selectWrapperPresets, 'variant')}
`