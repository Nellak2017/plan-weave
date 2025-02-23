import { toast } from 'react-toastify'
import { parseISO } from 'date-fns'
const twelve = new Date(new Date().setHours(12, 0, 0, 0))
export const VARIANTS = ['dark', 'light']
export const MILLISECONDS_PER_HOUR = 60 * 60 * 1000
export const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24
export const MAX_SAFE_DATE = 8.64e15 // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
export const MAX_SAFE_DATE_SMALL = 253381737599000 // parsing this format leads to invalid dates after 9999 -> "9999-05-07T18:59:59-05:00"
export const THEMES = VARIANTS // alias
export const TASK_STATUSES = { COMPLETED: 'completed', INCOMPLETE: 'incomplete', WAITING: 'waiting', INCONSISTENT: 'inconsistent', }
export const SORTING_METHODS = {
	'timestamp': tasks => tasks?.slice().sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)),
	'name': tasks => tasks?.slice().sort((a, b) => (a.task || '').localeCompare(b.task || '')),
	'eta': tasks => tasks?.slice().sort((a, b) => parseISO(a?.eta).getTime() - parseISO(b?.eta).getTime()),
	'': tasks => tasks?.slice(),
}
export const OPTION_NOTIFICATIONS = {
	'timestamp': () => toast?.info('Time Sorting applied. Tasks now appear in chronological order.'),
	'name': () => toast?.info('Name Sorting applied. Tasks now appear alphabetically.'),
	'eta': () => toast?.info('ETA Sorting applied. Tasks now appear in ETA order.'),
	'': () => toast?.info('Default Sorting applied. Tasks now appear as they do in the database.'),
}
export const FULL_TASK_HEADERS = ['Task', 'Waste', 'TTC', 'ETA', 'Eff.%', 'Due', 'Weight', 'Thread', 'Predecessors']
export const DEFAULT_SIMPLE_TASKS = [
	{ status: 'completed', task: 'Example Task 1', waste: 2, ttc: 5, eta: '15:30', id: 1 },
	{ status: 'incomplete', task: 'Example Task 2', waste: 1, ttc: 2, eta: '18:30', id: 2 },
	{ status: 'waiting', waste: 2, ttc: 5, eta: '23:30', id: 3 },
	{ status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 4 },
]
export const DEFAULT_SIMPLE_TASK = {
	id: new Date().getTime(), // guarantees unique ids down to the millisecond! IF and ONLY IF you do this logic in the caller as well!
	status: 'incomplete', task: '', waste: 1, ttc: 1, eta: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), // ISO Date, 12:00 noon
	timestamp: Math.floor((new Date().getTime()) / 1000),
	completedTimeStamp: 0,
	hidden: false, // TODO: Remove this feature, it bloats tasks. On Front End it means removing it and analytics on Delete feature. On Back End it means migration.
	liveTime: 0, // used for time accumulation of tasks
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
export const TASK_ROW_TOOLTIPS = {
	dndTooltip: 'Drag-n-Drop tasks to change view',
	completedTooltip: 'Mark Incomplete',
	incompleteTooltip: 'Mark Complete',
	taskTooltip: 'Task Name',
	wasteTooltip: 'Wasted Time on this Task',
	ttcTooltip: 'Time To Complete Task',
	etaTooltip: 'Estimated Time to Finish Task',
	deleteTooltip: 'Delete this task',
	efficiencyTooltip: 'Task Efficiency',
	dueTooltip: 'Task Due Date',
	weightTooltip: 'Task Weight/Importance',
	threadTooltip: 'Task Thread/Group',
	dependenciesTooltip: 'Task Predecessors. What needs to be done Before this?'
}
export const TASK_CONTROL_TITLES = { startButton: 'Enter Start Time', endButton: 'Enter End Time', }
export const TASKEDITOR_SEARCH_PLACEHOLDER = 'Search for a Task'
export const DEV = false // is it development or production?
export const OWL_SIZE = '32px'
export const TIME_PICKER_COORDS = { start: { verticalOffset: 0, horizontalOffset: 0, }, end: { verticalOffset: 0, horizontalOffset: -36, } }
export const PAGINATION_OPTIONS = [10, 20]
export const PAGINATION_PICKER_TEXT = 'Tasks per page'
export const TASK_EDITOR_WIDTH = 818
export const RENDER_NUMBERS = { SIMPLE_TASK: 6, FULL_TASK: 11 }