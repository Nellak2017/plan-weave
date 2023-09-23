import React from 'react'
import {
	StyledNav,
	Logo,
	LoginContainer
} from './Nav.elements'
import Button from '../../atoms/Button/Button.js'
import Image from 'next/image'
import logo from '../../../../public/Plan-Weave-Logo.png'
import { BsArrowRightShort } from 'react-icons/bs'

function Nav({ variant = 'dark' }) {
	return (
		<StyledNav>
			<Logo>
				<Image
					src={logo.src} //'/Plan-Weave-Logo.png'
					alt='Plan Weave Logo'
					width={55}
					height={44}
					className={'logo'}
					title={'Organize your tasks with Plan Weave'}
					priority={true}
				/>
			</Logo>

			<LoginContainer>
				<p>Log in</p>
				<Button>
					<p>Get Started</p>
					<BsArrowRightShort />
				</Button>
			</LoginContainer>
		</StyledNav>
	)
}

export default Nav