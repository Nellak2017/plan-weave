import styled from 'styled-components'

/*
Branding Guidelines:

X 1. Use Official Assets
X 2. Use Proper Spacing
X 3. Do not Alter Asset Colors
X 4. Do not Alter Background Colors #fff or #4285F4
X 5. Do not Alter Button Text "Sign in/up with Google"
X 6. Maintain Button Proportions
X 7. Include Alt text that is appropriate
X 8. Ensure Google Button is consistently displayed across entire application
X 9. Respect Google's Brand
X 10. Do not use Logo by itself as a button
X 11. Do not have Light and Dark themes of button
X 12. Do not create own icon for Google Button
X 13. Do not use Icon by itself to represent a sign-in
X 14. Display with equal prominence as other sign-in options (Same box-shadow)
X 15. Only use font Roboto-Medium, 14px, color: #000
X 16. Do not alter padding.
	left/right of text: 8dp,
	logo dimensions: 18dp x 18dp,
	logo and text: 24dp
*/

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
		box-shadow: ${props => props.theme.elevations.small};
	}
`