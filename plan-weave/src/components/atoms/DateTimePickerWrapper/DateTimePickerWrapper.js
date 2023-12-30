import { useState } from 'react'
import {
	PickerContainer,
} from './DateTimePickerWrapper.elements.js'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { TextField } from '@mui/material'
import { parse } from 'date-fns'
import { THEMES } from '../../utils/constants'

import PropTypes from 'prop-types'

// Styled Components can't be used on MUI DateTimePicker! 
function DateTimePickerWrapper({
	variant,
	services = {
		onTimeChange: (newDateTime) => console.log(newDateTime)
	},
	state = {
		label: 'Choose Due Date',
		defaultTime: '14:00',
		defaultDate: new Date(),
	},
}) {
	// --- Verify Input
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const { onTimeChange } = services || {}
	const { label, defaultTime, defaultDate } = state || {}
	//console.log(defaultDate)
	// --- Local State
	const [dateTime, setDateTime] = useState(parse(defaultTime, 'HH:mm', defaultDate))

	// --- Handlers
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
					viewRenderers={{
						hours: renderTimeViewClock,
						minutes: renderTimeViewClock,
						seconds: renderTimeViewClock,
					}}
				/>
			</PickerContainer>
		</LocalizationProvider>
	)
}

export default DateTimePickerWrapper