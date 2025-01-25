import { useState, useMemo } from 'react'
import { VARIANTS } from '../../../Core/utils/constants.js'
import { PaginationContainer, PageChooserContainer } from '../Pagination/Pagination.elements'
import NextButton from '../../atoms/NextButton/NextButton'
import HoursInput from '../../atoms/HoursInput/HoursInput'
import NumberPicker from '../../atoms/NumberPicker/NumberPicker'
import { BiRecycle } from 'react-icons/bi'

// services: updatePage, prevPage, nextPage, refresh, tasksPerPageUpdate 
// state: pageNumber, tasksPerPage, maxPage (Computed by Pagination)
function Pagination({
	state,
	services,
	variant = VARIANTS[0],
	min = 1, // optional
	hoursText, // optional, if defined it overrides the default of ${num} text
	options = [10, 20],
	pickerText = 'Tasks per page', // optional
	maxWidth, // optional
}) {
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
		<PaginationContainer variant={variant} maxWidth={maxWidth}>
			<BiRecycle className='pagination-icon' title={'Re-use tasks by making all tasks current'}
				onClick={() => refresh()} tabIndex={0} />
			<PageChooserContainer>
				<NextButton variant={'left'} onClick={handlePrevPage} tabIndex={-1} />
				<HoursInput
					state={{
						variant, maxwidth: 35,
						placeholder: 1, initialValue: 1,
						text: (hoursText || ` of ${maxPage}`), controlledValue: localPageNumber,
						step: 1, min: parseInt(min), max: parseInt(maxPage),
					}}
					services={{ onValueChange: handlePageNumber, onBlur: () => updatePage(localPageNumber), }}
					tabIndex={-1}
				/>
				<NextButton variant={'right'} onClick={handleNextPage} tabIndex={-1} />
			</PageChooserContainer>
			<NumberPicker
				state={{ variant, options, pickerText, controlledValue: tasksPerPage }}
				services={{ onValueChange: handleTasksPerPage }}
				tabIndex={0}
			/>
		</PaginationContainer>
	)
}
export default Pagination