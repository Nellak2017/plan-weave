import React from 'react'
import AuthForm from '../components/organisms/AuthForm/AuthForm.js'
import { VARIANTS } from '../components/utils/constants.js'
import PropTypes from 'prop-types'

function Login({ variant = VARIANTS[0], state = { maxwidth: 409, signup: false } }) {
	return (
		<AuthForm variant={variant} state={state} />
	)
}
Login.propTypes = {
	variant: PropTypes.oneOf(VARIANTS),
	state: PropTypes.shape({
		maxwidth: PropTypes.number,
		signup: PropTypes.bool,
	}),
}

export default Login