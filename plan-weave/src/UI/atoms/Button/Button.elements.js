import { Button as MUIButton } from '@mui/material'
import { styled } from '@mui/material/styles'
export const ButtonStyled = styled(MUIButton)(({ theme, variantprop }) => {
    const styles = {
        newTask: {
            backgroundColor: theme.palette.success.dark,
            '&:hover': { backgroundColor: theme.palette.success.main },
            '&:active': { backgroundColor: theme.palette.success.light },
        },
        delete: {
            backgroundColor: theme.palette.error.main,
            '&:hover': { backgroundColor: theme.palette.error.dark },
            '&:active': { backgroundColor: theme.palette.error.light },
        },
    }
    return { textTransform: 'none', borderRadius: theme.spacing(1), minWidth: '85px', ...styles?.[variantprop], }
})