import React from 'react'
import { TaskInputStyled } from './TaskInput.elements'

const TaskInput = ({ placeholder='Task Name', maxwidth, ...rest }) => {
  return <TaskInputStyled maxwidth={maxwidth} placeholder={placeholder} {...rest} />
}

export default TaskInput