import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        primary: { main: '#815af1', },
    },
    components: {
        MuiButton: { styleOverrides: { root: ({ textTransform: 'none', }) } }
    },
    shape: {
        borderRadius: 8,
    },
    // Custom attributes
    insets: {
        normal: '1px 1px 5px rgba(1, 1, 0, 0.7) inset',
    },
})