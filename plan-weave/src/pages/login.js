import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { signInWithEmail } from '../../firebase/firebase_auth.js'
import { InfinitySpin } from  'react-loader-spinner'

function Login() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	const handleEmailChange = (e) => setEmail(e.target.value)

	const handlePasswordChange = (e) => setPassword(e.target.value)

	const handleLogin = async (e) => {
		e.preventDefault()
		setLoading(true) 
		try {
			const user = await signInWithEmail(email, password)
			router.push('/plan-weave')
		} catch (error) {
			setError(error)
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<InfinitySpin
				width='200'
				color="#4fa94d"
			/>
		)
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
			{error && <div>{error.message}</div>}
		</div>
	)
}

export default Login