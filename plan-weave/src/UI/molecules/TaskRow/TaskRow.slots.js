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
const { dndTooltip, completedTooltip, incompleteTooltip, taskTooltip, wasteTooltip, ttcTooltip, etaTooltip, efficencyToolTip, dueToolTip, weightToolTip, threadToolTip, dependencyToolTip, deleteTooltip } = TASK_ROW_TOOLTIPS
const iconSize = 36

// TODO: Extract to helpers file 
// TODO: Extract to separate slots file (this is main file) 
const displayWaste = waste => {
    if (waste && !isNaN(waste) && waste !== 0) {
        return waste > 0
            ? formatTimeLeft({ timeDifference: waste, minuteText: 'minutes', hourText: 'hour', hourText2: 'hours' })
            : `-${formatTimeLeft({ timeDifference: -waste, minuteText: 'minutes', hourText: 'hour', hourText2: 'hours' })}`
    } else { return '0 minutes' }
}
const displayEfficiency = efficiency => !efficiency || efficiency <= 0 ? '-' : `${(parseFloat(efficiency) * 100).toFixed(0)}%`
const formatDate = localDueDate => localDueDate ? format(parseISO(localDueDate), 'MMM-d-yyyy @ h:mm a') : "invalid"

const Drag = ({ provided }) => (
    <DragContainer title={dndTooltip} {...provided?.dragHandleProps ?? ''} >
        <DragIndicator size={iconSize} />
    </DragContainer>
)
const Icon = ({ isChecked, handleCheckBoxClicked }) => (
    <IconContainer title={isChecked ? completedTooltip : incompleteTooltip}>
        {isChecked
            ? <MdOutlineCheckBox size={iconSize} onClick={handleCheckBoxClicked} />
            : <MdOutlineCheckBoxOutlineBlank size={iconSize} onClick={handleCheckBoxClicked} />}
    </IconContainer>
)
const TaskInputContainer = ({ state: { status = TASK_STATUSES.INCOMPLETE, task, defaultValue } = {}, services: { onBlurEvent } = {} }) => (
    <TaskContainer aria-label={taskTooltip} title={taskTooltip}>
        {status === TASK_STATUSES.COMPLETED
            ? <p>{task}</p>
            : <TaskInput maxLength='50' defaultValue={defaultValue} onBlur={onBlurEvent} />}
    </TaskContainer>
)
const Waste = ({ waste }) => ( // TODO: possibly pass a render function in
    <WasteContainer title={wasteTooltip} style={{ width: '200px' }}><p>{displayWaste(waste)}</p></WasteContainer>
)
const Ttc = ({ state: { variant = VARIANTS[0], status, ttc } = {}, services: { onValueChangeEvent, onBlurEvent } = {} }) => ( // TODO: Simplify this Component by extracting to helper or something. TODO: possibly pass a render function in TODO: figure out how to remove dependency on variant
    <TimeContainer title={ttcTooltip}>
        {status === TASK_STATUSES.COMPLETED
            ? <pre>{ttc && !isNaN(ttc) && ttc > 0 ? formatTimeLeft({ timeDifference: ttc, minuteText: 'minutes', hourText: 'hour', hourText2: 'hours' }) : '0 minutes'}</pre>
            : <HoursInput defaultValue={1} state={{ variant, placeholder: 'hours', text: 'hours' }} services={{ onValueChange: onValueChangeEvent, onBlur: onBlurEvent }} />
        }
    </TimeContainer>
)
const Eta = ({ eta }) => ( // TODO: Possibly extract this display logic to a helper. TODO: possibly pass a render function in
    <TimeContainer title={etaTooltip}>
        <p aria-label={'eta for task'}> {
            eta && typeof eta === 'string' && !isNaN(parseISO(eta).getTime())
                ? format(parseISO(eta), "HH:mm")
                : '00:00'}
        </p>
    </TimeContainer>
)
const Efficiency = ({ efficiency }) => ( // TODO: pass in render function
    <EfficiencyContainer title={efficencyToolTip}><p>{displayEfficiency(efficiency)}</p></EfficiencyContainer>
)
const Due = ({ state: { variant, isChecked, dueDate } = {}, services: { onTimeChangeEvent } = {} }) => ( // TODO: simplify this
    <DueContainer title={dueToolTip}>
        {isChecked
            ? formatDate(dueDate)
            : <DateTimePickerWrapper
                state={{ variant, defaultTime: format(parseISO(dueDate), 'HH:mm'), defaultDate: parseISO(dueDate), }}
                services={{ onTimeChange: onTimeChangeEvent }} />
        }
    </DueContainer>
)
const Weight = ({ state: { variant, isChecked, weight } = {}, services: { onValueChangeEvent } = {} }) => ( // TODO: Simplify this
    <WeightContainer title={weightToolTip}>
        {isChecked
            ? parseFloat(weight).toFixed(2) || 1
            : <HoursInput
                state={{ variant, placeholder: 1, min: 1 }}
                defaultValue={(weight && weight > .01 ? weight : 1)} // TODO: possibly clamp this
                services={{ onValueChange: onValueChangeEvent }} />
        }
    </WeightContainer>
)
const Thread = ({ state: { variant, options, defaultValue } = {}, services: { onChangeEvent, onBlurEvent } = {} }) => ( // TODO: Simplify this
    <ThreadContainer title={threadToolTip}>
        <OptionPicker
            state={{ variant, options, label: 'Select Thread', multiple: false }}
            services={{ onChange: onChangeEvent }}
            defaultValue={defaultValue}
            onBlur={onBlurEvent}
        />
    </ThreadContainer>
)
const Dependency = ({ state: { variant, options, defaultValue } = {}, services: { onChangeEvent } = {} }) => ( // TODO: Simplify this
    <DependencyContainer title={dependencyToolTip}>
        <OptionPicker
            state={{ variant, options, multiple: true }}
            services={{ onChange: onChangeEvent }}
            defaultValue={defaultValue}
        />
    </DependencyContainer>
)
const Trash = ({ onClickEvent }) => (<TrashContainer><BiTrash title={deleteTooltip} onClick={onClickEvent} size={iconSize} /></TrashContainer>)

export const TaskRow = ({ renderNumber, children }) => <>{React.Children.toArray(children).slice(0, renderNumber || React.Children.toArray(children).length)}</> // Renders slice of children, and if no range provided it renders all children

export const TaskRowDefault = ({ state: { renderNumber, provided, taskId } = {}, customHook }) => {
    // const { ... } = customHook?.() || hook()
    // TaskRowStyled should be enclosed with Draggable Component if it is not complete otherwise it is not (Maybe find a way to disable it using dnd api?)
    return (
        <TaskRowStyled
            // TODO: potentially clean this up, it was copy/pasted from old code
            ref={provided?.innerRef} {...provided?.draggableProps}
            style={{ ...provided?.draggableProps?.style, boxShadow: provided?.isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none' }}
            maxwidth={TASK_EDITOR_WIDTH}
        >
            <TaskRow renderNumber={renderNumber}>
                <Drag provided={provided} />
                <Icon />
                <TaskInputContainer />
                <Waste />
                <Ttc />
                <Eta />
                <Efficiency />
                <Due />
                <Weight />
                <Thread />
                <Dependency />
            </TaskRow>
            <Trash />
        </TaskRowStyled>
    )
}