import { createSelector } from 'reselect' // This would be used to memoize easily if needed
import { fullTasksSchema } from '../components/schemas/taskSchema/taskSchema.js'
import { coerceToSchema } from '../components/utils/schema-helpers.js'

// File containing many re-used selectors for the Redux Store

// Task Selectors
export const selectNonHiddenTasksCoerceToFull = createSelector(
	[state => state?.taskEditor?.tasks],
	allTasks => allTasks // coerceToSchema(
		?.slice(0, 1000) // limit tasks retrieved to be only 1000, assuming the db messes up and gives more
		?.filter(task => task?.hidden !== true)
		?.map(task => ({
			...task,
			//eta: new Date(task?.eta ? task?.eta * 1000 : new Date().getTime()), // convert epoch to Date if you can, else just use current time
		})) || [],//, fullTasksSchema) // returns { output: [tasks], errors: [strings] }
	// eslint-disable-next-line react-hooks/exhaustive-deps
)
