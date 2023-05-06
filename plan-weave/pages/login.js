import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { signInWithEmail } from '../firebase/firebase_auth.js'

function Login() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)

	const handleEmailChange = (e) => setEmail(e.target.value)

	const handlePasswordChange = (e) => setPassword(e.target.value)

	const handleLogin = async (e) => {
		e.preventDefault()
		try {
			const user = await signInWithEmail(email, password)
			console.log(user)
			if (user) {
				router.push('/plan-weave')
			} else {
				setError(error)
			}
		} catch (error) {
			setError(error)
			console.error(error)
		}
	}

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={handleEmailChange}
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={handlePasswordChange}
					/>
				</div>
				<button type="submit">Login</button>
			</form>
			{error && <div>{error}</div>}
		</div>
	)
}

export default Login