import { NextButtonStyled } from './NextButton.elements'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import theme from '../../../styles/theme.js'
import PropTypes from 'prop-types'

const calculateSize = sizePx => parseFloat(sizePx.match(/\d+/)[0])
const letterToSize = (sizeChar = 'l') => calculateSize({
	'xs': theme.spaces.smaller,
	's': theme.spaces.small,
	'm': theme.spaces.medium, // 16px
	'l': theme.spaces.large, // 32px
	'xl': theme.spaces.larger,
	'xxl': theme.spaces.extraLarge,
}[sizeChar] || '32px')

const NextButton = ({ variant, size, color, children, ...rest }) => (
	<NextButtonStyled variant={variant} size={typeof size != 'string' ? 'l' : size} color={color} {...rest}>
		{variant === 'left' ? <BiChevronLeft size={letterToSize(size)} /> : <BiChevronRight size={letterToSize(size)} />}
	</NextButtonStyled>
)
NextButton.propTypes = { variant: PropTypes.string, size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), color: PropTypes.string, children: PropTypes.node,}
export default NextButton