import { NextButtonStyled } from './NextButton.elements'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

const NextButton = ({ variant, children, ...rest }) => ( // hard-coded size since it never changes
	<NextButtonStyled variant={variant} aria-label={variant === 'left' ? 'previous' : 'next'} {...rest}>
		{variant === 'left' ? <BiChevronLeft size={32} /> : <BiChevronRight size={32} />}
	</NextButtonStyled>
)
export default NextButton