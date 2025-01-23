import { useState } from 'react'
import {
	PickerContainer,
} from './DateTimePickerWrapper.elements.js'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { parse } from 'date-fns'
import { VARIANTS } from '../../../Core/utils/constants.js'

// Styled Components can't be used on MUI DateTimePicker! 
const DateTimePickerWrapper = ({
	variant = VARIANTS[0],
	services = { onTimeChange: (newDateTime) => console.log(newDateTime) },
	state = {
		label: 'Choose Due Date',
		defaultTime: '14:00',
		defaultDate: new Date(),
	},
}) => {
	const { onTimeChange } = services || {}
	const { label, defaultTime, defaultDate } = state || {}
	const [dateTime, setDateTime] = useState(parse(defaultTime, 'HH:mm', defaultDate))
	const handleDateTimeChange = newDateTime => {
		setDateTime(newDateTime)
		if (onTimeChange) onTimeChange(newDateTime) // Pass state to parent
	}
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<PickerContainer variant={variant}>
				<DateTimePicker
					label={label}
					value={dateTime}
					onChange={handleDateTimeChange}
					slotProps={{ textField: { readOnly: true } }}
					viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock, seconds: renderTimeViewClock, }}
				/>
			</PickerContainer>
		</LocalizationProvider>
	)
}
export default DateTimePickerWrapper