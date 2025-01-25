import { InfinitySpin } from 'react-loader-spinner'
import { Box } from '@mui/material'
const sx = color => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',width: '100%',height: '100vh',
    '& path': { stroke: color || (theme => theme.palette.primary.main),}
})
export const Spinner = ({ width = 200, color }) => (<Box sx={sx(color)}><InfinitySpin width={width} /></Box>)
export default Spinner