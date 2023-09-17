import React, { useState, useMemo, useContext } from 'react'
import { THEMES } from '../../utils/constants'
import { isInt } from '../../utils/helpers'
import { PaginationContainer, PageChooserContainer } from '../Pagination/Pagination.elements'
import NextButton from '../../atoms/NextButton/NextButton'
import HoursInput from '../../atoms/HoursInput/HoursInput'
import NumberPicker from '../../atoms/NumberPicker/NumberPicker'
import { BiRecycle } from 'react-icons/bi'
import { TaskEditorContext } from '../../organisms/TaskEditor/TaskEditor.js'

// TODO: Review styles and add Size support for sub-components (see style todos in the relevant components)
function Pagination({ variant = 'dark',
	min = 1,
	max, // optional, if not defined, then we calc with total
	hoursText, // optional, if defined it overrides the default of ${num} text
	defaultNumber = 10,
	options = [10, 20],
	pickerText = 'Tasks per page',
	maxWidth, // optional
	size = 'l',
	total = 9, // optional, if defined then we use this to find the max
	onPageChange,
	onTasksPerPageChange
}) {
	// --- Input verification
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (!total && !isInt(max)) max = 1
	if (total && !isInt(max)) max = Math.ceil(total / (defaultNumber || 10))

	// --- Context (for Refresh Feature)
	const { setTimeRange, setTaskList } = useContext(TaskEditorContext)

	// --- State
	// define local max here
	const [tasksPerPage, setTasksPerPage] = useState(defaultNumber || 10)
	const [pageNumber, setPageNumber] = useState(isInt(min) ? min : 1)

	const maxPage = useMemo(() => Math.ceil(total / tasksPerPage)) // re-calculate when anything changes

	// --- Local Helpers
	// (Date) other Date -> (Date) today Date with other's time
	const dateToToday = (start) => {
		const initOfToday = new Date().setHours(0, 0, 0, 0) // beginning of today in millis
		const initOfStart = new Date(start).setHours(0, 0, 0, 0)
		const timeSinceStart = start.getTime() - initOfStart // millis since start's start of day
		return new Date(initOfToday + timeSinceStart) // start but with today's date
	}

	// --- Handlers
	const handleTasksPerPage = e => {
		const newValue = parseInt(e)
		setTasksPerPage(newValue)

		// Notify parent component about tasks per page change
		if (onTasksPerPageChange) onTasksPerPageChange(newValue)
	}

	const handlePageNumber = e => {
		const newValue = parseInt(e)
		setPageNumber(newValue)

		// Notify parent component about page number change
		if (onPageChange) onPageChange(newValue)
	}

	const handleNextPage = () => {
		const newPageNum = parseInt((pageNumber + 1)) <= parseInt(max) ? parseInt(pageNumber + 1) : parseInt(pageNumber)
		setPageNumber(newPageNum)
		if (onPageChange) onPageChange(newPageNum)
	}
	const handlePreviousPage = () => {
		const newPageNum = parseInt((pageNumber - 1)) >= parseInt(min) ? parseInt(pageNumber - 1) : parseInt(pageNumber)
		setPageNumber(newPageNum)
		if (onPageChange) onPageChange(newPageNum)
	}

	const handleRefresh = () => {
		/* 
			1. update start to be for today (get time from today and set date to be today's)
			2. update every task in the task list to have timestamp for today but with it's hours
		*/
		setTimeRange(old => ({ ...old, start: dateToToday(old['start']) }))
		setTaskList(old => old.map(task => ({ ...task , timestamp : dateToToday(new Date(task.timestamp)).getTime() / 1000 })))
	}

	return (
		<PaginationContainer variant={variant} maxWidth={maxWidth}>
			<BiRecycle
				className='pagination-icon'
				tabIndex={1}
				title={'Re-use tasks by making all tasks current'}
				onClick={handleRefresh}
			/>
			<PageChooserContainer>
				<NextButton variant={'left'} onClick={handlePreviousPage} size={size} />
				<HoursInput
					variant={variant}
					placeholder={1}
					text={hoursText || ` of ${maxPage}`}
					maxwidth={35}
					initialValue={1}
					controlledValue={pageNumber}
					step={1}
					min={parseInt(min)}
					max={parseInt(maxPage)}
					integer={true}
					onValueChange={handlePageNumber}
				/>
				<NextButton variant={'right'} onClick={handleNextPage} size={size} />
			</PageChooserContainer>
			<NumberPicker
				variant={variant}
				defaultNumber={parseInt(defaultNumber)}
				options={options}
				pickerText={pickerText}
				onValueChange={handleTasksPerPage}
				controlledValue={tasksPerPage}
			/>
		</PaginationContainer>
	)
}

export default Pagination