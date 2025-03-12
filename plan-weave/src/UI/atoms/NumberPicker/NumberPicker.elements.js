import { styled } from "@mui/system"

export const PickerContainer = styled('section')(({ theme }) => ({ display: 'flex', columnGap: theme.spacing(2), alignItems: 'center', p: { color: theme.palette.text.primary } }))
export const DropdownWrapper = styled('div')({ position: 'relative', display: 'inline-block', })