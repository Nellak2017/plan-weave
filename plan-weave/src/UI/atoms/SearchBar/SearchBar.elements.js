import { styled } from "@mui/material"

const variantStyles = ({ theme, bg, color, border }) => ({
  backgroundColor: bg, color, border: `1px solid ${border}60`,
  'input': { // h4.fontSize = medium font
    padding: `0 0 0 ${theme.spacing(1)}`, borderRadius: 0, width: '80%', color: `${color}60`,
    fontSize: theme.typography.h4.fontSize, border: 'none', background: 'none', outline: 'none', boxShadow: 'none',
    '&:hover': { background: 'none' },
    '&::placeholder': { color: `${color}60` },
    '&:hover,&:focus,&:active': { color, '&::placeholder': { color }, },
    '&:active,&:focus': { '&::placeholder': { color: `${color}00` } },
    '&:focus ~svg, &:hover ~svg': { color },
  }
})
const searchBarPreSets = ({ theme, variant }) => ({
  light: variantStyles({ theme, bg: '#eeedee', color: '#39313a', border: '#504651' }),
  dark: variantStyles({ theme, bg: '#504651', color: '#eeedee', border: '#eeedee' }),
}?.[variant])

export const SearchBarStyled = styled('div')(({ theme, variant, maxwidth }) => ({
  display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse',
  borderRadius: '22px', maxWidth: `${maxwidth}px`,
  padding: `0px 0px 0px ${theme.spacing(2)}`,
  '&:hover': { boxShadow: theme.shadows[4], border: `1px solid ${theme.palette.primary.main}`, },
  'svg': { padding: 0, color: '#979797', },
  ...searchBarPreSets({ theme, variant })
}))