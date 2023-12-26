import React, { useState } from 'react'
import { useRouter } from 'next/router'
import TaskInput from '../../atoms/TaskInput/TaskInput.js'
import Spinner from '../../atoms/Spinner/Spinner.js'
import Button from '../../atoms/Button/Button.js'
import GoogleButton from '../../atoms/GoogleButton/GoogleButton.js'
import {
	AuthContainer,
	StyledAuthForm,
	InputSection,
	SignInContainer,
	OrSeparator,
	Line,
	Or,
	CenteredContainer,
	SubtitleContainer
} from './AuthForm.elements.js'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../../../public/Plan-Weave-Logo.png'
import 'react-toastify/dist/ReactToastify.css'
import {
	handleHomePage,
	handleEmailChange,
	handlePasswordChange,
	handleSignInWithEmail,
	handleSignInWithGoogle
} from './AuthForm.handlers.js'
import PropTypes from 'prop-types'

function AuthForm({ variant = 'dark', maxwidth = 409, signup = false }) {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const emailServices = { setLoading, setEmail, setPassword }
	const emailState = { signup, router, email, password }
	const googleServices = { setLoading, setEmail, setPassword }
	const googleState = { router }

	if (loading) return (<Spinner />)

	return (
		<CenteredContainer>
			<AuthContainer variant={variant} maxwidth={maxwidth}>
				<StyledAuthForm id='email-form' variant={variant} maxwidth={maxwidth} onSubmit={e => handleSignInWithEmail(e, emailServices, emailState)} method='POST'>
					<Image
						src={logo.src} //'/Plan-Weave-Logo.png'
						alt='Plan Weave Logo'
						width={125}
						height={100}
						className={'logo'}
						title={'Go Home'}
						onClick={() => handleHomePage(router)}
						priority={true}
					/>
					<h2>{`Sign ${signup ? 'Up' : 'In'}`}</h2>
					<SubtitleContainer>
						<h3>
							<p>{`${signup ? "H" : "Don't h"}ave an account?`}</p>
						</h3>
						<Link href={`/${signup ? 'login' : 'signup'}`}>{`Sign ${signup ? 'in' : 'up'}.`}</Link>
					</SubtitleContainer>
					<InputSection>
						<label htmlFor='email'>Email Address</label>
						<TaskInput
							variant={variant}
							type='email'
							id='email'
							value={email}
							onChange={e => handleEmailChange(e, setEmail)}
							placeholder='email@example.com'
							autoComplete='username'
						/>
					</InputSection>
					<InputSection>
						<label htmlFor='password'>Password</label>
						<TaskInput
							variant={variant}
							type='password'
							id='password'
							value={password}
							onChange={e => handlePasswordChange(e, setPassword)}
							placeholder='Enter your password'
							autoComplete='current-password'
						/>
					</InputSection>
					<SignInContainer>
						<Button type='submit' name='email-auth' title={`Sign ${signup ? 'up' : 'in'} with Email`}>
							{`Sign ${signup ? 'up' : 'in'} with Email`}
						</Button>
					</SignInContainer>
				</StyledAuthForm>
				<OrSeparator>
					<Line />
					<Or>or</Or>
					<Line />
				</OrSeparator>
				<SignInContainer id='google-auth-container'>
					<GoogleButton name='google-auth' type='button' onClick={e => handleSignInWithGoogle(e, googleServices, googleState)} signup={signup} />
				</SignInContainer>
			</AuthContainer>
		</CenteredContainer>
	)
}

AuthForm.propTypes = {
	variant: PropTypes.string,
	maxwidth: PropTypes.number,
	signup: PropTypes.bool,
}

export default AuthForm