import { HoursInputStyled } from "../HoursInput/HoursInput.elements"
import { TASK_NAME_MAX_LENGTH } from '../../../Core/utils/constants.js'
export const TaskInput = ({ maxLength = TASK_NAME_MAX_LENGTH, ...rest }) => (<HoursInputStyled maxLength={maxLength} style={{ textAlign: 'left' }} {...rest} />)