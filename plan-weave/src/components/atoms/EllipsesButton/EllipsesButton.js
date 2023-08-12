import React from 'react'
import { EllipsesButtonStyled } from './EllipsesButton.elements'
import { THEMES } from '../../utils/constants'

const EllipsesButton = ({ variant, color, size, ...rest }) => {
  if (variant && !THEMES.includes(variant)) variant = 'dark'
  return (
    <EllipsesButtonStyled variant={variant} color={color} size={size} {...rest}>
      ...
    </EllipsesButtonStyled>
  )
}

export default EllipsesButton