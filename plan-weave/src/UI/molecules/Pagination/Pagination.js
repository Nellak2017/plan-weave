import { useState, useMemo } from 'react'
import { VARIANTS } from '../../../Core/utils/constants.js'
import { clamp } from '../../../Core/utils/helpers.js'
import { PaginationContainer, PageChooserContainer } from '../Pagination/Pagination.elements'
import NextButton from '../../atoms/NextButton/NextButton'
import HoursInput from '../../atoms/HoursInput/HoursInput'
import NumberPicker from '../../atoms/NumberPicker/NumberPicker'
import { BiRecycle } from 'react-icons/bi'

export const Pagination = ({
	state: {
		variant = VARIANTS[0], taskListLength = 0, pageNumber = 1, tasksPerPage = 10,
		min = 1, options = [10, 20], pickerText = 'Tasks per page', hoursText, maxWidth, // optional props
	} = {},
	services: { updatePage, prevPage, nextPage, refresh, tasksPerPageUpdate } = {},
}) => {
	const [localTasksPerPage, setLocalTasksPerPage] = useState(tasksPerPage)
	const [localPageNumber, setLocalPageNumber] = useState(pageNumber)
	const calcMaxPage = (listLen, perPage) => Math.ceil(listLen / perPage) || 1 
	const maxPage = useMemo(() => calcMaxPage(taskListLength, localTasksPerPage), [taskListLength, localTasksPerPage])
	const handleTasksPerPage = e => { setLocalTasksPerPage(e); setLocalPageNumber(old => clamp(old, min, calcMaxPage(taskListLength, e))); if (tasksPerPageUpdate) { tasksPerPageUpdate(parseInt(e) || 1) } }
	const handlePageNumber = e => setLocalPageNumber(parseInt(e) || "")
	const handleNextPage = () => { setLocalPageNumber(old => clamp(old + 1, min, maxPage)); if (nextPage) { nextPage() } }
	const handlePrevPage = () => { setLocalPageNumber(old => clamp(old - 1, min, maxPage)); if (prevPage) { prevPage() } }
	return (
		<PaginationContainer variant={variant} maxWidth={maxWidth}>
			<BiRecycle className='pagination-icon' title={'Re-use tasks by making all tasks current'} onClick={() => refresh()} tabIndex={0} />
			<PageChooserContainer>
				<NextButton variant={'left'} onClick={handlePrevPage} tabIndex={-1} />
				<HoursInput
					state={{
						variant, placeholder: 1, text: (hoursText || ` of ${maxPage}`),
						maxwidth: 35, step: 1, min: parseInt(min), max: parseInt(maxPage),
					}}
					services={{ onValueChange: handlePageNumber, onBlur: e => { setLocalPageNumber(e); updatePage(e) }, }}
					value={localPageNumber} // must be controlled since next and prev are non-local
					tabIndex={-1}
				/>
				<NextButton variant={'right'} onClick={handleNextPage} tabIndex={-1} />
			</PageChooserContainer>
			<NumberPicker
				state={{ variant, options, pickerText }}
				services={{ onValueChange: handleTasksPerPage }}
				defaultValue={tasksPerPage} // uncontrolled because locally predicatble
				tabIndex={0}
			/>
		</PaginationContainer>
	)
}
export default Pagination