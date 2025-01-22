import { ButtonStyled } from './Button.elements.js'
import PropTypes from 'prop-types'

const Button = ({ size = 's', variant = 'standardButton', children, ...rest }) => (
	<ButtonStyled $size={size} variant={variant} {...rest}>{children}</ButtonStyled>
)
Button.propTypes = {
	size: PropTypes.string,variant: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.node,PropTypes.arrayOf(PropTypes.node),]),
}
export default Button