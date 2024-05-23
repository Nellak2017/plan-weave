import React, { useState, useMemo } from 'react'
import { THEMES, VARIANTS } from '../../utils/constants'
import { PaginationContainer, PageChooserContainer } from '../Pagination/Pagination.elements'
import NextButton from '../../atoms/NextButton/NextButton'
import HoursInput from '../../atoms/HoursInput/HoursInput'
import NumberPicker from '../../atoms/NumberPicker/NumberPicker'
import { BiRecycle } from 'react-icons/bi'
import PropTypes from 'prop-types'

// services: updatePage, prevPage, nextPage, refresh, tasksPerPageUpdate 
// state: pageNumber, tasksPerPage, maxPage (Computed by Pagination)
function Pagination({
	services,
	state,
	variant = VARIANTS[0],
	min = 1, // optional
	hoursText, // optional, if defined it overrides the default of ${num} text
	defaultNumber = 10,
	options = [10, 20],
	pickerText = 'Tasks per page', // optional
	maxWidth, // optional
	size = 'l', // optional
}) {
	// --- Input verification
	const processedVariant = (variant && !THEMES.includes(variant)) ? VARIANTS[0] : variant

	// --- Destructuring
	const { updatePage, prevPage, nextPage, refresh, tasksPerPageUpdate } = services || {}
	const { pageNumber, tasksPerPage, taskList } = state || {}
	const maxPage = useMemo(() => Math.ceil(taskList?.length / tasksPerPage) || 1, [taskList, tasksPerPage])

	// --- Local State
	const [localPageNumber, setLocalPageNumber] = useState(pageNumber)

	// --- Handlers (not substantial enough to move to other file)
	const handleTasksPerPage = e => tasksPerPageUpdate(parseInt(e) || 1)
	const handlePageNumber = e => setLocalPageNumber(parseInt(e) || "")
	const handleNextPage = () => { nextPage(); setLocalPageNumber(old => old < maxPage ? old + 1 : old) } 
	const handlePrevPage = () => { prevPage(); setLocalPageNumber(old => old > min ? old - 1 : old) } 

	return (
		<PaginationContainer variant={processedVariant} maxWidth={maxWidth}>
			<BiRecycle
				className='pagination-icon'
				tabIndex={0}
				title={'Re-use tasks by making all tasks current'}
				onClick={() => refresh()}
			/>
			<PageChooserContainer>
				<NextButton variant={'left'} onClick={handlePrevPage} size={size} tabIndex={-1} />
				<HoursInput
					variant={processedVariant}
					placeholder={1}
					text={hoursText || ` of ${maxPage}`}
					maxwidth={35}
					initialValue={1}
					controlledValue={localPageNumber}
					step={1}
					min={parseInt(min)}
					max={parseInt(maxPage)}
					onValueChange={handlePageNumber}
					onBlur={() => updatePage(localPageNumber)}
					tabIndex={-1}
				/>
				<NextButton variant={'right'} onClick={handleNextPage} size={size} tabIndex={-1} />
			</PageChooserContainer>
			<NumberPicker
				variant={processedVariant}
				defaultNumber={parseInt(defaultNumber)}
				options={options}
				pickerText={pickerText}
				onValueChange={handleTasksPerPage}
				controlledValue={tasksPerPage}
				tabIndex={0}
			/>
		</PaginationContainer>
	)
}

Pagination.propTypes = {
	services: PropTypes.shape({
		updatePage: PropTypes.func,
		prevPage: PropTypes.func,
		nextPage: PropTypes.func,
		refresh: PropTypes.func,
		tasksPerPageUpdate: PropTypes.func,
	}),
	state: PropTypes.shape({
		pageNumber: PropTypes.number,
		tasksPerPage: PropTypes.number,
		taskList: PropTypes.array,
	}),
	variant: PropTypes.oneOf(VARIANTS),
	min: PropTypes.number,
	hoursText: PropTypes.string,
	defaultNumber: PropTypes.number,
	options: PropTypes.arrayOf(PropTypes.number),
	pickerText: PropTypes.string,
	maxWidth: PropTypes.number,
	size: PropTypes.string,
}

export default Pagination