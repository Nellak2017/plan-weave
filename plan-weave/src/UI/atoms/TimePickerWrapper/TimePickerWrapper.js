import { useState, useEffect, useMemo, useRef } from 'react'
import { TimePickerWrapperStyled, ClockIconWrapper, TimeClockWrapper, Display } from './TimePickerWrapper.elements'
import { getDefaultState, VIEW, SHOW_CLOCK, getFSMValue, handleClick, handleViewChange, handleBlur } from '../../../Application/finiteStateMachines/TimePickerWrapper.fsm.js'
import { format, parse } from 'date-fns'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimeClock } from '@mui/x-date-pickers'

export const TimePickerWrapper = ({
  state: { defaultTime = '14:00', offset: { verticalOffset = 0, horizontalOffset = 0 } = {} } = {},
  services: { onTimeChange } = {},
  ...rest
}) => {
  const initialTime = useRef(parse(defaultTime, 'HH:mm', new Date()))
  const [time, setTime] = useState(initialTime.current)
  /* eslint-disable react-hooks/exhaustive-deps */
  const debouncedTime = useMemo(() => time, [time / 10]) // divide by 10 to be able to debounce on first decimal place of change
  useEffect(() => { onTimeChange?.(debouncedTime) }, [debouncedTime]) // only call parent when clock hand changes
  /* eslint-disable react-hooks/exhaustive-deps */
  const [fsmState, setFsmState] = useState(getDefaultState()) // the current state of the state machine
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePickerWrapperStyled>
        <Display><p aria-label={`Time display`}>{format(debouncedTime, 'HH:mm')}</p></Display>
        <ClockIconWrapper aria-label="Toggle clock" onMouseDown={() => handleClick(setFsmState, fsmState)} onKeyDown={e => { if (e.key === 'Enter') { handleClick(setFsmState, fsmState) } }}>
          <AiOutlineClockCircle size={32} {...rest} />
        </ClockIconWrapper>
        <TimeClockWrapper $showclock={getFSMValue(fsmState, SHOW_CLOCK)} $verticalOffset={verticalOffset} $horizontalOffset={horizontalOffset}>
          <TimeClock
            defaultValue={initialTime.current} view={getFSMValue(fsmState, VIEW)}
            ampm={false} minutesStep={5} size={32} tabIndex={0} ref={input => input?.focus()}
            onBlur={() => handleBlur(setFsmState, fsmState)} onFocusedViewChange={() => handleViewChange(setFsmState, fsmState)} onChange={newTime => setTime(newTime)}
          />
        </TimeClockWrapper>
      </TimePickerWrapperStyled>
    </LocalizationProvider>
  )
}
export default TimePickerWrapper