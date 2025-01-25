import { DropDownButtonStyled, DropdownContainer, DropdownMenu, DropdownMenuItem } from './DropDownButton.elements'
import { AiFillCaretDown } from 'react-icons/ai'
import { useState } from 'react'

const DropDownButton = ({ options, children = 'Auto Sort', ...rest }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = () => setIsOpen(!isOpen)
  const handleOptionClick = (e, listener) => {
    if (listener) listener(e) // Call the event listener provided for the clicked option
    setIsOpen(false) // Close the dropdown menu
  }
  return (
    <DropdownContainer onKeyDown={e => { if (e.key === 'Enter') { handleToggle() } }} {...rest}>
      <DropDownButtonStyled onClick={handleToggle} onBlur={() => setIsOpen(false)} {...rest}>
        {children}<AiFillCaretDown />
      </DropDownButtonStyled>
      <DropdownMenu open={isOpen}>
        {options?.map(option => (
          <DropdownMenuItem key={option?.name} onMouseDown={e => handleOptionClick(e, option?.listener)}>
            {option?.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  )
}
export default DropDownButton