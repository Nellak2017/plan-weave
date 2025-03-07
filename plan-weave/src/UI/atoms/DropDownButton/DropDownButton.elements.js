import { Button, styled } from "@mui/material"

export const DropDownButtonStyled = styled(Button)(({ theme }) => ({
  position: 'relative', padding: theme.spacing(1),
  display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', columnGap: '10px',
  maxHeight: '32px', maxWidth: '150px',
  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', /* Apply ellipsis for text overflow */
}))
export const DropdownContainer = styled('div')({ position: 'relative', display: 'inline-block' })
export const DropdownMenu = styled('ul')(({ open }) => ({ position: 'absolute', width: '100%', top: '100%', left: '0', display: `${open ? 'block' : 'none'}`, zIndex: '999',}))
export const DropdownMenuItem = styled('li')(({ theme }) => ({ // NOTE: lightNeutral may have @performance issue if re-computing every render
  cursor: 'pointer', height: '2rem', backgroundColor: theme.palette.lightNeutral[100], color: 'black',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  '&:hover': { backgroundColor: theme.palette.lightNeutral[200] }, '&:active': { backgroundColor: theme.palette.lightNeutral[300] }
}))