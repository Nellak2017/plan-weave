import { React, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signOutOfApp } from '../firebase/firebase_auth'
//import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebase_auth.js'
import { useAuthState } from 'react-firebase-hooks/auth'

function PlanWeave() {
	const router = useRouter()
	const [user, loading] = useAuthState(auth)
	//const [loggedIn, setLoggedIn] = useState(isLoggedIn)

	/*
	// Listen for authentication state changes
	useEffect(() => {
		return () => onAuthStateChanged(auth, user => user ? setLoggedIn(true) : setLoggedIn(false))
	}, [loggedIn])
	*/

	const handleLogout = async () => {
		try {
			await signOutOfApp()
			router.push('/')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		user ? (
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

export async function getServerSideProps(context) {
	const { req } = context
	const sessionCookie = req.cookies.session || ''


	try {
		const user = await auth.verifySessionCookie(sessionCookie)
		console.log('user ', user)
		return { props: {isLoggedIn: (user !== null && typeof user !== 'undefined')}}
	} catch (e) {
		return {props: {isLoggedIn: false}}
	}
}

export default PlanWeave