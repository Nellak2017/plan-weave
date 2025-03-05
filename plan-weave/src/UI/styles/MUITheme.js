import { createTheme } from '@mui/material/styles'
import chroma from 'chroma-js'

// TODO: Add fontFamily: Poppins to typography possibly
export const theme = createTheme({
    palette: {
        // light and dark are auto generated for the main color palette attributes. Hover and Active are manually entered to accomodate custom html elements that are not MUI imported.
        primary: { main: '#815af1', primaryHover: '#6031ed', primaryActive: '#2f0d96', primaryLightHover: '#e2d9fc', primaryLightActive: '#b7a1f7', primaryDarkHover: '#1e085e', primaryDarkActive: '#120538', darker: '#060213', },
        grey: { 50: '#ebeaeb', 100: '#e1e0e1', 200: '#c2bfc2', 300: '#39313a', 400: '#332c34', 500: '#2e272e', 600: '#2b252c', 700: '#221d23', 800: '#1a161a', 900: '#141114', }, // dark neutral colors
        error: { main: '#d64444', errorHover: '#c13d3d', errorActive: '#ab3636', errorLightHover: '#f9becec', errorLightActive: '#f2c5c5', errorDarkHover: '#802929', errorDarkActive: '#601f1f', darker: '#4b1818', },
        success: { main: '#80de71', successHover: '#73c866', successActive: '#66b25a', successLightHover: '#f2fcf1', successLightActive: '#d8f5d3', successDarkHover: '#4d8544', successDarkActive: '#3a6433', darker: '#2d4e28', },
        warning: { main: '#e8bb79', warningHover: '#d1a86d', warningActive: '#ba9661', warningLightHover: '#fcf5eb', warningLightActive: '#d8ead5', warningDarkHover: '#8b7049', warningDarkActive: '#685436', darker: '#51412a', },
        // Custom palette attributes
        statusColors: { completed: '#80de71', incomplete: 'transparent', waiting: '#e8bb79', inconsistent: '#d64444', },
        lightNeutral: ({ theme, value }) => chroma(theme?.palette.grey?.[value] || '#ebeaeb').brighten(.5).hex(), // light neutral is dark neutral but lightened up a bit
    },
    spacing: num => ['4px', '8px', '16px', '32px', '48px', '56px',]?.[num - 1] || '4px',
    shape: { borderRadius: 8, },
    typography: { caption: { fontSize: '10px' }, h6: { fontSize: '12px' }, h5: { fontSize: '14px' }, h4: { fontSize: '16px' }, h3: { fontSize: '24px' }, h2: { fontSize: '40px' }, h1: { fontSize: '64px' }, body1: { fontSize: '16px' }, body2: { fontSize: '14px' }, },
    // --- Custom attributes and component overrides
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
})