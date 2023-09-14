import React, { useState, useEffect, useContext, useMemo } from 'react'
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
import Button from '../../atoms/Button/Button.js'
import { useDispatch } from 'react-redux'
import { addNewTask, removeTasks } from '../../../redux/thunks/taskThunks.js'
import { TaskEditorContext } from '../../organisms/TaskEditor/TaskEditor.js'

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
	const { taskList, setSearch, timeRange, setTimeRange, owl, setOwl,
		isHighlighting, setIsHighlighting, selectedTasks, setSelectedTasks, dnd, setDnd } = !TaskEditorContext._currentValue ? { 1: '', 2: '' } : useContext(TaskEditorContext)

	// State
	const [currentTime, setCurrentTime] = useState(new Date()) // Actual Time of day, Date object
	const [startTime, setStartTime] = useState(!TaskEditorContext._currentValue ? parse(start, 'HH:mm', new Date()) : timeRange.start)
	const [endTime, setEndTime] = useState(!TaskEditorContext._currentValue ? parse(end, 'HH:mm', new Date()) : timeRange.end)
	const [overNightMode, setOverNightMode] = useState(owl === undefined || owl === null ? overNight : owl) // if true, then end<start means over-night

	const [isDeleteClicked, setIsDeleteClicked] = useState(false) // used to track if delete has been presed once or not (HOF didn't work)

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
		if (setOwl) setOwl(prev => !prev) // for context use
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
	const addDnDEvent = dnd => [0, ...dnd.map(el => el + 1)]
	const addEvent = () => {
		toast.info('You added a New Default Task')
		if (taskList) addNewTask({
			task: '',
			waste: 1,
			ttc: 1,
			eta: '12:00',
			status: 'incomplete',
			id: new Date().getTime(), // guarantees unique ids down to the millisecond!
			timestamp: Math.floor((new Date().getTime()) / 1000)
		})(dispatch)
		setDnd(addDnDEvent(dnd))
	}
	
	const deleteEvent = () => {
		if (!isHighlighting) {
			setIsDeleteClicked(false)
			toast.info('You may now select multiple tasks to delete at once! Click again to toggle.')
		}
		if (setIsHighlighting) {
			if (setSelectedTasks) setSelectedTasks(taskList.map(() => false))
			setIsHighlighting(old => !old)
		}
	}

	const deleteMultipleEvent = () => {
		const tasksAreSelected = selectedTasks.some(task => task === true) // if there is atleast 1 task selected then true
		if (tasksAreSelected && !isDeleteClicked) {
			setIsDeleteClicked(true) // This is to prevent the user from spamming the delete buttom multiple times
			toast.warning(({ closeToast }) => (
				<div>
					<p style={{ color: 'black' }}>Warning, you are deleting multiple tasks. Are you sure?</p>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
						<Button variant={'delete'} onClick={() => {
							const selectedIds = selectedTasks
								.map((selected, index) =>
									selected
										? taskList[index]?.id // it should have id, but ? to be safe
										: selected)
								.filter(selected => typeof selected !== 'boolean')
							removeTasks(selectedIds)(dispatch)
							setIsHighlighting(false)
							closeToast()
						}}>
							Yes
						</Button>
						<Button variant={'newTask'} onClick={() => {
							setIsDeleteClicked(false)
							closeToast()
						}}>
							No
						</Button>
					</div>
				</div>
			),
				{
					position: toast.POSITION.TOP_CENTER,
					autoClose: false, // Don't auto-close the toast
					closeOnClick: false, // Keep the toast open on click
					closeButton: false, // Don't show a close button
					draggable: false, // Prevent dragging to close
				})
		}
	}

	// Update start/end time in Context Provided
	useEffect(() => {
		if (setTimeRange) setTimeRange({
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
						onChange={value => setSearch && setSearch(value)}
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
							style={isHighlighting && { color: theme.colors.primary }}
							onClick={deleteEvent}
							onKeyDown={e => { if (e.key === 'Enter') { deleteEvent() } }}
							size={iconSize}
						/>
						{isHighlighting &&
							<Button
								tabIndex={7}
								variant={'delete'}
								title={'Delete Selected Tasks'}
								role="button"
								onClick={deleteMultipleEvent}
								onKeyDown={e => { if (e.key === 'Enter') { deleteMultipleEvent } }}
							>
								Delete
							</Button>
						}
						<Separator variant={variant} color={color} />
					</BottomContentContainer>
					<BottomContentContainer>
						<p title={'Time left until End of Task Period'}>{formatTimeLeft({ currentTime, endTime, overNightMode })}</p>
					</BottomContentContainer>
					<BottomContentContainer>
						<Separator variant={variant} color={color} />
						<DropDownButton
							tabIndex={8}
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