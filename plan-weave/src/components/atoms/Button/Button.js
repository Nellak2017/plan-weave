import React from 'react'
import { ButtonStyled } from './Button.elements.js'

function Button({ size = 's', variant = 'standardButton', children, ...rest }) {
	return (
		<ButtonStyled size={size} variant={variant} {...rest}>
			{children}
		</ButtonStyled>
	)
}

export default Button