import { styled } from "@mui/material"

// TODO: Make correctly with theme
const variantStyles = ({ bg, color, border }) => ({
  backgroundColor: bg, color, border: `1px solid ${border}60`,
  'input': {
    padding: `0 0 0 4px`, // props.theme.spaces.smaller
    fontSize: '14px', // props.theme.fontSizes.medium
    border: 'none', background: 'none', outline: 'none', boxShadow: 'none', '&:hover': { background: 'none' },
    borderRadius: 0, width: '80%',
    color: `${color}60`,
    '&::placeholder': { color: `${color}60` },
    '&:hover,&:focus,&:active': { color, '&::placeholder': { color }, },
    '&:active,&:focus': { '&::placeholder': { color: `${color}00` } },
    '&:focus ~svg, &:hover ~svg': { color },
  }
})
const searchBarPreSets = variant => ({
  light: variantStyles({ bg: '#eeedee', color: '#39313a', border: '#504651' }),
  dark: variantStyles({ bg: '#504651', color: '#eeedee', border: '#eeedee' }),
}?.[variant])

export const SearchBarStyled = styled('div')(({ theme, variant, maxwidth }) => ({
  display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse',
  borderRadius: '22px', maxWidth: `${maxwidth}px`,
  padding: `0px 0px 0px 8px`, // props.theme.spaces.small
  '&:hover': { boxShadow: theme.shadows[4], border: `1px solid ${theme.palette.primary.main}`, },
  'svg': { padding: 0, color: '#979797', },
  ...searchBarPreSets(variant)
}))