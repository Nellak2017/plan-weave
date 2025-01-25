import { styled } from '@mui/system'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

// TODO: Fix theme colors
const variantStyle = ({ color, hoverColor, hoverBg }) => ({
	'& svg, input, label': { color, },
	'& input:hover, div:hover': { color: hoverColor, background: hoverBg, },
})
const dateTimePickerPresets = ({ theme, variant }) => ({
	light: variantStyle({ color: 'black', hoverColor: 'white', hoverBg: 'gray',}),
	dark: variantStyle({ color: 'white', hoverColor: 'white', hoverBg: 'gray',}),
}?.[variant])
export const StyledDateTimePicker = styled(DateTimePicker)(({ theme, variant }) => ({
	'& input': { boxShadow: 'none', borderRadius: `${theme.shape.borderRadius}px 0px 0px ${theme.shape.borderRadius}px`, paddingTop: '4px', paddingBottom: '4px', },
	'& svg:hover': { color: theme.palette.primary.main, },
	'& button:hover': { backgroundColor: 'transparent', boxShadow: 'none', },
	...dateTimePickerPresets({ theme, variant })
}))