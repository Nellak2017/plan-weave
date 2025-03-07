import { styled } from "@mui/material"

const navPresets = ({ theme, variant }) => ({
    light: {
        'h1, a': { color: theme.palette.grey[600], },
        '& .logo': { background: 'transparent', filter: 'invert(100%) brightness(0%)', },
        '& .logo:active': { filter: 'invert(100%) brightness(0%) invert(36%) sepia(80%) saturate(3178%) hue-rotate(238deg) brightness(99%) contrast(91%)', },
    },
    dark: {
        'h1, a': { color: theme.palette.lightNeutral[50], },
        '& .logo': { background: 'transparent', filter: 'invert(0%) brightness(100%)', }, // see also (convert black to any hex with filter): https://codepen.io/sosuke/pen/Pjoqqp
        '& .logo:active': { filter: 'invert(100%) brightness(0%) invert(36%) sepia(80%) saturate(3178%) hue - rotate(238deg) brightness(99%) contrast(91%)', },
    }
}?.[variant])
export const StyledNav = styled('nav')(({ theme, variant }) => ({
    margin: '0', padding: `0 ${theme.spacing(2)}`, position: 'sticky', top: '0', zIndex: '999',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: `${theme.palette.grey[300]}99`, boxShadow: theme.shadows[1],
    '*': { color: '#fff' }, ...navPresets({ theme, variant })
}))
export const Logo = styled('span')({ cursor: 'pointer' })
export const SiteTitle = styled('h1')(({ theme }) => ({ fontSize: theme.typography.h2.fontSize, a: { fontSize: theme.typography.h2.fontSize }, }))
export const LoginContainer = styled('span')(({ theme }) => ({
    display: 'flex', alignItems: 'center', height: '100%', columnGap: theme.spacing(3),
    a: { display: 'inline-flex', alignItems: 'center', height: '100%', fontSize: theme.spacing(3), },
    '& a:hover': { color: theme.palette.primary.main, cursor: 'pointer', borderBottom: `2px solid ${theme.palette.primary.main}`, },
    button: {
        display: 'flex', alignItems: 'center',
        p: { fontSize: theme.typography.h4.fontSize }, svg: { fontSize: theme.typography.h3.fontSize },
        'svg:hover': { boxShadow: theme.shadows[0] }
    },
    '.sign-up:hover': { borderBottom: `0px solid transparent`, },
}))
export const ContentContainer = styled('section')(({ theme }) => ({
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', columnGap: theme.spacing(2),
    maxWidth: '1290px', width: '100%', height: '100%',
})) // This is to make the spacing proper even for large desktops