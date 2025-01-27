import { useState, useEffect, useMemo } from 'react'
import SearchBar from '../../atoms/SearchBar/SearchBar.js'
import DropDownButton from '../../atoms/DropDownButton/DropDownButton'
import { TaskControlContainer, TopContainer, BottomContainer, BottomContentContainer, Separator, TimePickerContainer } from './TaskControl.elements'
import TimePickerWrapper from '../../atoms/TimePickerWrapper/TimePickerWrapper.js'
import { GiOwl } from 'react-icons/gi'
import { BiPlusCircle, BiTrash } from 'react-icons/bi'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatTimeLeft } from '../../../Core/utils/helpers.js'
import { DEFAULT_TASK_CONTROL_TOOL_TIPS, SORTING_METHODS, OPTION_NOTIFICATIONS, VARIANTS, TASK_CONTROL_TITLES } from '../../../Core/utils/constants.js'
import { Button } from "@mui/material"
import {
	shiftEndTime,
	checkTimeRange,
	setOverNight,
	addEvent,
	deleteEvent,
	deleteMultipleEvent,
	startTimeChangeEvent,
	endTimeChangeEvent,
} from './TaskControl.events.js'
import { useInterval } from '../../hooks/useInterval.js'
import { IoIosInformationCircleOutline } from "react-icons/io"
const handleFormat = time => {
	try {
		return format(time, 'HH:mm')
	} catch (e) {
		console.error(`startTime = ${startTime}`, e)
		return
	}
}
// services are: search, timeRange, owl, addTask, deleteMany, highlighting, updateSelectedTasks, sort, updateFirstLoad
// state is: timeRange, owl, isHighlighting, taskList, selectedTasks, dnd, theme, firstLoad
function TaskControl({
	services,
	state,
	variant = VARIANTS[0],
	color,
	maxwidth = 818,
	maxwidthsearch,
	owlSize = '32px',
	clock1Text = '', clock2Text = '',
	coords = { y0: 0, y1: 0, x0: 0, x1: -36 },
	...rest }) {
	// Input Destructuring
	const { y0, y1, x0, x1 } = { ...coords }
	const { owlToolTip, addToolTip, deleteToolTip, dropDownToolTip, fullTaskToggleTip } = DEFAULT_TASK_CONTROL_TOOL_TIPS
	const { search, sort, fullToggle, updateFirstLoad } = services || {}
	const { timeRange, owl, isHighlighting, taskList, selectedTasks, theme, fullTask, firstLoad, userId } = state || {}
	const startTime = useMemo(() => timeRange?.start ? parseISO(timeRange?.start) : new Date(), [timeRange])
	const endTime = useMemo(() => timeRange?.end ? parseISO(timeRange?.end) : new Date(), [timeRange])
	// Local State
	const [currentTime, setCurrentTime] = useState(new Date()) // Actual Time of day, Date object
	const [isDeleteClicked, setIsDeleteClicked] = useState(false) // used to track if delete has been presed once or not (HOF didn't work)
	const options = useMemo(() => Object.keys(SORTING_METHODS).map(name => ({
		name: name || 'default',
		listener: () => {
			OPTION_NOTIFICATIONS[name]() // This will do a toast notification when option is pressed
			sort(name) // service for changing the sortingAlgo based on the name
		}
	})), [sort]) // Drop-down options for sorting methods. 
	// Effects
	useEffect(() => checkTimeRange(services, toast, endTime, startTime, owl), [owl, services, endTime, startTime])
	useInterval(() => setCurrentTime(new Date()), 33, [currentTime])
	useEffect(() => {
		if (!firstLoad) return // early return
		updateFirstLoad(false) // To prevent the increment when user changes page bug
		if (owl) { shiftEndTime(services, 24, startTime, endTime, 2 * 24) }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<TaskControlContainer variant={variant} maxwidth={maxwidth}>
			<TopContainer>
				<SearchBar
					state={{ variant, maxwidth: maxwidthsearch, }}
					services={{ search }}
					title={'Search for Tasks'} tabIndex={0} {...rest}
				/>
				<p title={'Current Time'}>{format(currentTime, 'HH:mm')}</p>
				<TimePickerContainer onBlur={checkTimeRange}>
					<TimePickerWrapper
						state={{
							variant, defaultTime: handleFormat(startTime), displayText: clock1Text,
							offset: { verticalOffset: y0, horizontalOffset: x0, },
						}}
						services={{ onTimeChange: newTime => startTimeChangeEvent(services, newTime) }}
						tabIndex={0}
						title={TASK_CONTROL_TITLES.startButton}
					/>
					<TimePickerWrapper
						state={{
							variant, defaultTime: format(endTime, 'HH:mm'), displayText: clock2Text,
							offset: { verticalOffset: y1, horizontalOffset: x1, },
						}}
						services={{ onTimeChange: newTime => endTimeChangeEvent(services, newTime) }}
						tabIndex={0}
						title={TASK_CONTROL_TITLES.endButton}
					/>
					<GiOwl
						tabIndex={0}
						title={owlToolTip}
						style={owl && { color: theme.colors.primary }}
						onClick={() => setOverNight(services, owl, startTime, endTime)}
						onKeyDown={e => { if (e.key === 'Enter') { setOverNight(services, owl, startTime, endTime) } }}
						size={owlSize}
						data-testid={'owl-button'}
					/>
				</TimePickerContainer>
			</TopContainer>
			<BottomContainer>
				<BottomContentContainer>
					<BiPlusCircle
						tabIndex={0}
						title={addToolTip}
						onClick={() => addEvent(services, userId)}
						onKeyDown={e => { if (e.key === 'Enter') { addEvent(services, userId) } }}
						size={owlSize}
						data-testid={'add-button'}
					/>
					<IoIosInformationCircleOutline
						tabIndex={0}
						title={fullTaskToggleTip}
						style={fullTask && { color: theme.colors.primary }}
						onClick={() => fullToggle()}
						onKeyDown={e => { if (e.key === 'Enter') { fullToggle() } }}
						size={owlSize}
						data-testid={'full-task-toggle-button'}
					/>
					<BiTrash
						tabIndex={0}
						title={deleteToolTip}
						style={isHighlighting && { color: theme.colors.primary }}
						onClick={() => deleteEvent(services, toast, setIsDeleteClicked, isHighlighting, taskList)}
						onKeyDown={e => { if (e.key === 'Enter') { deleteEvent(services, toast, setIsDeleteClicked, isHighlighting, taskList) } }}
						size={owlSize}
						data-testid={'multi-delete-button'}
					/>
					{isHighlighting &&
						<Button
							variant={'delete'} tabIndex={0} title={'Delete Selected Tasks'}
							onClick={() => deleteMultipleEvent({ state: { userId, selectedTasks, taskList, isDeleteClicked, toast }, services: { deleteMany: services?.deleteMany, highlighting: services?.highlighting, setIsDeleteClicked }, })}
							onKeyDown={e => { if (e.key === 'Enter') { deleteMultipleEvent({ state: { userId, selectedTasks, taskList, isDeleteClicked, toast }, services: { deleteMany: services?.deleteMany, highlighting: services?.highlighting, setIsDeleteClicked }, }) } }}
						>
							Delete
						</Button>
					}
					<Separator variant={variant} color={color} />
				</BottomContentContainer>
				<BottomContentContainer>
					<p title={'Time left until End of Task Period'}>{formatTimeLeft({ currentTime, endTime, owl })}</p>
				</BottomContentContainer>
				<BottomContentContainer>
					<Separator variant={variant} color={color} />
					<DropDownButton options={options} tabIndex={0} title={dropDownToolTip} {...rest} />
				</BottomContentContainer>
			</BottomContainer>
		</TaskControlContainer>
	)
}
export default TaskControl