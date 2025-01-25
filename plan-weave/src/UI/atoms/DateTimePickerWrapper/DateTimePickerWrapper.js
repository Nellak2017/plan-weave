import { useState } from 'react'
import { StyledDateTimePicker } from './DateTimePickerWrapper.elements.js'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { parse } from 'date-fns'
import { VARIANTS } from '../../../Core/utils/constants.js'

export const DateTimePickerWrapper = ({ services, state, }) => {
	const { onTimeChange = newDateTime => console.log(newDateTime) } = services || {}
	const { variant = VARIANTS[0], label = 'Choose Due Date', defaultTime = '14:00', defaultDate = new Date() } = state || {}
	const [dateTime, setDateTime] = useState(parse(defaultTime, 'HH:mm', defaultDate))
	const handleDateTimeChange = newDateTime => {
		setDateTime(newDateTime)
		if (onTimeChange) onTimeChange(newDateTime) // Pass state to parent
	}
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<StyledDateTimePicker
				variant={variant} label={label} value={dateTime}
				onChange={handleDateTimeChange} slotProps={{ textField: { readOnly: true } }}
				viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock, seconds: renderTimeViewClock, }}
			/>
		</LocalizationProvider>
	)
}
export default DateTimePickerWrapper