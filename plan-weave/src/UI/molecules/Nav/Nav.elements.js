import { styled } from "@mui/material"

const navPresets = ({ theme, variant }) => ({
    light: {
        'h1, a': { color: `#2b252c`, }, // props => props.theme.colors.darkNeutralDark
        '& .logo': { background: 'transparent', filter: 'invert(100%) brightness(0%)', },
        '& .logo:active': { filter: 'invert(100%) brightness(0%) invert(36%) sepia(80%) saturate(3178%) hue-rotate(238deg) brightness(99%) contrast(91%)', },
    },
    dark: {
        'h1, a': { color: `#eeedee`, }, // props => props.theme.colors.lightNeutralLight
        '& .logo': { background: 'transparent', filter: 'invert(0%) brightness(100%)', }, // see also (convert black to any hex with filter): https://codepen.io/sosuke/pen/Pjoqqp
        '& .logo:active': { filter: 'invert(100%) brightness(0%) invert(36%) sepia(80%) saturate(3178%) hue - rotate(238deg) brightness(99%) contrast(91%)', },
    }
}?.[variant])
export const StyledNav = styled('nav')(({ theme, variant }) => ({
    margin: '0',
    padding: `0 8px`, // props.theme.spaces.small
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'sticky', top: '0', zIndex: '999',
    backgroundColor: `#39313a99`, // props.theme.colors.darkNeutral
    boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
    '*': { color: '#fff' },
    ...navPresets({ theme, variant })
}))
export const Logo = styled('span')({ cursor: 'pointer' })
export const SiteTitle = styled('h1')(({ theme }) => ({
    fontSize: `40px`, // props.theme.fontSizes.larger
    a: { fontSize: `40px` }, // props.theme.fontSizes.larger
}))
export const LoginContainer = styled('span')(({ theme }) => ({
    display: 'flex', alignItems: 'center', height: '100%',
    columnGap: '16px', // props.theme.spaces.medium
    a: {
        display: 'inline-flex', alignItems: 'center', height: '100%',
        fontSize: '16px', // props.theme.spaces.medium
    },
    '& a:hover': { color: theme.palette.primary.main, cursor: 'pointer', borderBottom: `2px solid ${theme.palette.primary.main}`, },
    button: {
        display: 'flex', alignItems: 'center',
        p: { fontSize: `16px` }, // props.theme.fontSizes.medium
        svg: { fontSize: `24px` }, // props.theme.fontSizes.large
		'svg:hover': { boxShadow: 'none'}
    },
	'.sign-up:hover': { borderBottom: `0px solid transparent`,},
}))
export const ContentContainer = styled('section')(({ theme }) => ({
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly',
    columnGap: `8px`, // props.theme.spaces.small
    maxWidth: '1290px', width: '100%', height: '100%',
})) // This is to make the spacing proper even for large desktops