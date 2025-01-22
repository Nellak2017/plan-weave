import styled from 'styled-components'

export const SpinnerContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	path { stroke: ${props => props.color || props.theme.colors.primary};}
`