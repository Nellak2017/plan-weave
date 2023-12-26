import { InfinitySpin } from 'react-loader-spinner'
import { SpinnerContainer } from './Spinner.elements'
import PropTypes from 'prop-types'

function Spinner({ width = 200 , color}) {
	return (
		<SpinnerContainer color={color}>
			<InfinitySpin width={width}/>
		</SpinnerContainer>
	)
}

Spinner.propTypes = {
	width: PropTypes.number,
	color: PropTypes.string,
}

export default Spinner