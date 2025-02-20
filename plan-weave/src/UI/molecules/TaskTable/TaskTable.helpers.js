import { filterTaskList, completedOnTopSorted, pipe, } from '../../../Core/utils/helpers.js'
import { SORTING_METHODS } from '../../../Core/utils/constants.js'

export const sortFilterPipe = ({ globalTasks, sortingAlgo, search }) => pipe( completedOnTopSorted(SORTING_METHODS[sortingAlgo]), filterTaskList(search?.trim(), 'task'),)(globalTasks?.tasks) // TODO: this wasteCalculation reformat is temporary, later I will curry it like: (start, time = new Date()) => (taskList) => {}