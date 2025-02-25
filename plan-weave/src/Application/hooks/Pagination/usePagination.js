import { useState, useMemo } from 'react'
import { clamp, calcMaxPage } from '../../../Core/utils/helpers.js'
import { PAGINATION_OPTIONS } from '../../../Core/utils/constants.js'
import store from "../../store"
import { variant as variantSelector, tasks as tasksSelector, pageNumber as pageNumberSelector, tasksPerPage as tasksPerPageSelector, isOwl as owlSelector } from '../../selectors.js'
import { previousPageThunk, nextPageThunk, setPageThunk, setTasksPerPageThunk, refreshPaginationThunk } from '../../thunks.js'
import { VALID_PAGINATION_IDS } from '../../validIDs.js'

// TODO: Convert pagination information to URL arguments and figure out how to test this in Storybook too
export const usePagination = () => {
    const dispatch = store ? store.dispatch : () => { }
    const variant = variantSelector(), tasksPerPage = tasksPerPageSelector(), pageNumber = pageNumberSelector(), taskListLength = tasksSelector().length, isOwl = owlSelector()
    const id = VALID_PAGINATION_IDS.PAGINATION_TASK_EDITOR
    const minTasksPerPage = PAGINATION_OPTIONS[0], maxTasksPerPage = PAGINATION_OPTIONS[1]

    const [localTasksPerPage, setLocalTasksPerPage] = useState(tasksPerPage)
    const [localPageNumber, setLocalPageNumber] = useState(pageNumber)
    const max = useMemo(() => calcMaxPage(taskListLength, localTasksPerPage), [taskListLength, localTasksPerPage])
    const handleTasksPerPage = e => {
        setLocalTasksPerPage(e); setLocalPageNumber(old => clamp(old, 1, calcMaxPage(taskListLength, e)));
        dispatch(setTasksPerPageThunk({ id, value: (parseInt(e) || 1), min: minTasksPerPage, max: maxTasksPerPage }))
    }
    const handlePageNumber = e => setLocalPageNumber(parseInt(e) || "")
    const handleNextPage = () => { setLocalPageNumber(old => clamp(old + 1, 1, max)); dispatch(nextPageThunk({ id, max })) }
    const handlePrevPage = () => { setLocalPageNumber(old => clamp(old - 1, 1, max)); dispatch(previousPageThunk({ id, max })) }

    const childState = { variant, maxPage: max, localPageNumber, tasksPerPage }
    const childServices = {
        updatePage: value => { dispatch(setPageThunk({ id, value, max })) },
        refresh: () => { dispatch(refreshPaginationThunk({ isOwl })) },
        setLocalPageNumber: value => { setLocalPageNumber(value) },
        handlePrevPage, handleNextPage, handlePageNumber, handleTasksPerPage,
    }

    return { childState, childServices }
}
export default usePagination