import React from 'react'
import { EllipsesButtonStyled } from './EllipsesButton.elements'
import { THEMES } from '../../utils/constants'
import PropTypes from 'prop-types'

const EllipsesButton = ({ variant, color, size, ...rest }) => {
  if (variant && !THEMES.includes(variant)) variant = 'dark'
  return (
    <EllipsesButtonStyled variant={variant} color={color} size={size} {...rest}>
      ...
    </EllipsesButtonStyled>
  )
}

EllipsesButton.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
}

export default EllipsesButton