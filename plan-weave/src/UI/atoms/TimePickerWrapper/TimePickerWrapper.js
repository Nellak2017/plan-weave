import { useState, useEffect, useMemo } from 'react'
import { TimePickerWrapperStyled, ClockIconWrapper, TimeClockWrapper, Display } from './TimePickerWrapper.elements'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format, parse } from 'date-fns'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { CLOCK_DEBOUNCE, VARIANTS } from '../../../Core/utils/constants.js'
import { debounce } from 'lodash'
import { TimeClock } from '@mui/x-date-pickers'

function TimePickerWrapper({
  variant = VARIANTS[0],
  defaultTime = '14:00',
  displayText = 'Start',
  ampm = false,
  verticalOffset = 0,
  horizontalOffset = 0,
  onTimeChange, // Prop to pass the selected time back to the parent component
  controlled = false, // Flag to indicate if time is controlled by the parent
  time: controlledTime, // Controlled time passed from the parent
  tabIndex, // used for selecting the icon
  title, // used to tell the user what clicking the icon will do whenever they hover over it (tool tip)
}) {
  const [time, setTime] = useState(parse(defaultTime, 'HH:mm', new Date()))
  const [showClock, setShowClock] = useState(false)
  const [view, setView] = useState('hours')
  const [buttonClicked, setButtonClicked] = useState(false)
  useEffect(() => {
    if (!controlled) setTime(parse(defaultTime, 'HH:mm', new Date()))
  }, [controlled, defaultTime]) // Update internal time state if not controlled
  const currentTime = controlled ? controlledTime : time // Use controlledTime if controlled by the parent
  const debouncedChangeHandler = useMemo(() => debounce(newTime => onTimeChange(newTime), CLOCK_DEBOUNCE), [onTimeChange]) // --- Debouncing the Clock Feature
  useEffect(() => { return () => { debouncedChangeHandler.cancel() } }, [debouncedChangeHandler])
  const handleTimeChange = newTime => { // --- Clock FSM (implemented without State machines) Feature
    setTime(newTime)
    onTimeChange && debouncedChangeHandler(newTime) // Pass the updated time back to the parent component
  }
  const toggleClock = () => { setButtonClicked(true); setShowClock(!showClock); setView('hours'); }
  const handleViewChange = changed => { setView(changed !== null ? changed : 'hours'); setShowClock(view !== 'minutes') }
  const handleBlur = () => {
    if (!buttonClicked) { setShowClock(false); setView('hours') }
    setButtonClicked(false)
  }
  const timeDisplayMemo = useMemo(() => ampm ? format(currentTime, 'hh:mm a') : format(currentTime, 'HH:mm'), [currentTime, ampm])
  return ( // BEFORE Controlled code, time was used to be displayed, not currentTime
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePickerWrapperStyled variant={variant} >
        <Display><p>{displayText}</p><p aria-label={`Time display: ${timeDisplayMemo}`}>{timeDisplayMemo}</p></Display>
        <ClockIconWrapper role="button" aria-label="Toggle clock" onMouseDown={toggleClock} onKeyDown={(e) => { if (e.key === 'Enter') { toggleClock() } }}>
          <AiOutlineClockCircle tabIndex={tabIndex} size={32} title={title} />
        </ClockIconWrapper>
        <TimeClockWrapper $showclock={showClock} $verticalOffset={verticalOffset} $horizontalOffset={horizontalOffset} data-testid={`Dropdown for ${title}`}>
          <TimeClock
            value={currentTime}
            onChange={handleTimeChange}
            onFocusedViewChange={handleViewChange}
            ampm={false}
            minutesStep={5}
            size={32}
            view={view}
            onBlur={handleBlur}
            ref={input => input?.focus()}
            tabIndex={0}
          />
        </TimeClockWrapper>
      </TimePickerWrapperStyled>
    </LocalizationProvider>
  )
}
export default TimePickerWrapper