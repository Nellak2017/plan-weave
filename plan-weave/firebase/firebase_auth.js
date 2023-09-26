import {
	getAuth,
	signInWithEmailAndPassword,
	signInWithPopup,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signOut
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import app from '../firebase/config.js'

// TODO: Verify Email and Password conforms to Rules

// Initialize Firebase authentication
export const auth = getAuth(app)
export const firestore = getFirestore(app)

// Function for signing up with email and password
export const signUpWithEmail = async (email, password) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password)

		// If successful, it's a sign-up
		const user = userCredential.user
		console.log('User signed up successfully:', user)
	
		return user
	} catch (e) {
		console.error('Error signing up:', e.message)
		throw new Error(e)
	}
}

// Function for signing in with email and password
export const signInWithEmail = async (email, password) => {
	try {
		// Sign in the user with their email and password
		const userCredential = await signInWithEmailAndPassword(auth, email, password)
		const user = userCredential.user

		// Log the user in and redirect to the main app
		console.log('User signed in:', user)
		return user
	} catch (e) {
		console.error('Error signing in with email and password:', e)
		throw new Error(e)
	}
}


// TODO: Add Promise to this so that user never gets stuck in loading state if exit out of pop-up
// Function to sign in with Google
export const signInWithGoogle = async () => {
	const provider = new GoogleAuthProvider()
	try {
		const { user } = await signInWithPopup(auth, provider)
		return user
	} catch (e) {
		console.error(e)
		throw new Error('Error signing in with Google', JSON.stringify(e))
	}
}

// Function to sign out
export const signOutOfApp = async () => {
	try {
		await signOut(auth)
	} catch (e) {
		console.error('Sign out error', e)
		throw new Error('Error signing out', JSON.stringify(e))
	}
}

export default auth