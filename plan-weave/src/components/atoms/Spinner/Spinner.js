import { InfinitySpin } from 'react-loader-spinner'
import { SpinnerContainer } from './Spinner.elements'

function Spinner({ width = 200 , color}) {
	return (
		<SpinnerContainer color={color}>
			<InfinitySpin width={width}/>
		</SpinnerContainer>
	)
}

export default Spinner