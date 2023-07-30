import React, { useState } from 'react'
import { TaskInputStyled } from './TaskInput.elements'

const TaskInput = ({ placeholder = 'Task Name', maxwidth, initialValue, ...rest }) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const handleChange = e => setInputValue(e.target.value)
  return <TaskInputStyled
    type='text'
    value={inputValue}
    onChange={handleChange}
    maxwidth={maxwidth}
    placeholder={placeholder}
    {...rest} />
}

export default TaskInput