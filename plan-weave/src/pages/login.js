import React from 'react'
import AuthForm from '../components/organisms/AuthForm/AuthForm.js'
import PropTypes from 'prop-types'

function Login({ variant = 'dark', maxwidth = 409, signup = false }) {
	return (
		<AuthForm variant={variant} maxwidth={maxwidth} signup={signup} />
	)
}
Login.propTypes = {
	variant: PropTypes.string,
	maxwidth: PropTypes.number,
	signup: PropTypes.bool,
}

Login.defaultProps = {
	variant: 'dark',
	maxwidth: 409,
	signup: false,
}

export default Login