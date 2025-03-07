import { Button, styled } from "@mui/material"

export const DropDownButtonStyled = styled(Button)(({ theme }) => ({
  position: 'relative', padding: theme.spacing(1),
  display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', columnGap: '10px',
  maxHeight: theme.spacing(4), maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', /* Apply ellipsis for text overflow */
}))
export const DropdownContainer = styled('div')({ position: 'relative', display: 'inline-block' })
export const DropdownMenu = styled('ul')(({ open }) => ({ position: 'absolute', width: '100%', top: '100%', left: '0', display: `${open ? 'block' : 'none'}`, zIndex: '999',}))
export const DropdownMenuItem = styled('li')(({ theme }) => ({
  cursor: 'pointer', height: '2rem', backgroundColor: theme.palette.grey[100], color: 'black',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  '&:hover': { backgroundColor: theme.palette.grey[200] }, '&:active': { backgroundColor: theme.palette.grey[300] }
}))