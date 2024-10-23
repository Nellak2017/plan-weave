import { InfinitySpin } from 'react-loader-spinner'
import { SpinnerContainer } from './Spinner.elements'
import PropTypes from 'prop-types'

const Spinner = ({ width = 200, color }) => (<SpinnerContainer color={color}><InfinitySpin width={width} /></SpinnerContainer>)
Spinner.propTypes = { width: PropTypes.number, color: PropTypes.string }
export default Spinner