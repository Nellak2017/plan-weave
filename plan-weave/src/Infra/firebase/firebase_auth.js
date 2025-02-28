import { getAuth, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, GoogleAuthProvider, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import app from '../firebase/config.js' 

export const auth = getAuth(app)
export const firestore = getFirestore(app)
// NOTE: SignUpWithEmail and SignInWithEmail must be handled by the caller not in this code for whatever reason.
export const signUpWithEmail = async (email, password) => {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password)
	return userCredential.user
}
export const signInWithEmail = async (email, password) => {
	const userCredential = await signInWithEmailAndPassword(auth, email, password)
	return userCredential?.user
}
// TODO: Add Promise to this so that user never gets stuck in loading state if exit out of pop-up
// TODO: Fix the broken OAuth. It closes early and goes to homepage
export const signInWithGoogle = async () => {
	const provider = new GoogleAuthProvider()
	try {
		const { user } = await signInWithPopup(auth, provider)
		return user
	} catch (e) {
		console.error(e)
	}
}
export const signOutOfApp = async () => { try { await signOut(auth) } catch (e) { console.error('Sign out error', e) } }
export default auth