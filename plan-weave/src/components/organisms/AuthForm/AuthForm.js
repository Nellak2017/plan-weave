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
import {
	signInWithEmail,
	signUpWithEmail,
	signInWithGoogle
} from '../../../../firebase/firebase_auth.js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function AuthForm({ variant = 'dark', maxwidth = 409, signup = false }) {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const handleHomePage = () => router.push('/')
	const handleEmailChange = e => setEmail(e.target.value)
	const handlePasswordChange = e => setPassword(e.target.value)

	const handleSignInWithEmail = async e => {
		e.preventDefault()
		setLoading(true)
		console.log('sign-in with email pressed')

		// Firebase email auth here
		try {
			signup ? await signUpWithEmail(email, password) : await signInWithEmail(email, password) // you can assign to variable to use
			router.push('/plan-weave')
		} catch (e) {
			console.error(e.message)
			toast.error(e.message.replace("FirebaseError: Firebase: ", ""), { autoClose: 5000 })
		} finally {
			setEmail('')
			setPassword('')
			setLoading(false)
		}
	}

	const handleSignInWithGoogle = async e => {
		e.preventDefault()
		setLoading(true)
		console.log('sign-in with google pressed')

		// Google Auth here
		try {
			await signInWithGoogle() // you can assign to variable to use
			router.push('/plan-weave')
		} catch (e) {
			console.error(e.message)
			toast.error('Error Logging In With Google Auth', { autoClose: 5000 })
		} finally {
			setEmail('')
			setPassword('')
			setLoading(false)
		}
	}

	if (loading) return (<Spinner />)

	return (
		<CenteredContainer>
			<AuthContainer variant={variant} maxwidth={maxwidth}>
				<StyledAuthForm id='email-form' variant={variant} maxwidth={maxwidth} onSubmit={handleSignInWithEmail} method='POST'>
					<Image
						src={logo.src} //'/Plan-Weave-Logo.png'
						alt='Plan Weave Logo'
						width={125}
						height={100}
						className={'logo'}
						title={'Go Home'}
						onClick={handleHomePage}
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
							onChange={handleEmailChange}
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
							onChange={handlePasswordChange}
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
					<GoogleButton name='google-auth' type='button' onClick={handleSignInWithGoogle} signup={signup} />
				</SignInContainer>
			</AuthContainer>
		</CenteredContainer>
	)
}

export default AuthForm