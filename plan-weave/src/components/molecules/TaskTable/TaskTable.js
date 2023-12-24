import { useMemo, useState, useEffect } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import 'react-toastify/dist/ReactToastify.css'
import { THEMES, SORTING_METHODS } from '../../utils/constants'
import { filterTaskList, completedOnTopSorted } from '../../utils/helpers'
import { calculateWaste, calculateRange } from '../../utils/helpers.js'
import { parseISO } from 'date-fns'
import { todoList } from './TodoList.js'
import PropTypes from 'prop-types'

// services: updateTasks, updateDnD
// state: globalTasks, search, timeRange, page, tasksPerPage, taskList, sortingAlgo, owl, taskRowState
const TaskTable = ({
	services,
	state,
	variant = 'dark',
	headerLabels,
	maxwidth = 818
}) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'

	// Services and State (destructured)
	const { updateTasks, updateDnD } = { ...services }
	const { globalTasks, search, timeRange, page, tasksPerPage, taskList, sortingAlgo, owl, taskRowState } = { ...state }
	const start = useMemo(() => parseISO(timeRange?.start), [timeRange])

	const filteredTasks = useMemo(() => (search === search.trimRight())
		? filterTaskList({ list: taskList, filter: search.trim(), attribute: 'task' })
		: taskList, [taskList, search]) // covers: search changes (case: 5)

	// Local State
	const [startRange, endRange] = useMemo(() => calculateRange(tasksPerPage, page), [tasksPerPage, page])
	const [taskUpdated, setTaskUpdated] = useState(false) // Used to help the waste update every second feature. Ugly but it works

	// --- DnD Event, covers: DnD event (case: 4)
	const onDragEnd = result => {
		if (!result.destination) return // Drag was canceled or dropped outside the list
		updateDnD([result.source.index, result.destination.index]) // This is shorthand notation for the manual method of updating the store
	}
	// Effects
	useEffect(() => {
		const transformsAppliedTasks = completedOnTopSorted(
			globalTasks?.tasks,
			[],
			start,
			[t => calculateWaste({ start, taskList: t, time: new Date() })],
			SORTING_METHODS[sortingAlgo]
		)
		updateTasks(transformsAppliedTasks) // Note that each eta is an ISO string, not a date
	}, [])

	const update = () => {
		const ret = calculateWaste({ start: start, taskList: taskList, time: new Date() })
		if (ret.length > 0) updateTasks(ret || taskList)
	}
	useEffect(() => update(), [timeRange, owl])
	useEffect(() => {
		if (taskUpdated) { update() }
		const interval = setInterval(() => { if (!taskUpdated) update() }, 50)
		return () => { if (interval) { clearInterval(interval); setTaskUpdated(false) } }
	}, [taskList]) // covers: waste update every 500ms (case: 6)

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<TaskTableContainer maxwidth={maxwidth}>
				<table>
					<TableHeader variant={variant} labels={headerLabels} />
					<Droppable droppableId="taskTable" type="TASK">
						{provided => (
							<tbody ref={provided.innerRef} {...provided.droppableProps}>
								{todoList(services, taskRowState, filteredTasks, startRange, endRange, timeRange, variant)}
								{provided.placeholder}
							</tbody>
						)}
					</Droppable>
				</table>
			</TaskTableContainer>
		</DragDropContext>
	)
}

TaskTable.propTypes = {
	services: PropTypes.shape({
		updateTasks: PropTypes.func,
		updateDnD: PropTypes.func
	}),
	state: PropTypes.shape({
		globalTasks: PropTypes.object,
		search: PropTypes.string,
		timeRange: PropTypes.object,
		page: PropTypes.number,
		tasksPerPage: PropTypes.number,
		taskList: PropTypes.array,
		sortingAlgo: PropTypes.string,
		owl: PropTypes.any,
		taskRowState: PropTypes.any
	}),
	variant: PropTypes.string,
	headerLabels: PropTypes.array,
	maxwidth: PropTypes.number
}

export default TaskTable

/* 
0. filteredTasks = useMemo(() => filterOperation(taskList),[taskList, search])

1. Initial State, useEffect([])

	taskList = global tasks |> sort(sorting method) |> waste/eta algo

2. Start/End/Owl change OR 500 ms passes, useEffect([start,end,owl,timer])

	taskList = taskList |> waste/eta algo

3. Sort Algorithm Changes, useEffect([sortingAlgo])

	dispatch change sorting algorithm thunk
	--> PATCH sorting algorithm change to API endpoint (Potentially)
	--> Sort the Local tasks with this algorithm

4. Search event

	search = search bar text

5. Add event

	dispatch addThunk for global 
	--> POSTs default task to API endpoint
	--> updates global task with default task
	--> updates local task with default task in correct order to maintain dnd 

6. Delete Single/Multiple Event

	dispatch delete/deleteMultiple for global
	--> DELETEs the series of tasks at the API endpoint
	--> deletes specified global tasks 
	--> deletes specified local tasks in correct order to maintain dnd

7. Edit Event (non-completing)

	// Note: This event should not be used to update completion, even though it can be mis-used
	dispatch edit event for global
	--> PATCHes the task at the API endpoint
	--> edits specified global task
	--> edits specified local task (doesn't affect order, assuming that non-completing editing was done)

8. Completion Event (special case of Edit Event)

	dispatch completion event for global
	--> PATCHes the task at the API endpoint
	--> edits specified global task
	--> edits specified local task and changes ordering of tasks to match where it is supposed to be

9. DnD Event

	dispatch dnd event for local slice
	--> changes ordering of local tasks in this slice to match based on (source, destination)
*/