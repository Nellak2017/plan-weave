import React from 'react'
import { ButtonStyled } from './Button.elements.js'

function Button(props) {
	const { size = 's', variant = 'standardButton', children, ...rest } = props
	return (
		<ButtonStyled size={size} variant={variant} {...rest}>
			{children}
		</ButtonStyled>
	)
}

export default Button