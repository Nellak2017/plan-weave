import { EllipsesButtonStyled } from './EllipsesButton.elements'
import { THEMES, VARIANTS } from '../../utils/constants'
import PropTypes from 'prop-types'

const EllipsesButton = ({ variant = VARIANTS[0], color, size, ...rest }) => {
  const processedVariant = (variant && !THEMES.includes(variant)) ? VARIANTS[0] : variant
  return (
    <EllipsesButtonStyled variant={processedVariant} color={color} size={size} {...rest}>
      ...
    </EllipsesButtonStyled>
  )
}

EllipsesButton.propTypes = {
  variant: PropTypes.oneOf(VARIANTS),
  color: PropTypes.string,
  size: PropTypes.string,
}

export default EllipsesButton