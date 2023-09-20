import React, { useRef } from 'react'
import TaskInput from '../../atoms/TaskInput/TaskInput.js'
import { StyledAuthContainer } from './AuthForm.elements.js'

function AuthForm({ variant, maxwidth = 818 }) {
	// DO NOT STORE Form in Plain-text!
	const emailRef = useRef('')
	const passwordRef = useRef('')

	const handleSignInWithEmail = () => {
		const email = emailRef.current.value
		const password = passwordRef.current.value

		// Firebase email auth here
		// use Firebase Auth SDK to handle email/password
	}

	const handleSignInWithGoogle = () => {
		// Google Auth here
		// Firebase UI for Google Sign-in
	}

	return (
		<StyledAuthContainer maxwidth={409}>
			<h2>Sign In</h2>
			<div>
				<label htmlFor='email'>Email Address:</label>
				<TaskInput
					type='email'
					id='email'
					ref={emailRef}
					placeholder='email@example.com'
				/>
			</div>
			<div>
				<label htmlFor='password'>Password:</label>
				<TaskInput
					type='password'
					id='password'
					ref={passwordRef}
					placeholder='Enter your password'
				/>
			</div>
			<button onClick={handleSignInWithEmail}>Sign In with Email</button>
			<button onClick={handleSignInWithGoogle}>Sign In with Google</button>
		</StyledAuthContainer>
	)
}

export default AuthForm