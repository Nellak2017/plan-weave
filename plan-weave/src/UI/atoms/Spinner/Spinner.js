import { InfinitySpin } from 'react-loader-spinner'
import { SpinnerContainer } from './Spinner.elements'
const Spinner = ({ width = 200, color }) => (<SpinnerContainer color={color}><InfinitySpin width={width} /></SpinnerContainer>)
export default Spinner