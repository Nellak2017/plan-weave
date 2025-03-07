import { styled } from '@mui/system'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

export const StyledDateTimePicker = styled(DateTimePicker)(({ theme }) => ({
	'& input': { boxShadow: theme.shadows[0], borderRadius: `${theme.shape.borderRadius}px 0px 0px ${theme.shape.borderRadius}px`, paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1), },
	'& svg:hover': { color: theme.palette.primary.main, },
	'& button:hover': { backgroundColor: 'transparent', boxShadow: theme.shadows[0], },
	'& svg, input, label': { color: theme.palette.text.primary, },
	'& input:hover, div:hover': { color: theme.palette.text.primary, background: theme.palette.action.hover, },
}))