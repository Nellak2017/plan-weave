import { styled } from "@mui/system"

const variantStyle = color => ({ 'p': { color } })
const numberPickerPresets = ({ variant }) => ({ light: variantStyle('black'), dark: variantStyle('white'), }?.[variant])
export const PickerContainer = styled('section')(({ theme, variant }) => ({ display: 'flex', columnGap: theme.spacing(2), alignItems: 'center', ...numberPickerPresets({ theme, variant })}))
export const DropdownWrapper = styled('div')({ position: 'relative', display: 'inline-block' })
export const StyledNumberPicker = styled('select')(({ theme }) => ({
	textAlign: 'center', padding: theme.spacing(1), border: '1px solid #ccc', width: theme.spacing(6), cursor: 'pointer', outline: 'none', backgroundColor: theme.palette.lightNeutral[50], borderRadius: theme.shape.borderRadius,
	'&:hover': { borderColor: theme.palette.primary.main, boxShadow: theme.shadows[1] },
	'&:active': { boxShadow: theme.insets.normal },
	'& > option': { backgroundColor: theme.palette.lightNeutral[50] },
}))