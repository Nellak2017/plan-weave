import React from 'react'
import AuthForm from '../components/organisms/AuthForm/AuthForm.js'

function SignUp({ variant = 'dark', maxwidth = 409, signup = true }) {
	return (
		<AuthForm variant={variant} maxwidth={maxwidth} signup={signup} />
	)
}

export default SignUp