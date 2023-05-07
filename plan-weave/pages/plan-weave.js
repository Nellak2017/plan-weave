import { React, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signOutOfApp } from '../firebase/firebase_auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebase_auth.js'

function PlanWeave() {
	const router = useRouter()
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	// Listen for authentication state changes
	useEffect(() => {
		return () => onAuthStateChanged(auth, user => user ? setIsLoggedIn(true) : setIsLoggedIn(false))
	}, [isLoggedIn])

	const handleLogout = async () => {
		try {
			await signOutOfApp()
			router.push('/')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		isLoggedIn ? (
			<>
				<nav>
					<button onClick={handleLogout}>Log out</button>
				</nav>
				<h2>Plan-Weave</h2>
			</>
		) :
			<div>
				<h1>Unauthorized</h1>
				<p>You need to log in to access this page.</p>
			</div>
	)
}

export default PlanWeave