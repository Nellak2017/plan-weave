import React from 'react'
import AuthForm from '../components/organisms/AuthForm/AuthForm.js'
import { VARIANTS } from '../components/utils/constants.js'
import PropTypes from 'prop-types'

function SignUp({ variant = VARIANTS[0], maxwidth = 409, signup = true }) {
	return (
		<AuthForm variant={variant} maxwidth={maxwidth} signup={signup} />
	)
}

SignUp.propTypes = {
	variant: PropTypes.oneOf(VARIANTS),
	maxwidth: PropTypes.number,
	signup: PropTypes.bool,
}

export default SignUp