import { styled } from "@mui/material"

export const SearchBarStyled = styled('div')(({ theme, maxwidth }) => ({
  display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse',
  borderRadius: theme.typography.h3.fontSize, maxWidth: `${maxwidth}px`,
  padding: `0px 0px 0px ${theme.spacing(2)}`,
  '&:hover': { boxShadow: theme.shadows[4], border: `1px solid ${theme.palette.primary.main}`, },
  'svg': { padding: 0, color: '#979797', }, // grey 200 is too light on light theme, so we use this one which is in between 200 and 300
  backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, border: `1px solid ${theme.palette.divider}`,
  input: {
    padding: `0 0 0 ${theme.spacing(1)}`, borderRadius: 0, width: '80%', color: `${theme.palette.text.primary}60`,
    fontSize: theme.typography.body1.fontSize, border: 'none', background: 'none', outline: 'none', boxShadow: 'none',
    '&:hover': { background: 'none' }, '&::placeholder': { color: `${theme.palette.text.primary}60` },
    '&:hover,&:focus,&:active': { color: theme.palette.text.primary, '&::placeholder': { color: theme.palette.text.primary }, },
    '&:focus ~svg, &:hover ~svg': { color: theme.palette.text.primary },
  }
}))