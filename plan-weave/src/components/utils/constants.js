// File containing many constants
import colors from '../../styles/theme'

export const MILLISECONDS_PER_HOUR = 60 * 60 * 1000
export const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24
export const THEMES = ['light', 'dark']
export const TASK_STATUSES = {
	COMPLETED: 'completed',
	INCOMPLETE: 'incomplete',
	WAITING: 'waiting',
	INCONSISTENT: 'inconsistent',
}

export const STATUS_COLORS = {
	[TASK_STATUSES.COMPLETED]: colors.success,
	[TASK_STATUSES.INCOMPLETE]: 'transparent',
	[TASK_STATUSES.WAITING]: colors.warning,
	[TASK_STATUSES.INCONSISTENT]: colors.danger,
}

export const SORTING_METHODS = {
	'timestamp': tasks => {
		return tasks.slice().sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
	},
	'name': tasks => {
		return tasks.slice().sort((a, b) => (a.task || '').localeCompare(b.task || ''))
	},
	'': tasks => {
		return tasks.slice()
	},
}