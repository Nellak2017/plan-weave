import React from 'react'
import { EllipsesButtonStyled } from './EllipsesButton.elements'

const EllipsesButton = ({ variant, color, size, ...rest }) => {
  return (
    <EllipsesButtonStyled variant={variant} color={color} size={size} {...rest}>
      ...
    </EllipsesButtonStyled>
  )
}

export default EllipsesButton