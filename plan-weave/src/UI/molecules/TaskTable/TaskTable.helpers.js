import {
	filterTaskList,
	completedOnTopSorted,
	pipe,
} from '../../../Core/utils/helpers.js'
import { SORTING_METHODS } from '../../../Core/utils/constants.js'

// --- Pipelines

// This solves the Order Problem
// NOTE: We are assuming that the waste calculation that was there is not needed
// TODO: this wasteCalculation reformat is temporary, later I will curry it like: (start, time = new Date()) => (taskList) => {}
export const sortFilterPipe = ({ globalTasks, sortingAlgo, search }) => pipe(
		completedOnTopSorted(SORTING_METHODS[sortingAlgo]),
		filterTaskList(search?.trim(), 'task'),
	)(globalTasks?.tasks)
