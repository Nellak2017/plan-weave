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
TODO:
 X 3. Fix the onClick,onBlur race condition
 X 4. Add a prop to control am/pm formatting or 24 hour (It will be a setting)
 6. Make sure to pass this time data up to your TaskControl Molecule
 X 7. Make sure to reset the component when clicked off or pressed again
 X 8. Add a Clock vertical and horizontal offset prop so that you can 
    manually adjust the clock's x/y position so it looks good on any
    viewport
 X 9. Adjust the clock so it is more user friendly, user should be able to jump 
     between hour and minute views at will
*/

function TimePickerWrapper({
  variant,
  defaultTime = '14:00',
  displayText = 'Start',
  ampm = false,
  verticalOffset = 0,
  horizontalOffset = 0,
  ...rest }) {

  const [time, setTime] = useState(parse(defaultTime, 'HH:mm', new Date()))
  const [showClock, setShowClock] = useState(false)
  const [view, setView] = useState('hours')
  const [buttonClicked, setButtonClicked] = useState(false)
  const handleTimeChange = newTime => setTime(newTime)
  const toggleClock = () => { setButtonClicked(true); setShowClock(!showClock); setView('hours'); setTime(time) }
  const handleBlur = () => {
    if (!buttonClicked) {
      setShowClock(false)
      setView('hours')
      setTime(time)
    }
    setButtonClicked(false)
  }
  const handleViewChange = changed => { setView(changed !== null ? changed : 'hours'); setShowClock(view !== 'minutes') }
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