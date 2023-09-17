import { useState, useEffect, useMemo } from 'react'
import {
  ClockStyled,
  TimePickerWrapperStyled,
  ClockIconWrapper,
  TimeClockWrapper,
  Display
} from './TimePickerWrapper.elements'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format, parse } from 'date-fns'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { THEMES, CLOCK_DEBOUNCE } from '../../utils/constants'
import { debounce } from 'lodash'
/*
  TODO: Possibly refactor this with XState FSM library if the code becomes unmanageable
*/

function TimePickerWrapper({
  variant,
  defaultTime = '14:00',
  displayText = 'Start',
  ampm = false,
  verticalOffset = 0,
  horizontalOffset = 0,
  onTimeChange, // Prop to pass the selected time back to the parent component
  controlled = false, // Flag to indicate if time is controlled by the parent
  time: controlledTime, // Controlled time passed from the parent
  tabIndex, // used for selecting the icon
  onKeyDown, // used for using enter key to press on icon
  title // used to tell the user what clicking the icon will do whenever they hover over it (tool tip)
}) {
  // --- Verify Input
  if (variant && !THEMES.includes(variant)) variant = 'dark'
  
  // --- State for component
  const [time, setTime] = useState(parse(defaultTime, 'HH:mm', new Date()))
  const [showClock, setShowClock] = useState(false)
  const [view, setView] = useState('hours')
  const [buttonClicked, setButtonClicked] = useState(false)

  // --- Code For Controlled Component Feature
  useEffect(() => {
    if (!controlled) setTime(parse(defaultTime, 'HH:mm', new Date()))
  }, [controlled, defaultTime]) // Update internal time state if not controlled
  const currentTime = controlled ? controlledTime : time // Use controlledTime if controlled by the parent

  // --- Debouncing the Clock Feature
  const debouncedChangeHandler = useMemo( () => debounce(newTime => onTimeChange(newTime), CLOCK_DEBOUNCE), [])
  useEffect(() => { return () => { debouncedChangeHandler.cancel() }}, [debouncedChangeHandler])

  // --- Clock FSM (implemented without State machines) Feature
  const handleTimeChange = newTime => {
    setTime(newTime)
    onTimeChange && debouncedChangeHandler(newTime); // Pass the updated time back to the parent component
  }
  const toggleClock = () => {
    setButtonClicked(true); setShowClock(!showClock); setView('hours'); //setTime(time) 
  }
  const handleViewChange = changed => { setView(changed !== null ? changed : 'hours'); setShowClock(view !== 'minutes') }
  const handleBlur = () => {
    if (!buttonClicked) {
      setShowClock(false)
      setView('hours')
      //setTime(time)
    }
    setButtonClicked(false)
  }

  // BEFORE Controlled code, time was used to be displayed, not currentTime
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePickerWrapperStyled variant={variant} >
        <Display><p>{displayText}</p><p>{ampm ? format(currentTime, 'hh:mm a') : format(currentTime, 'HH:mm')}</p></Display>
        <ClockIconWrapper role="button" onMouseDown={toggleClock} onKeyDown={(e) => { if (e.key === 'Enter') { toggleClock() } }}>
          <AiOutlineClockCircle tabIndex={tabIndex} size={32} title={title} />
        </ClockIconWrapper>
        <TimeClockWrapper
          $showclock={showClock}
          $verticalOffset={verticalOffset}
          $horizontalOffset={horizontalOffset}>
          <ClockStyled
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