import { DropDownButtonStyled, DropdownContainer, DropdownMenu, DropdownMenuItem } from './DropDownButton.elements'
import { Button } from '../Button/Button.js'
import { AiFillCaretDown } from 'react-icons/ai'
import { useState } from 'react'

// TODO: Refactor DropDownButtonStyled to MUI Button using Emotion
function DropDownButton({ size = 's', color = 'primary', options, children = 'Auto Sort', tabIndex, ...rest }) {
  const [isOpen, setIsOpen] = useState(false) // Only used because it is truly isolated. If other components need to alter this then raise to redux
  const handleToggle = () => { setIsOpen(!isOpen) }
  const handleOptionClick = (e, listener) => {
    if (listener) { listener(e) } // Call the event listener provided for the clicked option
    setIsOpen(false) // Close the dropdown menu
  }
  return (
    <DropdownContainer tabIndex={tabIndex} onKeyDown={e => { if (e.key === 'Enter') { handleToggle() } }}>
      <DropDownButtonStyled onClick={handleToggle}  {...rest} onBlur={() => setIsOpen(false)}>
        {children}
        <AiFillCaretDown />
      </DropDownButtonStyled>
      <DropdownMenu open={isOpen}>
        {options?.map((option, index) => (
          <DropdownMenuItem key={option?.name || `unique: ${index}`} onMouseDown={e => handleOptionClick(e, option?.listener)}>
            {option?.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  )
}
export default DropDownButton