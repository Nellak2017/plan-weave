import React from 'react'
import AuthForm from '../components/organisms/AuthForm/AuthForm.js'

function Login({ variant = 'dark', maxwidth = 409, signup = false }) {
	return (
		<AuthForm variant={variant} maxwidth={maxwidth} signup={signup} />
	)
}

export default Login