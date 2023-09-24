import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, authFormPresets } from '../../../styles/theme'


export const AuthContainer = styled.div`
	margin: auto;
	padding: ${props => props.theme.spaces.small} 0;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	row-gap: ${props => props.theme.spaces.small};

	border-radius: ${props => props.theme.spaces.medium};
	max-width: ${props => props.maxwidth}px;
	width: 100%;

	${space};
	${layout};
	${typography};
  	${getPresetCSS(authFormPresets, 'variant')};
	${getPresetCSS(authFormPresets, 'color')};
`

export const StyledAuthForm = styled.form`

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	row-gap: ${props => props.theme.spaces.small};

	width: 100%;

	& h2 {
		font-size: ${props => props.theme.fontSizes.large};
	}
	& button {
		width: 80%;
	}
	img {
		border-radius: 20%;
		cursor: pointer;
	}

`

export const InputSection = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	row-gap: ${props => props.theme.spaces.smaller};

	& input {
		width: 80%;
	}

	& label {
		align-self: flex-start;
		margin-left: 10%;
	}
`

export const SignInContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 20px 0 20px 0;
	& button {
		font-size: 14px; // so it for sure conforms to Google Standard
		width: 80%;
	}
`

export const OrSeparator = styled.span`
	display: flex;
	align-items: center;
	text-align: center;
	width: 80%;
	user-select: none;
`

export const Line = styled.section`
	width: 100%;
	height: 1px;
`

export const Or = styled.div`
	padding: 0 10px;
`

export const CenteredContainer = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center; 
  height: 100vh; 
`

export const SubtitleContainer = styled.div`
	display: flex;
	column-gap: ${props => props.theme.spaces.small};
	a {
		color: ${props => props.theme.colors.primary};
		text-decoration: underline;
	}
`