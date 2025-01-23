import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        primary: { main: '#815af1',},
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: ({ theme }) => ({ textTransform: 'none', borderRadius: theme.spacing(1),})
            }
        }
    }
})