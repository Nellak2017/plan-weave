import { DropDownButtonStyled } from './DropDownButton.elements'
import { AiFillCaretDown } from 'react-icons/ai'

function DropDownButton (props) {
  const { size = 's', color = 'lightNeutral', children, ...rest } = props
  return (
    <DropDownButtonStyled size={size} color={color} {...rest}>
	  {children}
	  <AiFillCaretDown />
    </DropDownButtonStyled>
  )
}

export default DropDownButton