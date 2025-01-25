import { Button } from '../Button/Button.js'
import { styled } from '@mui/material'

export const DropDownButtonStyled = styled(Button)(({ theme }) => ({
  position: 'relative', padding: theme.spacing(1),
  display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', columnGap: '10px',
  maxHeight: '32px', maxWidth: '150px',
  /* Apply ellipsis for text overflow */
  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
}))
export const DropdownContainer = styled('div')({ position: 'relative', display: 'inline-block' })
export const DropdownMenu = styled('ul')(({ open }) => ({
  position: 'absolute', width: '100%', top: '100%', left: '0',
  display: `${open ? 'block' : 'none'}`, zIndex: '999',
}))
// TODO: Fix not using theme issues
export const DropdownMenuItem = styled('li')(({ theme, open }) => ({
  display: `${open ? 'block' : 'none'}`,
  cursor: 'pointer', height: '2rem', backgroundColor: 'white', color: 'black',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  '&:hover': { backgroundColor: 'gray' }, '&:active': { backgroundColor: 'gray' }
}))