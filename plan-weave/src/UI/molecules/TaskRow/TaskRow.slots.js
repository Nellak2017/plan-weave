import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md"
import { TASK_ROW_TOOLTIPS, TASK_STATUSES, ICON_SIZE } from "../../../Core/utils/constants"
import { DragContainer, DragIndicator, PlayButton, PauseButton, IconContainer, TaskContainer, WasteContainer, TimeContainer, EfficiencyContainer, DueContainer, WeightContainer, ThreadContainer, DependencyContainer, RefreshButton, TrashContainer, } from "./TaskRow.elements"
import { TaskInput } from "../../atoms/TaskInput/TaskInput"
import HoursInput, { HoursInputPositiveFloat } from '../../atoms/HoursInput/HoursInput.js'
import { parseISO, format } from "date-fns"
import { formatWaste, formatEta, formatEfficiency, formatDate, formatTTC } from "../../../Core/utils/helpers"
import DateTimePickerWrapper from "../../atoms/DateTimePickerWrapper/DateTimePickerWrapper.js"
import OptionPicker from "../../atoms/OptionPicker/OptionPicker.js"
import { BiTrash } from "react-icons/bi"
import { useCompleteIcon, usePlayPause, useTaskInputContainer, useWaste, useTtc, useEta, useEfficiency, useDue, useWeight, useThread, useDependency, useRefresh, useTrash } from '../../../Application/hooks/TaskRow/useTaskRow.js'
const { dndTooltip, playTooltip, pauseTooltip, completedTooltip, incompleteTooltip, taskTooltip, wasteTooltip, ttcTooltip, etaTooltip, efficencyToolTip, dueToolTip, weightToolTip, threadToolTip, dependencyToolTip, refreshTooltip, deleteTooltip } = TASK_ROW_TOOLTIPS

export const Drag = ({ provided }) => (<DragContainer title={dndTooltip} {...provided?.dragHandleProps ?? ''} ><DragIndicator size={ICON_SIZE} /></DragContainer>)
export const PlayPause = ({ taskID, currentTime, customHook = usePlayPause }) => {
    const { isLive, handlePlayPauseClicked } = customHook?.(taskID, currentTime) || {}
    return (
        <IconContainer title={isLive ? pauseTooltip : playTooltip}>
            {isLive
                ? <PauseButton size={ICON_SIZE} onClick={handlePlayPauseClicked} />
                : <PlayButton size={ICON_SIZE} onClick={handlePlayPauseClicked} />}
        </IconContainer>
    )
}
export const CompleteIcon = ({ taskID, currentTime, customHook = useCompleteIcon }) => {
    const { isChecked, handleCheckBoxClicked } = customHook?.(taskID, currentTime) || {}
    return (
        <IconContainer title={isChecked ? completedTooltip : incompleteTooltip}>
            {isChecked
                ? <MdOutlineCheckBox size={ICON_SIZE} onClick={handleCheckBoxClicked} />
                : <MdOutlineCheckBoxOutlineBlank size={ICON_SIZE} onClick={handleCheckBoxClicked} />}
        </IconContainer>
    )
}
export const TaskInputContainer = ({ taskID, customHook = useTaskInputContainer }) => {
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
export const Waste = ({ taskID, currentTime, customHook = useWaste }) => {
    const { waste, renderFunction = formatWaste } = customHook?.(taskID, currentTime) || {}
    return (<WasteContainer title={wasteTooltip} style={{ width: '200px' }}><p>{renderFunction(waste)}</p></WasteContainer>)
}
export const Ttc = ({ taskID, customHook = useTtc }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { status, ttc } = childState || {}
    const { onBlurEvent } = childServices || {}
    return (
        <TimeContainer title={ttcTooltip}>
            {status === TASK_STATUSES.COMPLETED
                ? <pre>{formatTTC(ttc)}</pre>
                : <HoursInputPositiveFloat
                    defaultValue={ttc}
                    state={{ step: .01, min: .01, placeholder: 'hours', text: 'hours' }}
                    services={{ onBlur: onBlurEvent }}
                />
            }
        </TimeContainer>
    )
}
export const Eta = ({ taskID, currentTime, customHook = useEta }) => {
    const { eta, renderFunction = formatEta } = customHook?.(taskID, currentTime,) || {}
    return (<TimeContainer title={etaTooltip}><p aria-label={'eta for task'}> {renderFunction(eta)}</p></TimeContainer>)
}
export const Efficiency = ({ taskID, currentTime, customHook = useEfficiency }) => {
    const { efficiency, renderFunction = formatEfficiency } = customHook?.(taskID, currentTime) || {}
    return (<EfficiencyContainer title={efficencyToolTip}><p>{renderFunction(efficiency)}</p></EfficiencyContainer>)
}
export const Due = ({ taskID, customHook = useDue }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { isChecked, dueDate } = childState || {}
    const { onTimeChangeEvent } = childServices || {}
    return (
        <DueContainer title={dueToolTip}>
            {isChecked
                ? formatDate(dueDate)
                : <DateTimePickerWrapper
                    state={{ defaultTime: format(parseISO(dueDate), 'HH:mm'), defaultDate: parseISO(dueDate), }}
                    services={{ onTimeChange: onTimeChangeEvent }} />
            }
        </DueContainer>
    )
}
export const Weight = ({ taskID, customHook = useWeight }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { isChecked, weight } = childState || {}
    const { onValueChangeEvent } = childServices || {}
    return (
        <WeightContainer title={weightToolTip}>
            {isChecked
                ? parseFloat(weight).toFixed(2) || 1
                : <HoursInput
                    state={{ placeholder: 1, min: 1 }}
                    defaultValue={(weight > .01 ? weight : 1)}
                    services={{ onValueChange: onValueChangeEvent }} />
            }
        </WeightContainer>
    )
}
export const Thread = ({ taskID, customHook = useThread }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { options, defaultValue } = childState || {}
    const { onBlurEvent } = childServices || {}
    return (
        <ThreadContainer title={threadToolTip}>
            <OptionPicker state={{ options, label: 'Select Thread', multiple: false }} value={defaultValue} onBlur={e => onBlurEvent(e.target.value)} />
        </ThreadContainer>
    )
}
export const Dependency = ({ taskID, customHook = useDependency }) => {
    const { childState, childServices } = customHook?.(taskID) || {}
    const { options = [], defaultValue } = childState || {}
    const { onChangeEvent } = childServices || {}
    return (
        <DependencyContainer title={dependencyToolTip}>
            <OptionPicker
                state={{ options, multiple: true }} defaultValue={defaultValue}
                // eslint-disable-next-line max-params
                onChange={(_e, _newDependencies, reason, details) => onChangeEvent(reason, details)}
            />
        </DependencyContainer>
    )
}
export const TaskID = ({ taskID }) => (<WasteContainer>{taskID}</WasteContainer>)
export const Refresh = ({ taskID, customHook = useRefresh }) => {
    const { handleRefreshClicked } = customHook?.(taskID) || {}
    return (<IconContainer title={refreshTooltip}><RefreshButton size={ICON_SIZE} onClick={handleRefreshClicked} /></IconContainer>)
}
export const Trash = ({ taskID, customHook = useTrash }) => {
    const { onClickEvent } = customHook?.(taskID) || {}
    return (<TrashContainer><BiTrash title={deleteTooltip} onClick={onClickEvent} size={ICON_SIZE} /></TrashContainer>)
}