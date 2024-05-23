import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
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
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatTimeLeft } from '../../utils/helpers.js'
import { THEMES, DEFAULT_TASK_CONTROL_TOOL_TIPS, SORTING_METHODS, OPTION_NOTIFICATIONS, VARIANTS } from '../../utils/constants.js'
import Button from '../../atoms/Button/Button.js'
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
import { useInterval } from '../../../hooks/useInterval.js'
import { IoIosInformationCircleOutline } from "react-icons/io"

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

	// Input Validation and Destructuring
	const processedVariant = (variant && !THEMES.includes(variant)) ? VARIANTS[0] : variant
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
		if (owl) {
			shiftEndTime(services, 24, startTime, endTime, 2 * 24)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleFormat = (time) => {
		try {
			return format(time, 'HH:mm')
		} catch (e) {
			console.error(`startTime = ${startTime}`,e)
			return
		}
	}

	return (
		<TaskControlContainer variant={processedVariant} maxwidth={maxwidth}>
			<TopContainer>
				<SearchBar
					services={{ search }}
					tabIndex={0}
					title={'Search for Tasks'}
					variant={processedVariant}
					maxwidth={maxwidthsearch}
					{...rest}
				/>
				<p title={'Current Time'}>{format(currentTime, 'HH:mm')}</p>
				<TimePickerContainer onBlur={checkTimeRange}>
					<TimePickerWrapper
						tabIndex={0}
						title={'Enter Start Time'}
						variant={processedVariant}
						defaultTime={handleFormat(startTime)}
						displayText={clock1Text}
						verticalOffset={y0}
						horizontalOffset={x0}
						controlled
						time={startTime}
						onTimeChange={newTime => startTimeChangeEvent(services, newTime)}
						testid={'start-time-picker'} // used in testing
					/>
					<TimePickerWrapper
						tabIndex={0}
						title={'Enter End Time'}
						variant={processedVariant}
						defaultTime={format(endTime, 'HH:mm')}
						displayText={clock2Text}
						verticalOffset={y1}
						horizontalOffset={x1}
						controlled
						time={endTime}
						onTimeChange={newTime => endTimeChangeEvent(services, newTime)}
						testid={'end-time-picker'} // used in testing
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
							tabIndex={0}
							variant={'delete'}
							title={'Delete Selected Tasks'}
							onClick={() => deleteMultipleEvent(services, toast, taskList, setIsDeleteClicked, selectedTasks, isDeleteClicked, userId)}
							onKeyDown={e => { if (e.key === 'Enter') { deleteMultipleEvent(services, toast, taskList, setIsDeleteClicked, selectedTasks, isDeleteClicked, userId) } }}
						>
							Delete
						</Button>
					}
					<Separator variant={processedVariant} color={color} />
				</BottomContentContainer>
				<BottomContentContainer>
					<p title={'Time left until End of Task Period'}>{formatTimeLeft({ currentTime, endTime, owl })}</p>
				</BottomContentContainer>
				<BottomContentContainer>
					<Separator variant={processedVariant} color={color} />
					<DropDownButton
						tabIndex={0}
						title={dropDownToolTip}
						variant={processedVariant}
						color={color}
						options={options}
						{...rest}
					/>
				</BottomContentContainer>
			</BottomContainer>
		</TaskControlContainer>
	)
}

TaskControl.propTypes = {
	services: PropTypes.shape({
		search: PropTypes.func,
		timeRange: PropTypes.func,
		owl: PropTypes.func,
		addTask: PropTypes.func,
		deleteMany: PropTypes.func,
		highlighting: PropTypes.func,
		updateSelectedTasks: PropTypes.func,
		sort: PropTypes.func,
	}).isRequired,

	state: PropTypes.shape({
		timeRange: PropTypes.object,
		owl: PropTypes.bool,
		isHighlighting: PropTypes.bool,
		taskList: PropTypes.array,
		selectedTasks: PropTypes.array,
		theme: PropTypes.object,
	}).isRequired,

	variant: PropTypes.oneOf(VARIANTS),
	color: PropTypes.string,
	maxwidth: PropTypes.number,
	maxwidthsearch: PropTypes.number,
	owlSize: PropTypes.string,
	clock1Text: PropTypes.string,
	clock2Text: PropTypes.string,
	coords: PropTypes.shape({
		y0: PropTypes.number,
		y1: PropTypes.number,
		x0: PropTypes.number,
		x1: PropTypes.number,
	}),
	toolTips: PropTypes.shape({
		owlToolTip: PropTypes.string,
		addToolTip: PropTypes.string,
		deleteToolTip: PropTypes.string,
		dropDownToolTip: PropTypes.string,
	}),
}

export default TaskControl