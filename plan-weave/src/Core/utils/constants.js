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
	'name': tasks => tasks?.slice().sort((a, b) => (a.task || '').localeCompare(b.task || '')),
	'eta': tasks => tasks?.slice().sort((a, b) => parseISO(a?.eta).getTime() - parseISO(b?.eta).getTime()),
	'': tasks => tasks?.slice(),
}
export const OPTION_NOTIFICATIONS = {
	'name': () => toast?.info('Name Sorting applied. Tasks now appear alphabetically.'),
	'eta': () => toast?.info('ETA Sorting applied. Tasks now appear in ETA order.'),
	'': () => toast?.info('Default Sorting applied. Tasks now appear as they do in the database.'),
}
export const DEFAULT_SIMPLE_TASKS = [
	{ status: 'completed', task: 'Example Task 1', waste: 2, ttc: 5, eta: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(), id: 1 },
	{ status: 'incomplete', task: 'Example Task 2', waste: 1, ttc: 2, eta: new Date(new Date().setHours(18, 30, 0, 0)).toISOString(), id: 2 },
	{ status: 'waiting', waste: 2, ttc: 5, eta: new Date(new Date().setHours(23, 30, 0, 0)).toISOString(), id: 3 },
	{ status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: new Date(new Date().setHours(1, 30, 0, 0)).toISOString(), id: 4 },
]
export const DEFAULT_SIMPLE_TASK = {
	id: new Date().getTime(), // guarantees unique ids down to the millisecond! IF and ONLY IF you do this logic in the caller as well!
	userId: '', // new
	status: 'incomplete', task: '', waste: -1, ttc: 1, eta: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), // ISO Date, 12:00 noon
	liveTime: 0, // used for time accumulation of tasks
	selected: false, // used for the multi-delete feature
	liveTimeStamp: new Date().toISOString(), // used for the correct waste, efficiency, and eta features. Set when a task goes live (first incomplete task)

	lastCompleteTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), // When task was completed last
	lastIncompleteTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), // When task was incompleted last
	isLive: false, // new
} // Used when adding a new simple task
export const DEFAULT_FULL_TASK = {
	...DEFAULT_SIMPLE_TASK,
	efficiency: 0,
	parentThread: 'default',
	dueDate: twelve.toISOString(),
	dependencies: [],
	weight: 1,
}
export const FULL_TASK_FIELDS = Object.fromEntries(Object.keys(DEFAULT_FULL_TASK).map(item => [item, item])) // { id, status, ...etc}
export const DEFAULT_TASK_CONTROL_TOOL_TIPS = {
	owlToolTip: 'Toggle Overnight Mode', addToolTip: 'Add a New Task',
	deleteToolTip: 'Delete selected', dropDownToolTip: 'Select Sorting Method',
	fullTaskToggleTip: 'Toggle Full Task View'
}
export const TASK_ROW_TOOLTIPS = {
	dndTooltip: 'Drag-n-Drop tasks to change view',
	playTooltip: 'Press Play to start time accumulation for this task',
	pauseTooltip: 'Press Pause to stop time accumulation for this task',
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
	dependenciesTooltip: 'Task Predecessors. What needs to be done Before this?',
	refreshTooltip: 'Press Refresh to refresh this task', 
}
export const TASK_CONTROL_TITLES = { startButton: 'Enter Start Time', endButton: 'Enter End Time', }
export const TASKEDITOR_SEARCH_PLACEHOLDER = 'Search for a Task'
export const DEV = false // is it development or production?
export const OWL_SIZE = '32px'
export const TIME_PICKER_COORDS = { end: { verticalOffset: 0, horizontalOffset: -36, } }
export const PAGINATION_OPTIONS = [10, 20]
export const PAGINATION_PICKER_TEXT = 'Tasks per page'
export const TASK_EDITOR_WIDTH = 818
export const FULL_TASK_HEADERS = ['Task', 'Waste', 'TTC', 'ETA', 'Eff.%', 'Due', 'Weight', 'Thread', 'Predecessors', 'Task ID']
export const RENDER_NUMBERS = { SIMPLE_TASK: 7, FULL_TASK: 14 }
export const MULTIPLE_DELETE_MODAL_TOAST_CONFIG = { position: 'top-center', autoClose: false, closeOnClick: false, closeButton: false, draggable: false, }
export const TASK_NAME_MAX_LENGTH = 100
export const ICON_SIZE = 36
export const DEFAULT_THREAD = 'default'
export const EFFICIENCY_RANGE = { min: -1e6, max: 1e6 }
export const AUTH_FORM_TYPES = { signUpOption: 'SignUp', signInOption: 'SignIn', forgotPasswordOption: 'ForgotPassword', resetPasswordOption: 'ResetPassword' }