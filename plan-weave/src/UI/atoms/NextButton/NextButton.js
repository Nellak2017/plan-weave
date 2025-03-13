import { NextButtonStyled } from './NextButton.elements'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

const NextButton = ({ variant, children, ...rest }) => {
	const label = variant === 'left' ? 'Previous' : 'Next'
	return (
		<NextButtonStyled variant={variant} aria-label={label} title={label} {...rest}>
			{variant === 'left' ? <BiChevronLeft size={32} /> : <BiChevronRight size={32} />}
		</NextButtonStyled>
	)
}
export default NextButton