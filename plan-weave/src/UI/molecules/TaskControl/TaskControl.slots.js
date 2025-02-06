import { format } from "date-fns"
import { TimePickerContainer, TopContainer, BottomContainer, BottomContentContainer, Separator } from "./TaskControl.elements"
import { formatTimeLeft } from '../../../Core/utils/helpers.js'
import { DEFAULT_TASK_CONTROL_TOOL_TIPS, TIME_PICKER_COORDS, OWL_SIZE, TASK_CONTROL_TITLES, SORTING_METHODS, OPTION_NOTIFICATIONS } from "../../../Core/utils/constants"
import { VALID_TIMERANGE_IDS } from '../../../Application/validIDs.js'
import { theme } from "../../styles/MUITheme"
import { GiOwl } from "react-icons/gi"; import { BiPlusCircle } from 'react-icons/bi'; import { IoIosInformationCircleOutline } from "react-icons/io"
import SearchBar from "../../atoms/SearchBar/SearchBar"; import { MultipleDeleteButton } from '../MultipleDeleteButton/MultipleDeleteButton.js'; import TimePickerWrapper from "../../atoms/TimePickerWrapper/TimePickerWrapper"; import DropDownButton from '../../atoms/DropDownButton/DropDownButton'

const styleIfToggled = cond => cond && { color: theme.palette.primary.main }
const onKeyDownFactory = fx => e => { if (e.key === 'Enter') { fx() } }
const generateDropDownOptions = fx => Object.keys(SORTING_METHODS).map(value => ({ name: value || 'default', listener: () => { OPTION_NOTIFICATIONS[value](); fx({ value }) } }))
const { owlToolTip, addToolTip, dropDownToolTip, fullTaskToggleTip } = DEFAULT_TASK_CONTROL_TOOL_TIPS
const { start, end } = TIME_PICKER_COORDS
const { START_TIME_PICKER_ID, END_TIME_PICKER_ID } = VALID_TIMERANGE_IDS
const { startButton, endButton } = TASK_CONTROL_TITLES

export const TopSlot = ({ state: { variant, currentTime, startTime, endTime, isOwl } = {}, services: { search, updateTimeRange, toggleOwl } = {} }) => (
    <TopContainer>
        <SearchBar state={{ variant }} services={{ search }} title={'Search for Tasks'} tabIndex={0} />
        <p title={'Current Time'}>{format(currentTime, 'HH:mm')}</p>
        <TimePickerContainer>{/* onBlur={() => checkTimeRange({ startTime, endTime, isOwl })} */}
            <TimePickerWrapper
                state={{ variant, defaultTime: format(startTime, 'HH:mm'), offset: start, }}
                services={{ onTimeChange: value => updateTimeRange({ id: START_TIME_PICKER_ID, value }) }}
                title={startButton} tabIndex={0}
            />
            <TimePickerWrapper
                state={{ variant, defaultTime: format(endTime, 'HH:mm'), offset: end, }}
                services={{ onTimeChange: value => updateTimeRange({ id: END_TIME_PICKER_ID, value }) }}
                title={endButton} tabIndex={0}
            />
            <GiOwl onClick={() => toggleOwl()} onKeyDown={onKeyDownFactory(toggleOwl)} style={styleIfToggled(isOwl)} tabIndex={0} title={owlToolTip} size={OWL_SIZE} />
        </TimePickerContainer>
    </TopContainer>
)

export const BottomSlot = ({ state: { variant, isFullTask, fsmControlledState, currentTime, endTime, isOwl } = {}, services: { addTask, fullTaskToggle, setMultiDeleteFSMState, sort } = {}, }) => (
    <BottomContainer>
        <BottomContentContainer>
            <BiPlusCircle onClick={() => addTask()} onKeyDown={onKeyDownFactory(addTask)} tabIndex={0} title={addToolTip} size={OWL_SIZE} />
            <IoIosInformationCircleOutline onClick={() => fullTaskToggle()} onKeyDown={onKeyDownFactory(fullTaskToggle)} style={styleIfToggled(isFullTask)} tabIndex={0} title={fullTaskToggleTip} size={OWL_SIZE} />
            <MultipleDeleteButton state={{ fsmControlledState }} services={{ setControlledFSMState: setMultiDeleteFSMState }} />
            <Separator variant={variant} />
        </BottomContentContainer>
        <BottomContentContainer><p title={'Time left until End of Task Period'}>{formatTimeLeft({ currentTime, endTime, overNightMode: isOwl })}</p></BottomContentContainer>
        <BottomContentContainer>
            <Separator variant={variant} /><DropDownButton options={generateDropDownOptions(sort)} tabIndex={0} title={dropDownToolTip} />
        </BottomContentContainer>
    </BottomContainer>
)