import { format } from "date-fns"
import { TimePickerContainer, TopContainer, BottomContainer, BottomContentContainer, Separator } from "./TaskControl.elements"
import { formatTaskControlTimeLeft } from '../../../Core/utils/helpers.js'
import { DEFAULT_TASK_CONTROL_TOOL_TIPS, OWL_SIZE, TASK_CONTROL_TITLES, SORTING_METHODS, OPTION_NOTIFICATIONS } from "../../../Core/utils/constants"
import { VALID_TIMERANGE_IDS } from '../../../Application/validIDs.js'
import { theme } from "../../styles/MUITheme"
import { GiOwl } from "react-icons/gi"; import { BiPlusCircle } from 'react-icons/bi'; import { IoIosInformationCircleOutline } from "react-icons/io"
import SearchBar from "../../atoms/SearchBar/SearchBar"; import { MultipleDeleteButton } from '../MultipleDeleteButton/MultipleDeleteButton.js'; import TimePickerWrapper from "../../atoms/TimePickerWrapper/TimePickerWrapper"; import DropDownButton from '../../atoms/DropDownButton/DropDownButton'
import { useTopSlot, useBottomSlot } from '../../../Application/hooks/TaskControl/useTaskControl.js'
import useMediaQuery from '@mui/material/useMediaQuery'

const styleIfToggled = cond => cond && { color: theme.palette.primary.main }
const onKeyDownFactory = fx => e => { if (e.key === 'Enter') { fx() } }
const generateDropDownOptions = fx => Object.keys(SORTING_METHODS).map(value => ({ name: value || 'default', listener: () => { OPTION_NOTIFICATIONS?.[value]?.(); fx?.({ value }) } }))
const { owlToolTip, addToolTip, dropDownToolTip, fullTaskToggleTip } = DEFAULT_TASK_CONTROL_TOOL_TIPS
const { END_TIME_PICKER_ID } = VALID_TIMERANGE_IDS
const { endButton } = TASK_CONTROL_TITLES

export const TopSlot = ({ currentTime = new Date(), customHook = useTopSlot }) => {
    const { childState, childServices } = customHook?.() || {}
    const { endTime, isOwl } = childState || {}
    const { search, updateTimeRange, toggleOwl } = childServices || {}
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
    return (
        <TopContainer>
            <SearchBar services={{ search }} title={'Search for Tasks'} tabIndex={0} />
            {!isSmallScreen && <p title={'Current Time'}>{format(currentTime, 'HH:mm')}</p>}
            {!isSmallScreen &&
                <TimePickerContainer>
                    <TimePickerWrapper
                        state={{ defaultTime: format(endTime, 'HH:mm') }}
                        services={{ onTimeChange: value => updateTimeRange?.({ id: END_TIME_PICKER_ID, value }) }}
                        title={endButton} tabIndex={0}
                    />
                    <GiOwl onClick={() => toggleOwl()} onKeyDown={onKeyDownFactory(toggleOwl)} style={styleIfToggled(isOwl)} tabIndex={0} title={owlToolTip} size={OWL_SIZE} />
                </TimePickerContainer>}
        </TopContainer>
    )
}
export const BottomSlot = ({ currentTime = new Date(), customHook = useBottomSlot }) => {
    const { childState, childServices } = customHook?.() || {}
    const { isFullTask, fsmControlledState, endTime, isOwl } = childState || {}
    const { addTask, fullTaskToggle, setMultiDeleteFSMState, sort } = childServices || {}
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')), isExtraSmallScreen = useMediaQuery('(max-width: 250px)')
    return (
        <BottomContainer>
            <BottomContentContainer>
                <BiPlusCircle id={'addTask'} onClick={() => addTask()} onKeyDown={onKeyDownFactory(addTask)} tabIndex={0} title={addToolTip} size={OWL_SIZE} />
                <IoIosInformationCircleOutline id={'toggleFullTask'} onClick={() => fullTaskToggle()} onKeyDown={onKeyDownFactory(fullTaskToggle)} style={styleIfToggled(isFullTask)} tabIndex={0} title={fullTaskToggleTip} size={OWL_SIZE} />
                <MultipleDeleteButton id={'deleteMultipleTasks'} state={{ fsmControlledState }} services={{ setControlledFSMState: setMultiDeleteFSMState }} />
                {!isSmallScreen && <Separator />}
            </BottomContentContainer>
            {!isSmallScreen && <BottomContentContainer><p title={'Time left until End of Task Period'}>{formatTaskControlTimeLeft({ currentTime, endTime, overNightMode: isOwl })}</p></BottomContentContainer>}
            <BottomContentContainer>
                {!isSmallScreen && <Separator />}
                {!isExtraSmallScreen && <DropDownButton options={generateDropDownOptions(sort)} tabIndex={0} title={dropDownToolTip} />}
            </BottomContentContainer>
        </BottomContainer>
    )
}