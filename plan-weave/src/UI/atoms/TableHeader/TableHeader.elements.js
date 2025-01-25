import { styled } from "@mui/material"

// TODO: Refactor to use theme properly
const variantStyles = ({ bg, color }) => ({ backgroundColor: bg, color })
const tableHeaderPresets = ({ theme, variant }) => ({
	light: variantStyles({ bg: '#eeedee', color: '#2b252c' }),
	dark: variantStyles({ bg: '#504651', color: '#eeedee' }),
}?.[variant])
export const TableHeaderContainer = styled('th')(({ theme, variant }) => ({ ...tableHeaderPresets({ theme, variant }) }))
export const StyledRow = styled('tr')(({ theme, variant }) => ({
	':nth-child(1), :nth-child(2)': {
		width: '5px',
		padding: '4px', // props.theme.spaces.smaller  
	},
	...tableHeaderPresets({ theme, variant })
}))