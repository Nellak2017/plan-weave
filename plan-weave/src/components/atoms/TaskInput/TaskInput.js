import React, { useState } from 'react'
import { TaskInputStyled } from './TaskInput.elements'
import PropTypes from 'prop-types'

const TaskInput = ({ placeholder = 'Task Name', maxwidth, initialValue, ...rest }) => {
  const [inputValue, setInputValue] = useState(initialValue)
  return <TaskInputStyled
    type='text'
    value={inputValue}
    onChange={e => setInputValue(e.target.value)}
    maxwidth={maxwidth}
    placeholder={placeholder}
    {...rest} />
}

TaskInput.propTypes = {
  placeholder: PropTypes.string,
  maxwidth: PropTypes.number,
  initialValue: PropTypes.string,
}

export default TaskInput