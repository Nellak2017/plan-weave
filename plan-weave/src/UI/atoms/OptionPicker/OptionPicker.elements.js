import { styled, TextField, Chip } from "@mui/material"

export const StyledTextField = styled(TextField)(({ theme }) => ({
	minWidth: '200px', width: '100%', color: theme.palette.text.primary,
	'& .MuiInputBase-root': { padding: '0!important' }, // Remove input padding 
	'& .MuiInputLabel-root': { transform: 'translate(16px, 7px) scale(1)' }, // Adjust the label position
	'& .MuiInputLabel-shrink': { transform: 'translate(12px, -11px) scale(0.75)' }, // Adjust shrunk label position
	'& .MuiAutocomplete-inputRoot': { flexWrap: 'nowrap!important', }, // Remove the flex wrap weirdness
	'label, button': { color: theme.palette.text.primary },
	'button:hover': { color: theme.palette.primary.main },
	'input': { color: theme.palette.text.primary, boxShadow: theme.shadows[0], },
	'input:hover': { backgroundColor: theme.palette.action.hover },
}))
export const StyledChip = styled(Chip)(({ theme }) => ({ span: { color: theme.palette.text.primary, }, 'svg:hover > path': { color: theme.palette.error.main, }, }))
export const StyledOption = styled('li')(({ theme }) => ({ color: theme.palette.text.primary, boxShadow: theme.shadows[0] }))