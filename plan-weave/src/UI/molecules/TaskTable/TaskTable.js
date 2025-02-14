import { useMemo, useEffect } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import { TaskTableContainer } from './TaskTable.elements'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import 'react-toastify/dist/ReactToastify.css'
import { VARIANTS, TASK_EDITOR_WIDTH } from '../../../Core/utils/constants.js'
import { calculateEfficiencyList, calculateWaste, calculateRange, transformAll, predecessorOptions, } from '../../../Core/utils/helpers.js'
import { parseISO } from 'date-fns'
import { todoList } from './TodoList.js'
import { useInterval } from '../../hooks/useInterval.js'
import { sortFilterPipe } from './TaskTable.helpers.js'

// services: updateTasks, updateDnD
// state: globalTasks, search, timeRange, page, tasksPerPage, taskList, sortingAlgo, owl, taskRowState
const TaskTable = ({ services, state, headerLabels, currentTime }) => {
	const variant = VARIANTS[0]
	// --- Services and State (destructured)
	const { globalTasks, search, timeRange, page, tasksPerPage, taskList, sortingAlgo, owl, taskRowState } = state || {}
	const { updateTasks, updateDnD } = services || {}
	const options = useMemo(() => predecessorOptions(globalTasks?.tasks), [globalTasks]) // options used in predecessor drop-down component
	const start = useMemo(() => parseISO(timeRange?.start), [timeRange])
	const [startRange, endRange] = useMemo(() => calculateRange(tasksPerPage, page), [tasksPerPage, page])
	const globalTasksLen = useMemo(() => globalTasks?.tasks?.length, [globalTasks]) // TODO: can I memo with globalTasks.tasks.length?
	const onDragEnd = result => { if (result.destination) updateDnD([result.source.index, result.destination.index]) }
	useEffect(() => {
		if (updateTasks) updateTasks(sortFilterPipe({ globalTasks, sortingAlgo, search }))
	}, [sortingAlgo, search, globalTasksLen]) // page
	const update = () => {
		const transforms = [t => calculateWaste({ start, taskList: t, time: new Date() }), t => calculateEfficiencyList(t, start)]
		if (taskList?.length > 0) updateTasks(transformAll(taskList, transforms) || taskList)
	}
	useInterval(() => update(), 33, [timeRange, owl, taskList]) // 33 is 30 fps
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<TaskTableContainer variant={variant} maxwidth={TASK_EDITOR_WIDTH}>
				<table>
					<TableHeader variant={variant} labels={headerLabels} />
					<Droppable droppableId="taskTable" type="TASK">
						{provided => (
							<tbody ref={provided.innerRef} {...provided.droppableProps}>
								{taskList && taskList.length > 0
									? todoList({ services, state: taskRowState, taskList, startRange, endRange, timeRange, options, variant })
									: <tr><td colSpan='4' style={{ width: '818px', textAlign: 'center' }}>No Tasks are made yet. Make some by pressing the + button above.</td></tr>}
								{provided.placeholder}
							</tbody>
						)}
					</Droppable>
				</table>
			</TaskTableContainer>
		</DragDropContext>
	)
}
export default TaskTable