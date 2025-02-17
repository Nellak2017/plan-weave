// Temporarily write the envisioned code here, then remove the old code
import React from 'react'
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md"
import { TASK_ROW_TOOLTIPS, TASK_STATUSES, VARIANTS, TASK_EDITOR_WIDTH } from "../../../Core/utils/constants"
import { DragContainer, DragIndicator, IconContainer, TaskContainer, WasteContainer, TimeContainer, EfficiencyContainer, DueContainer, ThreadContainer, DependencyContainer, TrashContainer, TaskRowStyled, } from "./TaskRow.elements"
import { TaskInput } from "../../atoms/TaskInput/TaskInput"
import HoursInput from '../../atoms/HoursInput/HoursInput.js'
import { parseISO, format } from "date-fns"
import { formatTimeLeft } from "../../../Core/utils/helpers"
import DateTimePickerWrapper from "../../atoms/DateTimePickerWrapper/DateTimePickerWrapper.js"
import OptionPicker from "../../atoms/OptionPicker/OptionPicker.js"
import { BiTrash } from "react-icons/bi"
import { useTaskRow, useCompleteIcon, useTaskInputContainer, useWaste, useTtc, useEta, useEfficiency, useDue, useWeight, useThread, useDependency, useTrash } from '../../../Application/hooks/TaskRow/useTaskRow.js'
const { dndTooltip, completedTooltip, incompleteTooltip, taskTooltip, wasteTooltip, ttcTooltip, etaTooltip, efficencyToolTip, dueToolTip, weightToolTip, threadToolTip, dependencyToolTip, deleteTooltip } = TASK_ROW_TOOLTIPS
const iconSize = 36

