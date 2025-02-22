import { getAuth, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, GoogleAuthProvider, signOut} from 'firebase/auth'
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
		return userCredential.user
	} catch (e) {
		console.error('Error signing up:', e.message)
	}
}
// Function for signing in with email and password
export const signInWithEmail = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password)
		return userCredential.user
	} catch (e) {
		console.error('Error signing in with email and password:', e)
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
	}
}
// Function to sign out
export const signOutOfApp = async () => {
	try {
		await signOut(auth)
	} catch (e) {
		console.error('Sign out error', e)
	}
}
export default auth