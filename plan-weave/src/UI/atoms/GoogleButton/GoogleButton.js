import { StyledGoogleButton } from './GoogleButton.elements'
import Image from 'next/image'
import GoogleLogo from '../../../../public/google-logo.png'
export const GoogleButton = ({ signup = false, ...rest }) => (
	<StyledGoogleButton title={`Sign ${signup ? 'up' : 'in'} with Google`} {...rest} >
		<Image src={GoogleLogo.src} alt='Google Logo' width={18} height={18} />
		{`Sign ${signup ? 'up' : 'in'} with Google`}
	</StyledGoogleButton>
)
export default GoogleButton