import React, { useState } from 'react'
import { THEMES } from '../../utils/constants'
import { isInt } from '../../utils/helpers'
import { PaginationContainer, PageChooserContainer } from '../Pagination/Pagination.elements'
import NextButton from '../../atoms/NextButton/NextButton'
import HoursInput from '../../atoms/HoursInput/HoursInput'
import NumberPicker from '../../atoms/NumberPicker/NumberPicker'


// TODO: Add Controlled value for NumberPicker
// TODO: Pass the state of this component to parent
// TODO: Add logic to allow this component to possibly be controlled by parent (maybe)
// TODO: Review styles and add Size support for sub-components (see style todos in the relevant components)
// TODO: Add support for changing the max whenever the tasks per page changes (for all combos of total and max defined/undefined cases)
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
	if (total && !isInt(max)) max = Math.ceil(total / (defaultNumber ? defaultNumber : 10))

	// --- State
	// define local max here
	const [tasksPerPage, setTasksPerPage] = useState(defaultNumber ? defaultNumber : 0)
	const [pageNumber, setPageNumber] = useState(isInt(min) ? min : 1)


	// --- Handlers
	const handleTasksPerPage = e => {
		const newValue = parseInt(e)
		setTasksPerPage(newValue)
		if (onTasksPerPageChange) {
			onTasksPerPageChange(newValue)
		} // Notify parent component about tasks per page change
	}

	const handlePageNumber = e => {
		const newValue = parseInt(e)
		setPageNumber(newValue)
		if (onPageChange) {
			onPageChange(newValue)
		} // Notify parent component about page number change
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

	return (
		<PaginationContainer variant={variant} maxWidth={maxWidth}>
			<PageChooserContainer>
				<NextButton variant={'left'} onClick={handlePreviousPage} size={size} />
				<HoursInput
					variant={variant}
					placeholder={1}
					text={hoursText ? hoursText : ` of ${max}`}
					maxwidth={35}
					initialValue={1}
					controlledValue={pageNumber}
					step={1}
					min={parseInt(min)}
					max={parseInt(max)}
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

			/>
		</PaginationContainer>
	)
}

export default Pagination