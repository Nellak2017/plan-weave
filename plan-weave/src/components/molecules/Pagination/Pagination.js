import React, { useState } from 'react'
import { THEMES } from '../../utils/constants'
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
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (!total && !max) max = 24 
	if (total && !max) max = Math.ceil(total / (defaultNumber ? defaultNumber : 10))

	// define local max here

	const [tasksPerPage, setTasksPerPage] = useState(defaultNumber ? defaultNumber : 0)
	const handleTasksPerPage = e => setTasksPerPage(e)

	const [pageNumber, setPageNumber] = useState(min && typeof min === 'number' ? min : 1)
	const handlePageNumber = e => setPageNumber(parseInt(e))

	const handleNextPage = () => setPageNumber(old => parseInt((old + 1)) <= parseInt(max) ? parseInt(old + 1) : parseInt(old))
	const handlePreviousPage = () => setPageNumber(old => parseInt((old - 1)) >= parseInt(min) ? parseInt(old - 1) : parseInt(old))

	return (
		<PaginationContainer variant={variant} maxWidth={maxWidth}>
			<PageChooserContainer>
				<NextButton variant={'left'} onClick={handlePreviousPage} size={size}/>
				<HoursInput
					variant={variant}
					placeholder={1}
					text={hoursText ? hoursText : ` of ${max}`}
					maxwidth={35}
					initialValue={1}
					controlledValue={pageNumber}
					step={1}
					min={min}
					max={max}
					integer={true}
					onValueChange={handlePageNumber}
				/>
				<NextButton variant={'right'} onClick={handleNextPage} size={size}/>
			</PageChooserContainer>
			<NumberPicker
				variant={variant}
				defaultNumber={defaultNumber}
				options={options}
				pickerText={pickerText}
				onValueChange={handleTasksPerPage}
	
			/>
		</PaginationContainer>
	)
}

export default Pagination