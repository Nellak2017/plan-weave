import { ButtonStyled } from './Button.elements.js'
const Button = ({ size = 's', variant = 'standardButton', children, ...rest }) => (<ButtonStyled $size={size} variant={variant} {...rest}>{children}</ButtonStyled>)
export default Button