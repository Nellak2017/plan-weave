import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../../styles/theme'

const authFormPresets = {
	variant: {
		light: css`
			color: ${props => props.theme.colors.lightNeutral};
			background-color: ${props => props.theme.colors.lightNeutralLight};
			box-shadow: ${props => props.theme.elevations.small};
			& a { color: ${props => props.theme.colors.primary};}
			& a:hover { color: ${props => props.theme.colors.darkNeutralDark};}
			& h2, h3, p, label { color: ${props => props.theme.colors.lightNeutral};}
			& input { box-shadow: ${props => props.theme.elevations.small}; }
			& section { background-color: ${props => props.theme.colors.lightNeutralLightActive}; }
			& span { color: ${props => props.theme.colors.lightNeutral}; }
			& .logo {
			background: transparent;
			filter: invert(100%) brightness(0%) invert(11%) sepia(7%) saturate(1281%) hue-rotate(245deg) brightness(101%) contrast(89%);
			}
	  `,
		dark: css`
			color: ${props => props.theme.colors.lightNeutralLight};
			background-color: ${props => props.theme.colors.darkNeutralDark};
			box-shadow: ${props => props.theme.elevations.small};
			& a { color: ${props => props.theme.colors.primaryLightActive};}
			& a:hover { color: ${props => props.theme.colors.primaryLightHover};}
			& h2, h3, p, label { color: ${props => props.theme.colors.lightNeutralLight};}
			& input { box-shadow: ${props => props.theme.elevations.small};}
			& section { background-color: ${props => props.theme.colors.lightNeutralLightActive};}
			& span { color: ${props => props.theme.colors.lightNeutralLight};}
	  `
	},
}

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

  	${getPresetCSS(authFormPresets, 'variant')};
`

export const StyledAuthForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	row-gap: ${props => props.theme.spaces.small};
	width: 100%;
	& h2 { font-size: ${props => props.theme.fontSizes.large};}
	& button { width: 80%; }
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
	& input { width: 80%; }
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

export const Or = styled.div` padding: 0 10px; `

export const CenteredContainer = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center; 
  height: 100vh; 
`

export const SubtitleContainer = styled.div`
	display: flex;
	column-gap: ${props => props.theme.spaces.small};
	a { text-decoration: underline; }
`