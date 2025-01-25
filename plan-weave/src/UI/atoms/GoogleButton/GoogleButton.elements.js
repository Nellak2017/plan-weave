import { styled } from "@mui/material"

export const StyledGoogleButton = styled('button')(({ theme }) => ({
	backgroundColor: '#fff', color: '#00000087', padding: '11px 8px', boxShadow: `${theme.shadows[1]}`,
	display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: '24px',
	fontFamily: "'Roboto', sans-serif", fontWeight: 'bold', fontSize: '14px',
	'&:hover': { backgroundColor: '#fff', color: '#4285F4', boxShadow: `${theme.shadows[1]}`,},
	'&:focus': { outline: '2px solid #4285F4' }
}))