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

export const SORTING_METHODS_NAMES = {
	TIMESTAMP: 'timestamp',
	NAME: 'name',
	DEFAULT: ''
}

export const SORTING_METHODS = {
	'timestamp': tasks => {
		return tasks?.slice().sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
	},
	'name': tasks => {
		return tasks?.slice().sort((a, b) => (a.task || '').localeCompare(b.task || ''))
	},
	'': tasks => {
		return tasks?.slice()
	},
}

export const SIMPLE_TASK_HEADERS = ['Task', 'Waste', 'TTC', 'ETA']

// FULL_TASK_HEADERS

export const DEFAULT_SIMPLE_TASKS = [
	{ status: 'completed', waste: 2, ttc: 5, eta: '15:30', id: 1 },
	{ status: 'incomplete', task: 'Example Task 2', waste: 1, ttc: 2, eta: '18:30', id: 2 },
	{ status: 'waiting', waste: 2, ttc: 5, eta: '23:30', id: 3 },
	{ status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 4 },
]

export const DEFAULT_TASK_CONTROL_TOOL_TIPS = {
	owlToolTip: 'Toggle Overnight Mode', addToolTip: 'Add a New Task',
	deleteToolTip: 'Delete selected', dropDownToolTip: 'Select Sorting Method'
}

export const CLOCK_DEBOUNCE = 20 // measured in ms