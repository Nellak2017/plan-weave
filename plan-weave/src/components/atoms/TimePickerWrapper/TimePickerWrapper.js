import { useState, useRef } from 'react'
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
}) {
  const [time, setTime] = useState(parse(defaultTime, 'HH:mm', new Date()))
  const [showClock, setShowClock] = useState(false)
  const [view, setView] = useState('hours')
  const [buttonClicked, setButtonClicked] = useState(false)
  const handleTimeChange = newTime => {
    setTime(newTime)
    onTimeChange && onTimeChange(newTime); // Pass the updated time back to the parent component
  }
  const toggleClock = () => { setButtonClicked(true); setShowClock(!showClock); setView('hours'); setTime(time) }
  const handleViewChange = changed => { setView(changed !== null ? changed : 'hours'); setShowClock(view !== 'minutes') }
  const handleBlur = () => {
    if (!buttonClicked) {
        setShowClock(false)
        setView('hours')
        setTime(time)
      }
      setButtonClicked(false)
    }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePickerWrapperStyled variant={variant} >
        <Display><p>{displayText}</p><p>{ampm ? format(time, 'hh:mm a') : format(time, 'HH:mm')}</p></Display>
        <ClockIconWrapper onMouseDown={toggleClock}>
          <AiOutlineClockCircle size={32} />
        </ClockIconWrapper>
        <TimeClockWrapper
          $showclock={showClock}
          $verticalOffset={verticalOffset}
          $horizontalOffset={horizontalOffset}>
          <ClockStyled
            value={time}
            onChange={handleTimeChange}
            onFocusedViewChange={handleViewChange}
            ampm={false}
            minutesStep={5}
            size={32}
            view={view}
            onBlur={handleBlur}
            ref={input => input && input.focus()}
            tabIndex={0}
          />
        </TimeClockWrapper>
      </TimePickerWrapperStyled>
    </LocalizationProvider>
  )
}

export default TimePickerWrapper