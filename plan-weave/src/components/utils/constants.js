// File containing many constants
import colors from '../../styles/theme'
import { toast } from 'react-toastify'
import { parseISO } from 'date-fns'

const twelve = new Date(new Date().setHours(12, 0, 0, 0))

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
		return tasks?.slice().sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
	},
	'name': tasks => {
		return tasks?.slice().sort((a, b) => (a.task || '').localeCompare(b.task || ''))
	},
	'eta': tasks => {
		return tasks?.slice().sort((a, b) => parseISO(a?.eta).getTime() - parseISO(b?.eta).getTime())
	},
	'': tasks => {
		return tasks?.slice()
	},
}

export const OPTION_NOTIFICATIONS = {
	'timestamp': () => toast.info('Time Sorting applied. Tasks now appear in chronological order.'),
	'name': () => toast.info('Name Sorting applied. Tasks now appear alphabetically.'),
	'eta': () => toast.info('ETA Sorting applied. Tasks now appear in ETA order.'),
	'': () => toast.info('Default Sorting applied. Tasks now appear as they do in the database.'),
}

export const SIMPLE_TASK_HEADERS = ['Task', 'Waste', 'TTC', 'ETA']

export const FULL_TASK_HEADERS = [...SIMPLE_TASK_HEADERS, 'Eff.%','Due', 'Weight', 'Thread', 'Predecessors']

export const DEFAULT_SIMPLE_TASKS = [
	{ status: 'completed', task: 'Example Task 1', waste: 2, ttc: 5, eta: '15:30', id: 1 },
	{ status: 'incomplete', task: 'Example Task 2', waste: 1, ttc: 2, eta: '18:30', id: 2 },
	{ status: 'waiting', waste: 2, ttc: 5, eta: '23:30', id: 3 },
	{ status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 4 },
]

export const DEFAULT_SIMPLE_TASK = {
	task: '',
	waste: 1,
	ttc: 1,
	eta: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), // ISO Date, 12:00 noon
	status: 'incomplete',
	id: new Date().getTime(), // guarantees unique ids down to the millisecond! IF and ONLY IF you do this logic in the caller as well!
	timestamp: Math.floor((new Date().getTime()) / 1000)
} // Used when adding a new simple task

export const DEFAULT_FULL_TASK = {
	...DEFAULT_SIMPLE_TASK,
	efficiency: 0,
	parentThread: 'default',
	dueDate: twelve.toISOString(),
	dependencies: [],
	weight: 1,
}

export const DEFAULT_TASK_CONTROL_TOOL_TIPS = {
	owlToolTip: 'Toggle Overnight Mode', addToolTip: 'Add a New Task',
	deleteToolTip: 'Delete selected', dropDownToolTip: 'Select Sorting Method',
	fullTaskToggleTip: 'Toggle Full Task View'
}

export const CLOCK_DEBOUNCE = 20 // measured in ms

export const TASK_ROW_TOOLTIPS = {
	dnd: 'Drag-n-Drop tasks to change view',
	completed: 'Mark Incomplete',
	incomplete: 'Mark Complete',
	task: 'Task Name',
	waste: 'Wasted Time on this Task',
	ttc: 'Time To Complete Task',
	eta: 'Estimated Time to Finish Task',
	delete: 'Delete this task',

	efficiency: 'Task Efficiency',
	due: 'Task Due Date',
	weight: 'Task Weight/Importance',
	thread: 'Task Thread/Group',
	dependencies: 'Task Predecessors. What needs to be done Before this?'
}