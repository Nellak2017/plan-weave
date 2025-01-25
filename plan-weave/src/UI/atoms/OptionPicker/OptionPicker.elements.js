import { styled } from "@mui/material"
import { TextField, Chip } from '@mui/material'

// TODO: Align styles with Theme and Light / Dark variants
export const StyledTextField = styled(TextField)(({ theme, variant }) => ({
	minWidth: '200px', width: '100%', color: 'black',
	'& .MuiInputBase-root': { padding: '0!important' }, // Remove input padding
	'& .MuiInputLabel-root': { transform: 'translate(16px, 7px) scale(1)' }, // Adjust the label position
	'& .MuiInputLabel-shrink': { transform: 'translate(12px, -11px) scale(0.75)' }, // Adjust shrunk label position
	'label, button': { color: 'white' },
	'button:hover': { color: theme.palette.primary.main },
	'input, input:hover': { color: 'white', boxShadow: 'none' },
}))
export const StyledChip = styled(Chip)(({ theme, variant }) => ({
	backgroundColor: 'rgba(0,0,0,0.16)', 'svg:hover > path': { color: theme.palette.error.main, },
}))
export const StyledOption = styled('li')(({ theme, variant, selected }) => ({ color: 'black', boxShadow: 'none' }))