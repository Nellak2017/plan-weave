import { styled } from "@mui/system"

const variantStyle = color => ({ 'p': { color } })
const numberPickerPresets = ({ theme, variant }) => ({light: variantStyle('black'), dark: variantStyle('white'),}?.[variant])
export const PickerContainer = styled('section')(({ theme, variant }) => ({
	display: 'flex', columnGap: '10px', alignItems: 'center',
	...numberPickerPresets({ theme, variant })
}))
export const DropdownWrapper = styled('div')({ position: 'relative', display: 'inline-block' })
export const StyledNumberPicker = styled('select')(({ theme, variant }) => ({
	padding: '5px', border: '1px solid #ccc', width: '60px', cursor: 'pointer', outline: 'none', backgroundColor: 'white',
	borderRadius: theme.shape.borderRadius,
	'&:hover': { borderColor: theme.palette.primary.main, boxShadow: theme.shadows[1] },
	'&:active': { boxShadow: theme.insets.normal },
	'& > option': { padding: '5px', backgroundColor: 'white'},
}))