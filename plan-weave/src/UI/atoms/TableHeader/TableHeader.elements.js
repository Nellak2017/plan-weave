import { styled } from "@mui/material"

export const TableHeaderContainer = styled('th')(({ theme }) => ({ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, }))
export const StyledRow = styled('tr')(({ theme }) => ({ ':nth-of-type(1), :nth-of-type(2)': { width: theme.spacing(1), padding: theme.spacing(1), }, backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, }))