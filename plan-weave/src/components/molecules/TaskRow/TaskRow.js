import { useState, useEffect, useMemo } from 'react'
import { TaskRowStyled } from './TaskRow.elements.js'
import SimpleRow from './SimpleRow.js'
import { Draggable } from 'react-beautiful-dnd'
import { THEMES, TASK_STATUSES } from '../../utils/constants.js'
import 'react-toastify/dist/ReactToastify.css'
import { highlightTaskRow } from '../../utils/helpers'
import { parseISO } from 'date-fns'
import { handleCheckBoxClicked, handleUpdateTask } from './TaskRow.events.js'
import PropTypes from 'prop-types'

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
	const { task, waste, ttc, eta, status, id, timestamp } = { ...taskObject }
	const { taskRow } = { ...services }
	const { isHighlighting, selectedTasks } = { ...state }
	const newETA = useMemo(() => parseISO(eta), [eta]) // Converts eta from ISO -> Date

	// --- Input Checks
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	if (!maxwidth || isNaN(maxwidth) || maxwidth <= 0) maxwidth = 818
	if (index === undefined || index === null || isNaN(index) || index < 0) console.error(`index is not a valid number in row = ${id}, index = ${index}`)
	if (id === undefined || id === null || isNaN(id) || id < 0) console.error(`Id is not a valid number for task index = ${index}, id = ${id}`)

	// --- Local State 
	const [localTask, setLocalTask] = useState(task)
	const [localTtc, setLocalTtc] = useState(ttc)
	const [isChecked, setIsChecked] = useState(status.toLowerCase().trim() === TASK_STATUSES.COMPLETED)

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
			onBlur={() => handleUpdateTask({ taskRow, id, taskObject, localTask, localTtc })}
		>
			{<SimpleRow
				provided={provided || undefined}
				taskObject={{ task, waste, ttc, eta, status, id, timestamp, index }} // eta was used previously
				variant={variant}
				isChecked={isChecked}
				setLocalTask={setLocalTask}
				localTask={localTask}
				localTtc={localTtc}
				setLocalTtc={setLocalTtc}
				handleCheckBoxClicked={() => handleCheckBoxClicked({ services, taskObject, setIsChecked, isChecked, isHighlighting, selectedTasks, index, localTask, localTtc, newETA, id })}
				handleDeleteTask={() => taskRow?.delete(id)}
			/>}
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