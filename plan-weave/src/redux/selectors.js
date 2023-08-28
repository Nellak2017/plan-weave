import { createSelector } from 'reselect' // This would be used to memoize easily if needed
// File containing many re-used selectors for the Redux Store

// Task Selectors
export const selectNonHiddenTasks = createSelector(
	[state => state?.tasks?.tasks],
	allTasks => { return !allTasks ? [] : allTasks.filter(task => task?.hidden !== true) }
)
