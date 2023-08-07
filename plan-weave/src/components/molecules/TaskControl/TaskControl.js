import React, { useState, useEffect, useContext } from 'react'
import SearchBar from '../../atoms/SearchBar/SearchBar.js'
import DropDownButton from '../../atoms/DropDownButton/DropDownButton'
import {
	TaskControlContainer,
	TopContainer,
	BottomContainer,
	BottomContentContainer,
	Separator,
	TimePickerContainer
} from './TaskControl.elements'
import TimePickerWrapper from '../../atoms/TimePickerWrapper/TimePickerWrapper.js'
import { GiOwl } from 'react-icons/gi'
import { BiPlusCircle, BiTrash } from 'react-icons/bi'
import { format, parse, getTime } from 'date-fns'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeContext } from 'styled-components' // needed for theme object

/* 
TODO: 
- [ ] Add in the Add and Delete Events From Parent Organism whenever we make the Task Row Molecule
- [ ] If Tab Index is messed up from Other Components, fix it with dynamic tab index assignment
*/

function TaskControl({ variant, color, maxwidth = 818, maxwidthsearch, y0, y1, x0, x1 = -36,
	start = '10:30', end = '23:30', owlSize: iconSize = '32px', overNight = false,
	clock1Text = '', clock2Text = '', owlToolTip = 'Toggle Overnight Mode', addToolTip = 'Add a New Task',
	deleteToolTip = 'Delete selected', dropDownToolTip = 'Select Sorting Method',
	...rest }) {

	const theme = useContext(ThemeContext)
	const [currentTime, setCurrentTime] = useState(new Date()) // Actual Time of day, Date object
	const [startTime, setStartTime] = useState(parse(start, 'HH:mm', new Date()))
	const [endTime, setEndTime] = useState(parse(end, 'HH:mm', new Date()))
	const [overNightMode, setOverNightMode] = useState(overNight) // if true, then end<start means over-night
	useEffect(() => { checkTimeRange() }, [])
	useEffect(() => { checkTimeRange() }, [overNightMode])
	useEffect(() => {
		const intervalId = setInterval(() => { setCurrentTime(new Date()) }, 30000)
		return () => { clearInterval(intervalId) }
	}, []) // update time every 30 seconds
	useEffect(() => {
		calculateTimeLeft({overNight:overNightMode})
	}, [currentTime, startTime, endTime])
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
	// Bottom Left Icon Events
	const addEvent = () => {
		toast.info('TODO: Complete Add Event')
		console.log('TODO: Complete Add Event')
	}
	const deleteEvent = () => {
		toast.info('TODO: Complete Delete Event')
		console.log('TODO: Complete Delete Event')
	}
	// Bottom Center Calculations
	const calculateTimeLeft = ({minuteText = ' minutes left', hourText = ' hours', hourText2 = ' hours left', overNight = false}) => {
		const currentTimeValue = currentTime.getTime()
		let endTimeValue = getTime(endTime)

		// If the end time is before the current time, assume it is on the next day
		if (endTimeValue < currentTimeValue && overNight) {
			let nextDay = new Date(endTime)
			nextDay.setDate(nextDay.getDate() + 1)
			endTimeValue = getTime(nextDay)
		}

		const timeLeftInHours = Math.max(Math.floor((endTimeValue - currentTimeValue) / (1000 * 60 * 60)), 0)
		const timeLeftInMinutes = Math.max(Math.floor((endTimeValue - currentTimeValue) / (1000 * 60)) % 60, 0)

		if (timeLeftInHours > 0) {
			return timeLeftInMinutes > 0 ?
				`${timeLeftInHours} ${hourText} ${timeLeftInMinutes} ${minuteText}` :
				`${timeLeftInHours} ${hourText2}`
		} else {
			return `${timeLeftInMinutes} ${minuteText}`
		}
	}

	return (
		<TaskControlContainer variant={variant} maxwidth={maxwidth}>
			<TopContainer>
				<SearchBar tabIndex={1} title={'Search for Tasks'} variant={variant} maxwidth={maxwidthsearch}{...rest} />
				<p title={'Current Time'}>{format(currentTime, 'HH:mm')}</p>
				<TimePickerContainer onBlur={checkTimeRange}>
					<TimePickerWrapper
						tabIndex={2}
						title={'Enter Start Time'}
						variant={variant}
						defaultTime={format(startTime, 'HH:mm')}
						displayText={clock1Text}
						verticalOffset={y0}
						horizontalOffset={x0}
						controlled
						time={startTime}
						onTimeChange={newTime => setStartTime(newTime)}
					/>
					<TimePickerWrapper
						tabIndex={3}
						title={'Enter End Time'}
						variant={variant}
						defaultTime={format(endTime, 'HH:mm')}
						displayText={clock2Text}
						verticalOffset={y1}
						horizontalOffset={x1}
						controlled
						time={endTime}
						onTimeChange={newTime => setEndTime(newTime)}
					/>
					<GiOwl
						tabIndex={4}
						title={owlToolTip}
						role="button"
						style={overNightMode && { color: theme.colors.primary }}
						onClick={setOverNight}
						onKeyDown={e => { if (e.key === 'Enter') { setOverNight() } }}
						size={iconSize} />
				</TimePickerContainer>
			</TopContainer>
			<BottomContainer>
				<BottomContentContainer>
					<BiPlusCircle
						tabIndex={5}
						title={addToolTip}
						role="button"
						onClick={addEvent}
						onKeyDown={e => { if (e.key === 'Enter') { addEvent() } }}
						size={iconSize}
					/>
					<BiTrash
						tabIndex={6}
						title={deleteToolTip}
						role="button"
						onClick={deleteEvent}
						onKeyDown={e => { if (e.key === 'Enter') { deleteEvent() } }}
						size={iconSize}
					/>
					<Separator variant={variant} color={color} />
				</BottomContentContainer>
				<BottomContentContainer>
					<p title={'time left until end of task period'}>{calculateTimeLeft({overNight:overNightMode})}</p>
				</BottomContentContainer>
				<BottomContentContainer>
					<Separator variant={variant} color={color} />
					<DropDownButton
						tabIndex={7}
						title={dropDownToolTip}
						role="button"
						variant={variant}
						color={color}
						{...rest}
					/>
				</BottomContentContainer>
			</BottomContainer>
		</TaskControlContainer>
	)
}

export default TaskControl