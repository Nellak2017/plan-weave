import { useState } from 'react'
import { StyledDateTimePicker } from './DateTimePickerWrapper.elements.js'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { parse } from 'date-fns'

export const DateTimePickerWrapper = ({
	state: { label = 'Choose Due Date', defaultTime = '14:00', defaultDate = new Date() } = {},
	services: { onTimeChange = newDateTime => console.log(newDateTime) } = {}
}) => {
	const [dateTime, setDateTime] = useState(parse(defaultTime, 'HH:mm', defaultDate))
	const handleDateTimeChange = newDateTime => {
		setDateTime(newDateTime)
		if (onTimeChange) onTimeChange(newDateTime) // Pass state to parent
	}
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<StyledDateTimePicker
				label={label} value={dateTime}
				onChange={handleDateTimeChange} slotProps={{ textField: { readOnly: true } }}
				viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock, seconds: renderTimeViewClock, }}
			/>
		</LocalizationProvider>
	)
}
export default DateTimePickerWrapper