import { createTheme } from '@mui/material/styles'

// TODO: Add fontFamily: Poppins to typography possibly
// TODO: After making all styles theme agnostic, start to remove variant prop except for special cases. The components should style based only on the theme in the context provided not a variant!
// TODO: Fix the ugly ass select button, possibly using MUI built-ins
// Custom Properties: insets, logoFilter, paperBackground
const baseTheme = {
    spacing: num => ['4px', '8px', '16px', '32px', '48px', '56px',]?.[num - 1] || '4px',
    shape: { borderRadius: 8, },
    typography: { caption: { fontSize: '10px' }, h6: { fontSize: '12px' }, h5: { fontSize: '14px' }, h4: { fontSize: '16px' }, h3: { fontSize: '24px' }, h2: { fontSize: '40px' }, h1: { fontSize: '64px' }, body1: { fontSize: '16px' }, body2: { fontSize: '14px' }, },
    insets: { normal: '1px 1px 5px rgba(1, 1, 0, 0.7) inset', },
    components: {
        MuiButton: {
            styleOverrides: { root: ({ theme }) => ({ textTransform: 'none', minWidth: '85px', color: '#fff', backgroundColor: theme.palette.primary.main }) },
            variants: [
                { props: { variant: 'newTask' }, style: ({ theme }) => ({ backgroundColor: theme.palette.success.dark, '&:hover': { backgroundColor: theme.palette.success.main }, '&:active': { backgroundColor: theme.palette.success.light }, }), },
                { props: { variant: 'delete' }, style: ({ theme }) => ({ backgroundColor: theme.palette.error.main, '&:hover': { backgroundColor: theme.palette.error.dark }, '&:active': { backgroundColor: theme.palette.error.light }, }), },
            ],
            defaultProps: { variant: 'contained', },
        },
    },
}
const sharedPalette = {
    primary: { main: '#815af1', }, error: { main: '#d64444', }, success: { main: '#80de71', }, warning: { main: '#e8bb79', },
    grey: { 50: '#ebeaeb', 100: '#e1e0e1', 200: '#c2bfc2', 300: '#39313a', 400: '#332c34', 500: '#2e272e', 600: '#2b252c', 700: '#221d23', 800: '#1a161a', 900: '#141114', },
}
export const lightTheme = createTheme({
    palette: { mode: 'light', background: { default: '#fff', paper: '#fff', paperBackground: '#ebeaeb' }, ...sharedPalette, },
    ...baseTheme, logoFilter: 'invert(100%) brightness(0%)', /* Used for logo filter in Nav styles */
})
export const theme = createTheme({ // AKA: Dark Theme
    palette: { mode: 'dark', background: { default: '#39313a', paper: '#504651', paperBackground: '#302A31' }, ...sharedPalette, },
    ...baseTheme, logoFilter: 'invert(0%) brightness(100%)', /* see also (convert black to any hex with filter): https://codepen.io/sosuke/pen/Pjoqqp */
})