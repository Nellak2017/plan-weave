import { styled } from "@mui/system"

export const PickerContainer = styled('section')(({ theme }) => ({ display: 'flex', columnGap: theme.spacing(2), alignItems: 'center', p: { color: theme.palette.text.primary } }))
export const DropdownWrapper = styled('div')({ position: 'relative', display: 'inline-block' })
export const StyledNumberPicker = styled('select')(({ theme }) => ({
	textAlign: 'center', padding: theme.spacing(1), border: `1px solid ${theme.palette.divider}`, width: theme.spacing(6), cursor: 'pointer', outline: 'none', backgroundColor: theme.palette.grey[50], borderRadius: theme.shape.borderRadius,
	'&:hover': { borderColor: theme.palette.primary.main, boxShadow: theme.shadows[1] },
	'&:active': { boxShadow: theme.insets.normal },
	'& > option': { backgroundColor: theme.palette.grey[50] },
}))