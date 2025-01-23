import { EllipsesButtonStyled } from './EllipsesButton.elements'
import { VARIANTS } from '../../../Core/utils/constants.js'
const EllipsesButton = ({ variant = VARIANTS[0], color, size, ...rest }) => (<EllipsesButtonStyled variant={variant} color={color} size={size} {...rest}>...</EllipsesButtonStyled>)
export default EllipsesButton