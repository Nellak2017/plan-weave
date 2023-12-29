import { useState, useEffect, useMemo } from 'react'
import { TaskRowStyled, TrashContainer } from './TaskRow.elements.js'
import SimpleRow from './SimpleRow.js'
import FullRow from './FullRow.js'
import { Draggable } from 'react-beautiful-dnd'
import { THEMES, TASK_STATUSES, TASK_ROW_TOOLTIPS } from '../../utils/constants.js'
import 'react-toastify/dist/ReactToastify.css'
import { highlightTaskRow } from '../../utils/helpers'
import { parseISO } from 'date-fns'
import { handleCheckBoxClicked, handleUpdateTask } from './TaskRow.events.js'
import PropTypes from 'prop-types'

import { BiTrash } from 'react-icons/bi'

// services: {...others, updateSelectedTasks}
// state: {isHighlighting, selectedTasks}
function TaskRow({
	services,
	state,
	taskObject = { task: 'example', waste: 0, ttc: 1, eta: new Date(), status: TASK_STATUSES.INCOMPLETE, id: 0, timestamp: Math.floor((new Date()).getTime() / 1000) },
	variant = 'dark',
	maxwidth = 818,
	index,
	old = false
}) {
	// --- Destructuring
	const { task, waste, ttc, eta, status, id, timestamp, completedTimeStamp, hidden, efficiency, parentThread, dependencies, weight, dueDate } = { ...taskObject }
	const { taskRow } = { ...services }
	const { isHighlighting, selectedTasks, fullTask } = { ...state }
	const { delete: deleteTooltip } = TASK_ROW_TOOLTIPS
	const newETA = useMemo(() => parseISO(eta), [eta]) // Converts eta from ISO -> Date

	// --- Input Checks
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (!maxwidth || isNaN(maxwidth) || maxwidth <= 0) maxwidth = 818
	if (index === undefined || index === null || isNaN(index) || index < 0) console.error(`index is not a valid number in row = ${id}, index = ${index}`)
	if (id === undefined || id === null || isNaN(id) || id < 0) console.error(`Id is not a valid number for task index = ${index}, id = ${id}`)

	// --- Local State 
	const [tab, setTab] = useState(false) // Used to prevent updating a task on Tab Event

	const [localTask, setLocalTask] = useState(task)
	const [localTtc, setLocalTtc] = useState(ttc)
	const [isChecked, setIsChecked] = useState(status.toLowerCase().trim() === TASK_STATUSES.COMPLETED)

	const [localDueDate, setLocalDueDate] = useState(dueDate)
	const [localWeight, setLocalWeight] = useState(weight)
	const [localThread, setLocalThread] = useState(parentThread)
	const [localDependencies, setLocalDependencies] = useState(dependencies)

	// --- Memoized Variables
	const iconSize = useMemo(() => 36, [])
	const simpleRowServices = useMemo(() => (
		{
			setLocalTask, setLocalTtc,
			handleCheckBoxClicked:
				() => handleCheckBoxClicked({ services, taskObject, setIsChecked, isChecked, isHighlighting, selectedTasks, index, localTask, localTtc, newETA, id })
		})
		, [services, taskObject, setIsChecked, isChecked, isHighlighting, selectedTasks, index, localTask, localTtc, newETA, id])
	const simpleRowState = useMemo(() => (
		{ taskObject: { task, waste, ttc, eta, status, id, timestamp, index }, isChecked, localTask, localTtc })
		, [task, waste, ttc, eta, status, id, timestamp, index, isChecked, localTask, localTtc])

	// --- Effects
	// Should run when the highlighting stops to reset the checkmarks to what they should be
	useEffect(() => { isHighlighting ? setIsChecked(false) : setIsChecked(status === TASK_STATUSES.COMPLETED) }, [isHighlighting])

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
				if (!tab) handleUpdateTask({ taskRow, id, taskObject, localTask, localTtc })
				setTab(false)
			}}
			onKeyDown={e => { if (e.key === 'Tab') setTab(true) }} // Set to be true, so that tabbing in doesn't cause updates. (other approaches don't work perfectly)
		>
			{!fullTask &&
				<>
					<SimpleRow
						services={simpleRowServices}
						state={simpleRowState}
						variant={variant}
						provided={provided || undefined}
					/>
					<TrashContainer>
						<BiTrash title={deleteTooltip} onClick={() => taskRow?.delete(id)} size={iconSize} />
					</TrashContainer>
				</>

			}
			{fullTask &&
				<>
					{/*<button onClick={() => console.log(taskObject)}>taskObject</button>*/}
					<FullRow
						simpleTaskProps={{
							...simpleRowServices,
							...simpleRowState,
							variant: variant,
							provided: provided || undefined,
						}}
						state={{
							completedTimeStamp,
							hidden,
							efficiency,

							localThread,
							localDueDate,
							localDependencies,
							localWeight,
						}}
						services={{
							setLocalThread,
							setLocalDueDate,
							setLocalDependencies,
							setLocalWeight,
						}}
					/>
					<TrashContainer>
						<BiTrash title={deleteTooltip} onClick={() => taskRow?.delete(id)} size={iconSize} />
					</TrashContainer>
				</>}
		</TaskRowStyled>
	)

	return (
		<>
			{status === TASK_STATUSES.COMPLETED || isHighlighting
				? (completedTask())
				: (
					<Draggable draggableId={`task-${id}`} index={index} key={`task-${id}-key`}>
						{provided => (completedTask(provided))}
					</Draggable >
				)
			}
		</>
	)
}

TaskRow.propTypes = {
	services: PropTypes.shape({
		taskRow: PropTypes.object,
	}),
	state: PropTypes.shape({
		isHighlighting: PropTypes.bool,
		selectedTasks: PropTypes.array,
	}),
	taskObject: PropTypes.shape({
		task: PropTypes.string,
		waste: PropTypes.number,
		ttc: PropTypes.number,
		eta: PropTypes.string, // Expects ISO String
		status: PropTypes.string,
		id: PropTypes.number,
		timestamp: PropTypes.any,
	}),
	variant: PropTypes.string,
	maxwidth: PropTypes.number,
	index: PropTypes.number,
	old: PropTypes.bool,
}

export default TaskRow