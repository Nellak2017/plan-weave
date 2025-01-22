import { useState } from 'react'
import { useRouter } from 'next/router'
import TaskInput from '../../atoms/TaskInput/TaskInput.js'
import Spinner from '../../atoms/Spinner/Spinner.js'
import Button from '../../atoms/Button/Button.js'
import GoogleButton from '../../atoms/GoogleButton/GoogleButton.js'
import { AuthContainer, StyledAuthForm, InputSection, SignInContainer, OrSeparator, Line, Or, CenteredContainer, SubtitleContainer } from './AuthForm.elements.js'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../../../public/Plan-Weave-Logo.png'
import 'react-toastify/dist/ReactToastify.css'
import { handleHomePage, handleEmailChange, handlePasswordChange, handleSignInWithEmail, handleSignInWithGoogle } from './AuthForm.handlers.js'
import { VARIANTS } from '../../../Core/utils/constants.js'

function AuthForm({ variant = VARIANTS[0], state = { maxwidth: 409, signup: false } }) {
	const { maxwidth, signup } = state
	const processedMaxWidth = maxwidth || 409
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const emailServices = { setLoading, setEmail, setPassword }
	const emailState = { signup, router, email, password }
	const googleServices = { setLoading, setEmail, setPassword }
	const googleState = { router }
	const upIn = `${signup ? 'up' : 'in'}`
	const inUp = `${signup ? 'in' : 'up'}`
	const signUpInEmail = `Sign ${upIn} with Email`
	const haveDontHave = `${signup ? "H" : "Don't h"}`
	const loginOrSignUp = `${signup ? 'login' : 'signup'}`
	if (loading) return (<Spinner />)
	return (
		<CenteredContainer>
			<AuthContainer variant={variant} maxwidth={processedMaxWidth}>
				<StyledAuthForm id='email-form' variant={variant} maxwidth={processedMaxWidth} onSubmit={e => handleSignInWithEmail(e, emailServices, emailState)} method='POST'>
					<Image src={logo.src} alt='Plan Weave Logo' width={128} height={96} className={'logo'} title={'Go Home'} priority={true} onClick={() => handleHomePage(router)} />
					<h2>{`Sign ${upIn}`}</h2>
					<SubtitleContainer>
						<h3><p>{`${haveDontHave}ave an account?`}</p></h3>
						<Link href={`/${loginOrSignUp}`}>{`Sign ${inUp}.`}</Link>
					</SubtitleContainer>
					<InputSection>
						<label htmlFor='email'>Email Address</label>
						<TaskInput variant={variant} type='email' id='email' value={email} onChange={e => handleEmailChange(e, setEmail)} placeholder='email@example.com' autoComplete='username' />
					</InputSection>
					<InputSection>
						<label htmlFor='password'>Password</label>
						<TaskInput variant={variant} type='password' id='password' value={password} placeholder='Enter your password' autoComplete='current-password' onChange={e => handlePasswordChange(e, setPassword)} />
					</InputSection>
					<SignInContainer>
						<Button type='submit' name='email-auth' title={signUpInEmail}> {signUpInEmail}</Button>
					</SignInContainer>
				</StyledAuthForm>
				<OrSeparator><Line /><Or>or</Or><Line /></OrSeparator>
				<SignInContainer id='google-auth-container'>
					<GoogleButton name='google-auth' type='button' onClick={e => handleSignInWithGoogle(e, googleServices, googleState)} signup={signup} />
				</SignInContainer>
			</AuthContainer>
		</CenteredContainer>
	)
}
export default AuthForm