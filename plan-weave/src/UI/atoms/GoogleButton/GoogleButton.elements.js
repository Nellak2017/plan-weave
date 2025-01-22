import styled from 'styled-components'
export const StyledGoogleButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 24px;
	background-color: #fff;
	font-family: 'Roboto', sans-serif;
	font-weight: bold;
	font-size: 14px;
	color: #00000087;
	box-shadow: ${props => props.theme.elevations.extraSmall};
	padding: 11px 8px;
	&:hover {
		background-color: #fff;
		color: #4285F4;
		box-shadow: ${props => props.theme.elevations.small};
	}
	&:focus { outline: 2px solid #4285F4; }
`