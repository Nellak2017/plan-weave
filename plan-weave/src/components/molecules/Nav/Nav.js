import React from 'react'
import {
	StyledNav,
	Logo,
	SiteTitle,
	LoginContainer,
	ContentContainer
} from './Nav.elements'
import { makeLink, defaultLogin } from './Nav.helpers'
import Button from '../../atoms/Button/Button.js'
import Image from 'next/image'
import logo from '../../../../public/Plan-Weave-Logo.png'
import { BsArrowRightShort } from 'react-icons/bs'

const defaultImage = ({
	image = logo,
	alt = 'Plan Weave Logo',
	width = 70, height = 56,
	title = 'Organize your tasks with Plan Weave',
	label = 'Organize your tasks with Plan Weave',
}) => (
	<Image
		src={image.src} //'/Plan-Weave-Logo.png'
		alt={alt}
		width={width}
		height={height}
		title={title}
		aria-label={label}
		priority={true}
	/>
)

const defaultAppLink = () => (makeLink({}))

const defaultMiddle = ({
	text = 'Plan Weave',
	link = '/plan-weave',
	title = 'Go to Plan Weave App',
	label = 'Go to Plan Weave App',
	handler,
	index = 2 }) => (
	<SiteTitle>
		{makeLink({ text, link, title, label, handler, index })}
	</SiteTitle>
)

const defaultSignUp = ({
	text = 'Sign up',
	title = 'Sign up',
	label = 'Sign up for Plan-Weave',
	handler,
	index = 5,
	Icon = BsArrowRightShort
}) => (
	<Button
		title={title}
		role={'link'}
		aria-label={label}
		onClick={handler || (() => { })}
		tabIndex={index}
	>
		<p>{text}</p>
		<Icon />
	</Button>
)

// TODO: Refactor this so that you can pass listeners to any of them easily
// TODO: Refactor this to handle any number of handlers and components (map through them instead of hard-coding)
// 		1 Logo, any amount of middle components, any amount of right components
// 		1 Logo listener, any amount of middle listeners, any amount of right listeners
function Nav({
	variant = 'dark',
	NavLogo = defaultImage,
	MiddleComponent = defaultMiddle,
	AppComponent = defaultAppLink,
	LoginComponent = defaultLogin,
	SignUpComponent = defaultSignUp,
	handleLogo,
	handleApp,
	handleLogIn,
	handleSignUp
}) {
	return (
		<StyledNav variant={variant}>
			<ContentContainer>
				<Logo className='logo' tabIndex={1} onClick={handleLogo}>
					<NavLogo />
				</Logo>

				<MiddleComponent handler={handleApp} />

				<LoginContainer>
					<AppComponent handler={handleApp} />
					<LoginComponent handler={handleLogIn} />
					<SignUpComponent handler={handleSignUp} />
				</LoginContainer>
			</ContentContainer>
		</StyledNav>
	)
}

export default Nav