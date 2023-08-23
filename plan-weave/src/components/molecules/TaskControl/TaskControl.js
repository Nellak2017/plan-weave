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
import { formatTimeLeft } from '../../utils/helpers.js'
import { THEMES, DEFAULT_TASK_CONTROL_TOOL_TIPS } from '../../utils/constants.js'

import { useDispatch } from 'react-redux'
import { addNewTask } from '../../../redux/thunks/taskThunks.js'
import { TaskEditorContext } from '../../organisms/TaskEditor/TaskEditor.js'
/* 
TODO: 
- [ ] Add in the Add and Delete Events From Parent Organism whenever we make the Task Row Molecule
- [ ] If Tab Index is messed up from Other Components, fix it with dynamic tab index assignment
- [ ] Whenever you add the API middleware for adding tasks, update add method so that unique id is ensured even on db
*/

function TaskControl({ variant, color, maxwidth = 818, maxwidthsearch, y0, y1, x0, x1 = -36,
	start = '10:30', end = '23:30', owlSize: iconSize = '32px', overNight = false,
	clock1Text = '', clock2Text = '', toolTips = DEFAULT_TASK_CONTROL_TOOL_TIPS,
	...rest }) {

	// Input Validation and Destructuring
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	const { owlToolTip, addToolTip, deleteToolTip, dropDownToolTip } = { ...toolTips }

	// Context and Redux Stuff
	const theme = useContext(ThemeContext)
	const dispatch = useDispatch()
	const { taskList, setTaskList, search, setSearch, timeRange, setTimeRange, setOwl } = !TaskEditorContext._currentValue ? { 1: '', 2: '' } : useContext(TaskEditorContext)

	// State
	const [currentTime, setCurrentTime] = useState(new Date()) // Actual Time of day, Date object
	const [startTime, setStartTime] = useState(!TaskEditorContext._currentValue ? parse(start, 'HH:mm', new Date()) : timeRange.start)
	const [endTime, setEndTime] = useState(!TaskEditorContext._currentValue ? parse(end, 'HH:mm', new Date()) : timeRange.end)
	const [overNightMode, setOverNightMode] = useState(overNight) // if true, then end<start means over-night

	// Effects
	useEffect(() => { checkTimeRange() }, [overNightMode])
	useEffect(() => {
		const intervalId = setInterval(() => { setCurrentTime(new Date()) }, 1000)
		return () => { clearInterval(intervalId) }
	}, [currentTime]) // update time every 1 second

	// Clock helpers (with side-effects)
	const checkTimeRange = () => {
		if ((getTime(endTime) < getTime(startTime)) && !overNightMode) {
			setEndTime(startTime)
			toast.warn('End time cannot be less than start time. End time is set to start time.')
		}
	}
	const setOverNight = () => {
		setOverNightMode(prev => !prev)
		setOwl(prev => !prev) // for context use
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
		toast.info('You added a New Default Task')
		if (taskList) addNewTask({
			task: '',
			waste: 1,
			ttc: 1,
			eta: '12:00',
			status: 'incomplete',
			id: taskList?.length + 1,
			timestamp: Math.floor((new Date().getTime()) / 1000)
		})(dispatch)
		console.log('You added a New Default Task')
	}
	const deleteEvent = () => {
		toast.info('TODO: Complete Delete Event')
		console.log('TODO: Complete Delete Event')
	}

	// Update start/end time in Context Provided
	useEffect(() => {
		setTimeRange({
			start: startTime,
			end: endTime
		})
	}, [startTime, endTime])

	return (
		<>
			<TaskControlContainer variant={variant} maxwidth={maxwidth}>
				<TopContainer>
					<SearchBar
						tabIndex={1}
						title={'Search for Tasks'}
						variant={variant}
						maxwidth={maxwidthsearch}
						onChange={value => setSearch(value)}
						{...rest}
					/>
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
						<p title={'Time left until End of Task Period'}>{formatTimeLeft({ currentTime, endTime, overNightMode })}</p>
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
		</>
	)
}

export default TaskControl