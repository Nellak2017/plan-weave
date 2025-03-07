import { styled } from '@mui/system'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

const variantStyle = ({ color, hoverColor, hoverBg }) => ({
	'& svg, input, label': { color, },
	'& input:hover, div:hover': { color: hoverColor, background: hoverBg, },
})
const dateTimePickerPresets = ({ theme, variant }) => ({
	light: variantStyle({ color: theme.palette.grey[900], hoverColor: theme.palette.grey[900], hoverBg: theme.palette.grey[100],}),
	dark: variantStyle({ color: theme.palette.lightNeutral[50], hoverColor: theme.palette.lightNeutral[50], hoverBg: theme.palette.lightNeutral[400],}),
}?.[variant])
export const StyledDateTimePicker = styled(DateTimePicker)(({ theme, variant }) => ({
	'& input': { boxShadow: 'none', borderRadius: `${theme.shape.borderRadius}px 0px 0px ${theme.shape.borderRadius}px`, paddingTop: '4px', paddingBottom: '4px', },
	'& svg:hover': { color: theme.palette.primary.main, },
	'& button:hover': { backgroundColor: 'transparent', boxShadow: 'none', },
	...dateTimePickerPresets({ theme, variant })
}))