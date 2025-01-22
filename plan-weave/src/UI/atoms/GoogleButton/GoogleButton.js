import React from 'react'
import { StyledGoogleButton } from './GoogleButton.elements'
import Image from 'next/image'
import GoogleLogo from '../../../../public/google-logo.png'
function GoogleButton({ signup = false, ...rest }) {
	return (
		<StyledGoogleButton
			title={`Sign ${signup ? 'up' : 'in'} with Google`}
			{...rest}
		>
			<Image
				src={GoogleLogo.src} //'/google-logo.png'
				alt='Google Logo'
				width={18}
				height={18}
			//priority={true}
			/>
			{`Sign ${signup ? 'up' : 'in'} with Google`}
		</StyledGoogleButton>
	)
}
export default GoogleButton