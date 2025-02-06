import { useState, useMemo } from 'react'
import { clamp } from '../../../Core/utils/helpers.js'
import store from "../../store"
import { variant as variantSelector, tasks as tasksSelector, pageNumber as pageNumberSelector, tasksPerPage as tasksPerPageSelector } from '../../selectors.js'

const calcMaxPage = (listLen, perPage) => Math.ceil(listLen / perPage) || 1
export const usePagination = () => {
    const dispatch = store.dispatch
    const variant = variantSelector(), tasksPerPage = tasksPerPageSelector(), pageNumber = pageNumberSelector(), taskListLength = tasksSelector().length
    
    const [localTasksPerPage, setLocalTasksPerPage] = useState(tasksPerPage)
    const [localPageNumber, setLocalPageNumber] = useState(pageNumber)
    const maxPage = useMemo(() => calcMaxPage(taskListLength, localTasksPerPage), [taskListLength, localTasksPerPage])
    const handleTasksPerPage = e => { setLocalTasksPerPage(e); setLocalPageNumber(old => clamp(old, min, calcMaxPage(taskListLength, e))); if (tasksPerPageUpdate) { tasksPerPageUpdate(parseInt(e) || 1) } }
    const handlePageNumber = e => setLocalPageNumber(parseInt(e) || "")
    const handleNextPage = () => { setLocalPageNumber(old => clamp(old + 1, min, maxPage)); if (nextPage) { nextPage() } }
    const handlePrevPage = () => { setLocalPageNumber(old => clamp(old - 1, min, maxPage)); if (prevPage) { prevPage() } }

    const childState = { variant, maxPage, localPageNumber, tasksPerPage }
    const childServices = {
        updatePage: () => { console.warn('Pagination updatePage service not implemented.') },
        refresh: () => { console.warn('Pagination refresh service not implemented.') },
        handlePrevPage: () => { console.warn('Pagination prevPage service not implemented.') },
        handleNextPage: () => { console.warn('Pagination nextPage service not implemented.') },
        handlePageNumber: () => { console.warn('Pagination handlePageNumber service not implemented')},
        handleTasksPerPage: () => { console.warn('Pagination tasksPerPageUpdate service not implemented.') },
        setLocalPageNumber: () => { console.warn('Pagination setLocalPageNumber service not implemented.')}
    }

    return { childState, childServices }
}
export default usePagination