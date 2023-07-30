import React, { useState, useEffect, useContext } from 'react'
import SearchBar from '../../atoms/SearchBar/SearchBar.js'
import DropDownButton from '../../atoms/DropDownButton/DropDownButton'
import { TaskControlContainer, TimePickerContainer } from './TaskControl.elements'
import TimePickerWrapper from '../../atoms/TimePickerWrapper/TimePickerWrapper.js'
import { GiOwl } from 'react-icons/gi'
import { format, parse, getTime } from 'date-fns'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeContext } from 'styled-components' // needed for theme object

function TaskControl({ variant, color, maxwidth = 818, maxwidthsearch, y0, y1, x0, x1 = -36,
	start = '14:00', end = '15:00', owlSize = '32px', overNight = false, ...rest }) {

	const theme = useContext(ThemeContext)
	const [startTime, setStartTime] = useState(parse(start, 'HH:mm', new Date()))
	const [endTime, setEndTime] = useState(parse(end, 'HH:mm', new Date()))
	const [overNightMode, setOverNightMode] = useState(overNight) // if true, then end<start means over-night
	useEffect(() => { checkTimeRange() }, [])
	useEffect(() => { checkTimeRange() }, [overNightMode])
	const checkTimeRange = () => {
		if ((getTime(endTime) < getTime(startTime)) && !overNightMode) {
			setEndTime(startTime)
			toast.warn('End time cannot be less than start time. End time is set to start time.')
		}
	}
	const setOverNight = () => {
		setOverNightMode(prev => !prev)
		if (overNightMode)
			toast.info('Overnight Mode is off: Tasks must be scheduled between 12 pm and 12 am. End time must be after the start time.', {
				autoClose: 5000,
			})
		else
			toast.info('Overnight Mode is on: You can schedule tasks overnight, and end time can be before the start time.', {
				autoClose: 5000,
			})
	}
	return (
		<TaskControlContainer variant={variant} maxwidth={maxwidth}>
			<SearchBar variant={variant} maxwidth={maxwidthsearch}{...rest} />
			<DropDownButton variant={variant} color={color} {...rest}>
			</DropDownButton>
			<TimePickerContainer onBlur={checkTimeRange}>
				<TimePickerWrapper
					variant={variant}
					defaultTime={format(startTime, 'HH:mm')}
					verticalOffset={y0}
					horizontalOffset={x0}
					controlled
					time={startTime}
					onTimeChange={newTime => setStartTime(newTime)}
				/>
				<TimePickerWrapper
					variant={variant}
					defaultTime={format(endTime, 'HH:mm')}
					displayText="End"
					verticalOffset={y1}
					horizontalOffset={x1}
					controlled
					time={endTime}
					onTimeChange={newTime => setEndTime(newTime)}
				/>
				<GiOwl style={overNightMode && { color: theme.colors.primary }}
					onClick={setOverNight}
					size={owlSize} />
			</TimePickerContainer>
		</TaskControlContainer>
	)
}

export default TaskControl