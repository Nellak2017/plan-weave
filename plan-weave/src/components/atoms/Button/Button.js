import React from 'react'
import { ButtonStyled } from './Button.elements.js'
import PropTypes from 'prop-types'

function Button({ size = 's', variant = 'standardButton', children, ...rest }) {
	return (
		<ButtonStyled $size={size} variant={variant} {...rest}>
			{children}
		</ButtonStyled>
	)
}

Button.propTypes = {
	size: PropTypes.string,
	variant: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.arrayOf(PropTypes.node),
	]),
}

export default Button