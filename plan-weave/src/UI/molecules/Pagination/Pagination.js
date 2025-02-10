import { PaginationContainer, PageChooserContainer } from '../Pagination/Pagination.elements'
import NextButton from '../../atoms/NextButton/NextButton'
import HoursInput from '../../atoms/HoursInput/HoursInput'
import NumberPicker from '../../atoms/NumberPicker/NumberPicker'
import { BiRecycle } from 'react-icons/bi'
import usePagination from '../../../Application/hooks/Pagination/usePagination.js'
import { PAGINATION_OPTIONS, PAGINATION_PICKER_TEXT, VARIANTS } from '../../../Core/utils/constants.js'

export const Pagination = ({ customHook }) => {
	const { childState, childServices } = customHook?.() || usePagination()
	const { variant = VARIANTS[0], maxPage = 1, localPageNumber = 1, tasksPerPage = 10 } = childState || {}
	const { updatePage, refresh, handlePrevPage, handleNextPage, handlePageNumber, handleTasksPerPage, setLocalPageNumber } = childServices || {}
	return (
		<PaginationContainer variant={variant}>
			<BiRecycle className='pagination-icon' title={'Re-use tasks by making all tasks current'} onClick={() => refresh()} tabIndex={0} />
			<PageChooserContainer>
				<NextButton variant={'left'} onClick={handlePrevPage} tabIndex={-1} />
				<HoursInput
					state={{ variant, maxwidth: 35, placeholder: 1, step: 1, min: 1, max: parseInt(maxPage), text: (` of ${maxPage}`), }}
					services={{ onValueChange: handlePageNumber, onBlur: e => { setLocalPageNumber(e); updatePage(e) }, }}
					value={localPageNumber} // must be controlled since next and prev are non-local
					tabIndex={-1}
				/>
				<NextButton variant={'right'} onClick={handleNextPage} tabIndex={-1} />
			</PageChooserContainer>
			<NumberPicker
				state={{ variant, options: PAGINATION_OPTIONS, pickerText: PAGINATION_PICKER_TEXT }}
				services={{ onValueChange: handleTasksPerPage }}
				defaultValue={tasksPerPage} // uncontrolled because locally predicatble
				tabIndex={0}
			/>
		</PaginationContainer>
	)
}
export default Pagination