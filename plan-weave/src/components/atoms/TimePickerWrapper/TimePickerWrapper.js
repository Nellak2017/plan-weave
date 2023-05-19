import { useState } from 'react'
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
 1. Add a display prop that is like it is in the dropdownbutton to 
    conditionally render the dropdown Clock. Be sure to linearly 
    fade in and out.
 2. Mess with the styles so that it works for both themes
    Also be sure to add the box shadows and hover effects too
 3. Remove the red borders
 4. Add a prop to control am/pm formatting or 24 hour (It will be a setting)
 5. Make a Molecule of 2 date pickers to have start/end time choosing
 6. Make sure to pass this time data up to your TaskControl Molecule
 7. Make sure to reset the component when clicked off or pressed again
 8. Be sure to make the clock go down a few px so it is even with the parent 
    molecule container (maybe)
 9. Add a Clock vertical and horizontal offset prop so that you can 
    manually adjust the clock's x/y position so it looks good on any
    viewport
 10. Adjust the clock so it is more user friendly, user should be able to jump 
     between hour and minute views at will
*/

function TimePickerWrapper({ variant, defaultTime = '14:00', displayText = 'Start', ...rest }) {
  const [time, setTime] = useState(parse(defaultTime, 'HH:mm', new Date()))
  const [showClock, setShowClock] = useState(false)
  const handleTimeChange = (newTime) => setTime(newTime)
  const toggleClock = () => setShowClock(!showClock)
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePickerWrapperStyled>
        <Display><p>{displayText}</p><p>{format(time, 'HH:mm')}</p></Display>
        <ClockIconWrapper onClick={toggleClock}>
          <AiOutlineClockCircle size={32} />
        </ClockIconWrapper>
        <TimeClockWrapper>
          <ClockStyled
            value={time}
            onChange={handleTimeChange}
            ampm={false}
            minutesStep={5}
            size={32}
          // Customize any other props as needed
          />
        </TimeClockWrapper>
      </TimePickerWrapperStyled>
    </LocalizationProvider>
  )
}

export default TimePickerWrapper