import { useState, useEffect } from 'react'
import { TaskRowStyled, TrashContainer } from './TaskRow.elements.js'
import SimpleRow from './SimpleRow.js'
import FullRow from './FullRow.js'
import { Draggable } from 'react-beautiful-dnd'
import { TASK_STATUSES, TASK_ROW_TOOLTIPS, VARIANTS } from '../../../Core/utils/constants.js'
import 'react-toastify/dist/ReactToastify.css'
import { highlightTaskRow } from '../../../Core/utils/helpers.js'
import { parseISO } from 'date-fns'
import { handleCheckBoxClicked, handleUpdateTask } from './TaskRow.events.js'
import { BiTrash } from 'react-icons/bi'

// TODO: Make maxwidth a constant
// TODO: Continue refactor by having CompletedTask simplified and variant removed

// services: {...others, updateSelectedTasks}
// state: {isHighlighting, selectedTasks}
export const TaskRow = ({
	services,
	state,
	taskObject = { task: 'example', waste: 0, ttc: 1, eta: new Date(), status: TASK_STATUSES.INCOMPLETE, id: 0, timestamp: Math.floor((new Date()).getTime() / 1000) },
	variant = VARIANTS[0],
	maxwidth = 818,
	index,
	old = false,
	prevCompletedTask, // Used for Efficiency Calculations
	options = [], // Used for Predecessor drop-down options
}) => {
	// --- Destructuring
	const { task, waste, ttc, eta, status, id, timestamp, completedTimeStamp, hidden, efficiency, parentThread, dependencies, weight, dueDate } = { ...taskObject }
	const { taskRow, addThread } = services || {}
	const { isHighlighting, selectedTasks, fullTask, availableThreads, userId } = state || { isHighlighting: false }
	const { delete: deleteTooltip } = TASK_ROW_TOOLTIPS
	// --- Local State 
	const [tab, setTab] = useState(false) // Used to prevent updating a task on Tab Event
	const [localTask, setLocalTask] = useState(task)
	const [localTtc, setLocalTtc] = useState(ttc)
	const [isChecked, setIsChecked] = useState(status.toLowerCase().trim() === TASK_STATUSES.COMPLETED)
	const [localDueDate, setLocalDueDate] = useState(dueDate)
	const [localWeight, setLocalWeight] = useState(weight)
	const [localThread, setLocalThread] = useState(parentThread)
	const [localDependencies, setLocalDependencies] = useState(dependencies)
	// Simple Row Services/State
	const simpleRowServices = { setLocalTask, setLocalTtc, handleCheckBoxClicked: () => handleCheckBoxClicked({ services: { ...services, setIsChecked }, state: { taskObject, prevCompletedTask, isChecked, isHighlighting, selectedTasks, index, newETA: parseISO(eta), id, localTask, localTtc, localDueDate, localWeight, localThread, localDependencies, userId, } }) }
	const simpleRowState = { taskObject: { task, waste, ttc, eta, status, id, timestamp, index }, isChecked, localTask, localTtc }
	// --- Effects
	useEffect(() => { isHighlighting ? setIsChecked(false) : setIsChecked(status === TASK_STATUSES.COMPLETED) }, [isHighlighting, status]) // Should run when the highlighting stops to reset the checkmarks to what they should be
	// -- Helper components
	const completedTask = provided => (
		<TaskRowStyled
			variant={variant}
			status={status}
			ref={provided?.innerRef || null}
			{...(provided?.draggableProps ? provided.draggableProps : {})} // conditionally destructure if not completed task
			style={{ ...provided?.draggableProps?.style, boxShadow: provided?.isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none' }}
			maxwidth={maxwidth}
			highlight={highlightTaskRow(isHighlighting, isChecked, old)}
			onBlur={() => {
				if (!tab) handleUpdateTask({ services: { taskRow }, state: { id, taskObject, localTask, localTtc, localDueDate, localWeight, localThread, localDependencies, userId, prevCompletedTask,} })
				setTab(false)
			}}
			onKeyDown={e => { if (e.key === 'Tab') setTab(true) }} // Set to be true, so that tabbing in doesn't cause updates. (other approaches don't work perfectly)
		>
			{!fullTask &&
				<>
					<SimpleRow services={simpleRowServices} state={simpleRowState} variant={variant} provided={provided || undefined} />
					<TrashContainer><BiTrash title={deleteTooltip} onClick={() => taskRow?.delete(id, userId)} size={36} /></TrashContainer>
				</>
			}
			{fullTask &&
				<>
					<FullRow
						simpleTaskProps={{ ...simpleRowServices, ...simpleRowState, variant: variant, provided: provided || undefined, }}
						state={{ completedTimeStamp, hidden, efficiency, availableThreads, localThread, localDueDate, localDependencies, localWeight, options, }}
						services={{ setLocalThread, setLocalDueDate, setLocalDependencies, setLocalWeight, addThread, }} // NOTE: Update and Delete Functionality are solely in the Thread View Component to be made
					/>
					<TrashContainer><BiTrash title={deleteTooltip} onClick={() => taskRow?.delete(id, userId)} size={36} /></TrashContainer>
				</>}
		</TaskRowStyled>
	)
	return (
		<>
			{status === TASK_STATUSES.COMPLETED || isHighlighting
				? (completedTask())
				: (<Draggable draggableId={`task-${id}`} index={index} key={`task-${id}-key`}>{provided => (completedTask(provided))}</Draggable >)
			}
		</>
	)
}
export default TaskRow