// TODO: Extract to helpers file 
// TODO: Extract to separate slots file (this is main file) 
const displayWaste = waste => waste ? formatTimeLeft({ isNegative: waste < 0, timeDifference: waste < 0 ? -waste : waste, minuteText: 'minutes', hourText: 'hour', hourText2: 'hours' }) : '0 minutes'
const displayEta = eta => eta && typeof eta === 'string' && !isNaN(parseISO(eta).getTime()) ? format(parseISO(eta), "HH:mm") : '00:00'
const displayEfficiency = efficiency => !efficiency || efficiency <= 0 ? '-' : `${(parseFloat(efficiency) * 100).toFixed(0)}%`
const formatDate = localDueDate => localDueDate ? format(parseISO(localDueDate), 'MMM-d-yyyy @ h:mm a') : "invalid"
const getTaskRowDnDStyle = provided => ({ ...provided?.draggableProps?.style, boxShadow: provided?.isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none' })

const Drag = ({ provided }) => (
    <DragContainer title={dndTooltip} {...provided?.dragHandleProps ?? ''} >
        <DragIndicator size={iconSize} />
    </DragContainer>
)
const CompleteIcon = ({ taskID, customHook = useCompleteIcon }) => {
    const { isChecked, handleCheckBoxClicked } = customHook?.(taskID) || {}
    return (
        <IconContainer title={isChecked ? completedTooltip : incompleteTooltip}>
            {isChecked
                ? <MdOutlineCheckBox size={iconSize} onClick={handleCheckBoxClicked} />
                : <MdOutlineCheckBoxOutlineBlank size={iconSize} onClick={handleCheckBoxClicked} />}
        </IconContainer>
    )
}
// TODO: See if default value and taskName are needed or if taskName alone is ok
const TaskInputContainer = ({ taskID, customHook = useTaskInputContainer }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { status = TASK_STATUSES.INCOMPLETE, taskName } = childState || {}
    const { onBlurEvent } = childServices || {}
    return (
        <TaskContainer aria-label={taskTooltip} title={taskTooltip}>
            {status === TASK_STATUSES.COMPLETED
                ? <p>{taskName}</p>
                : <TaskInput maxLength='50' defaultValue={taskName} onBlur={onBlurEvent} />}
        </TaskContainer>
    )
}
const Waste = ({ taskID, customHook = useWaste }) => {
    const { waste, renderFunction = displayWaste } = customHook?.(taskID) || {}
    return (<WasteContainer title={wasteTooltip} style={{ width: '200px' }}><p>{renderFunction(waste)}</p></WasteContainer>)
}
const Ttc = ({ taskID, customHook = useTtc }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { variant = VARIANTS[0], status, ttc } = childState || {}
    const { onValueChangeEvent, onBlurEvent } = childServices || {}
    return ( // TODO: Simplify this Component by extracting to helper or something. TODO: possibly pass a render function in TODO: figure out how to remove dependency on variant
        <TimeContainer title={ttcTooltip}>
            {status === TASK_STATUSES.COMPLETED
                ? <pre>{ttc && !isNaN(ttc) && ttc > 0 ? formatTimeLeft({ timeDifference: ttc, minuteText: 'minutes', hourText: 'hour', hourText2: 'hours' }) : '0 minutes'}</pre>
                : <HoursInput defaultValue={1} state={{ variant, placeholder: 'hours', text: 'hours' }} services={{ onValueChange: onValueChangeEvent, onBlur: onBlurEvent }} />
            }
        </TimeContainer>
    )
}
const Eta = ({ taskID, customHook = useEta }) => {
    const { eta, renderFunction = displayEta } = customHook?.(taskID) || {}
    return (<TimeContainer title={etaTooltip}><p aria-label={'eta for task'}> {renderFunction(eta)}</p></TimeContainer>)
}
const Efficiency = ({ taskID, customHook = useEfficiency }) => {
    const { efficiency, renderFunction = displayEfficiency } = customHook?.(taskID) || {}
    return (<EfficiencyContainer title={efficencyToolTip}><p>{renderFunction(efficiency)}</p></EfficiencyContainer>)
}
const Due = ({ taskID, customHook = useDue }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { variant = VARIANTS[0], isChecked, dueDate } = childState || {}
    const { onTimeChangeEvent } = childServices || {}
    return ( // TODO: simplify this or pass in a render function
        <DueContainer title={dueToolTip}>
            {isChecked
                ? formatDate(dueDate)
                : <DateTimePickerWrapper
                    state={{ variant, defaultTime: format(parseISO(dueDate), 'HH:mm'), defaultDate: parseISO(dueDate), }}
                    services={{ onTimeChange: onTimeChangeEvent }} />
            }
        </DueContainer>
    )
}
const Weight = ({ taskID, customHook = useWeight }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { variant = VARIANTS[0], isChecked, weight } = childState || {}
    const { onValueChangeEvent } = childServices || {}
    return ( // TODO: Simplify this
        <WeightContainer title={weightToolTip}>
            {isChecked
                ? parseFloat(weight).toFixed(2) || 1
                : <HoursInput
                    state={{ variant, placeholder: 1, min: 1 }}
                    defaultValue={(weight > .01 ? weight : 1)}
                    services={{ onValueChange: onValueChangeEvent }} />
            }
        </WeightContainer>
    )
}
const Thread = ({ taskID, customHook = useThread }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { variant = VARIANTS[0], options, defaultValue } = childState || {}
    const { onChangeEvent, onBlurEvent } = childServices || {}
    return (
        <ThreadContainer title={threadToolTip}>
            <OptionPicker
                state={{ variant, options, label: 'Select Thread', multiple: false }}
                services={{ onChange: onChangeEvent }}
                defaultValue={defaultValue}
                onBlur={onBlurEvent}
            />
        </ThreadContainer>
    )
}
const Dependency = ({ taskID, customHook = useDependency }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { variant, options, defaultValue } = childState || {}
    const { onChangeEvent } = childServices || {}
    return (
        <DependencyContainer title={dependencyToolTip}>
            <OptionPicker
                state={{ variant, options, multiple: true }}
                services={{ onChange: onChangeEvent }}
                defaultValue={defaultValue}
            />
        </DependencyContainer>
    )
}
const Trash = ({ taskID, customHook = useTrash }) => {
    const { onClickEvent } = customHook?.(taskID) || {}
    return (<TrashContainer><BiTrash title={deleteTooltip} onClick={onClickEvent} size={iconSize} /></TrashContainer>)
}

export const TaskRow = ({ renderNumber, children }) => <>{React.Children.toArray(children).slice(0, renderNumber || React.Children.toArray(children).length)}</> // Renders slice of children, and if no range provided it renders all children

export const TaskRowDefault = ({ state: { renderNumber, provided, taskID } = {}, customHook = useTaskRow }) => {
    const { variant, status, highlight } = customHook?.(taskID) || {}
    return (
        <TaskRowStyled
            variant={variant} status={status} highlight={highlight}
            style={getTaskRowDnDStyle(provided)} maxwidth={TASK_EDITOR_WIDTH}
            ref={provided?.innerRef} {...provided?.draggableProps}
        >
            <TaskRow renderNumber={renderNumber}>
                <Drag provided={provided} />
                <CompleteIcon taskID={taskID} />
                <TaskInputContainer taskID={taskID} />
                <Waste taskID={taskID} />
                <Ttc taskID={taskID} />
                <Eta taskID={taskID} />
                <Efficiency taskID={taskID} />
                <Due taskID={taskID} />
                <Weight taskID={taskID} />
                <Thread taskID={taskID} />
                <Dependency taskID={taskID} />
            </TaskRow>
            <Trash />
        </TaskRowStyled>
    )
}