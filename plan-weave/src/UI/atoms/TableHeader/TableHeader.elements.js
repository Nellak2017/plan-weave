import { styled } from "@mui/material"

const variantStyles = ({ bg, color }) => ({ backgroundColor: bg, color })
const tableHeaderPresets = ({ theme, variant }) => ({
	light: variantStyles({ bg: theme.palette.lightNeutral({ theme, value: 50 }), color: theme.palette.grey[600] }),
	dark: variantStyles({ bg: theme.palette.lightNeutral({ theme, value: 300 }), color: theme.palette.lightNeutral({ theme, value: 50 }) }),
}?.[variant])
export const TableHeaderContainer = styled('th')(({ theme, variant }) => ({ ...tableHeaderPresets({ theme, variant }) }))
export const StyledRow = styled('tr')(({ theme, variant }) => ({ ':nth-of-type(1), :nth-of-type(2)': { width: '5px', padding: theme.spacing(1),}, ...tableHeaderPresets({ theme, variant })}))