import React from 'react'
import AuthForm from '../components/organisms/AuthForm/AuthForm.js'
import PropTypes from 'prop-types'

function SignUp({ variant = 'dark', maxwidth = 409, signup = true }) {
	return (
		<AuthForm variant={variant} maxwidth={maxwidth} signup={signup} />
	)
}

SignUp.propTypes = {
	variant: PropTypes.string,
	maxwidth: PropTypes.number,
	signup: PropTypes.bool,
}

SignUp.defaultProps = {
	variant: 'dark',
	maxwidth: 409,
	signup: true,
}

export default SignUp