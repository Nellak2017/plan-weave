import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        primary: { main: '#815af1', },
    },
    shape: { borderRadius: 8, },
    // Custom component overrides
    components: {
        MuiButton: {
            styleOverrides: { root: ({ textTransform: 'none', minWidth: '85px', color: '#fff'}) },
            variants: [
                {
                    props: { variant: 'newTask' },
                    style: ({ theme }) => ({ backgroundColor: theme.palette.success.dark, '&:hover': { backgroundColor: theme.palette.success.main }, '&:active': { backgroundColor: theme.palette.success.light }, }),
                },
                {
                    props: { variant: 'delete' },
                    style: ({ theme }) => ({ backgroundColor: theme.palette.error.main, '&:hover': { backgroundColor: theme.palette.error.dark }, '&:active': { backgroundColor: theme.palette.error.light }, }),
                },
            ],
            defaultProps: { variant: 'contained', },
        },
    },
    // Custom attributes
    insets: {
        normal: '1px 1px 5px rgba(1, 1, 0, 0.7) inset',
    },
})