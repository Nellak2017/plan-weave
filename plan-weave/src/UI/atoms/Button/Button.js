import { ButtonStyled } from './Button.elements.js'
const Button = ({ variant, children, ...rest }) => (<ButtonStyled variant={'contained'} variantprop={variant} {...rest}>{children}</ButtonStyled>)
export default Button