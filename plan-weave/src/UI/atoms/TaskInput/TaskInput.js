import React from 'react'
import { HoursInputStyled } from "../HoursInput/HoursInput.elements"
import { TASK_NAME_MAX_LENGTH } from '../../../Core/utils/constants.js'
export const TaskInput = React.forwardRef(({ maxLength = TASK_NAME_MAX_LENGTH, ...rest }, ref) => (<HoursInputStyled ref={ref} maxLength={maxLength} style={{ textAlign: 'left' }} {...rest} />))