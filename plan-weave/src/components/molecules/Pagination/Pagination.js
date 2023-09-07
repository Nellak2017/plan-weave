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
function Pagination({ variant = 'dark',
	min = 1,
	max = 24,
	hoursText = 'of num',
	defaultNumber = 10,
	options = [10, 20],
	pickerText = 'Tasks per page',
	maxWidth,
	size = 'l',
	onPageChange,
	onTasksPerPageChange
}) {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	const [tasksPerPage, setTasksPerPage] = useState(options && options[0] ? options[0] : 0)
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
					text={hoursText}
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