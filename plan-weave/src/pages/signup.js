import React from 'react'
import AuthForm from '../UI/organisms/AuthForm/AuthForm.js'
import { VARIANTS } from '../UI/utils/constants.js'
import PropTypes from 'prop-types'

function SignUp({ variant = VARIANTS[0], state = { maxwidth: 409, signup: true } }) {
	return (
		<AuthForm variant={variant} state={state} />
	)
}

SignUp.propTypes = {
	variant: PropTypes.oneOf(VARIANTS),
	state: PropTypes.shape({
		maxwidth: PropTypes.number,
		signup: PropTypes.bool,
	}),
}

export default SignUp