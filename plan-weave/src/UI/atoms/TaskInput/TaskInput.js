import React, { useState, useMemo } from 'react'
import { TaskInputStyled } from './TaskInput.elements'
import PropTypes from 'prop-types'

const TaskInput = ({ placeholder = 'Task Name', maxLength = '50', maxwidth, initialValue, controlledValue, ...rest }) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const valueToUse = useMemo(() => controlledValue !== undefined ? controlledValue : inputValue, [controlledValue, inputValue])
  return <TaskInputStyled
    type='text'
    maxLength={maxLength}
    value={valueToUse}
    onChange={e => setInputValue(e.target.value)}
    maxwidth={maxwidth}
    placeholder={placeholder}
    {...rest} />
}

TaskInput.propTypes = {
  placeholder: PropTypes.string,
  maxwidth: PropTypes.number,
  initialValue: PropTypes.string,
  controlledValue: PropTypes.string,
}

export default TaskInput