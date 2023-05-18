import {
  DropDownButtonStyled,
  DropdownContainer,
  DropdownMenu,
  DropdownMenuItem
} from './DropDownButton.elements'
import { AiFillCaretDown } from 'react-icons/ai'
import { useState } from 'react'

function DropDownButton(props) {
  const { size = 's', color = 'lightNeutral', options, children, ...rest } = props
  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = () => { setIsOpen(!isOpen) }
  const handleOptionClick = (e, listener) => {
    // Call the event listener provided for the clicked option
    if (listener) { listener(e) }
    setIsOpen(false) // Close the dropdown menu
  }
  return (
    <DropdownContainer>
      <DropDownButtonStyled
        onClick={handleToggle}
        size={size}
        color={color} {...rest}>
        {children}
        <AiFillCaretDown />
      </DropDownButtonStyled>
      <DropdownMenu open={isOpen}>
        {options.map((option, index) => (
          <DropdownMenuItem
            key={index}
            onClick={e => handleOptionClick(e, option?.listener)}>
            {option?.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  )
}

export default DropDownButton