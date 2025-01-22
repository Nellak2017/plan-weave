import {
	signInWithEmail,
	signUpWithEmail,
	signInWithGoogle
} from '../../../Infra/firebase/firebase_auth.js'
import { toast } from 'react-toastify'

export const handleHomePage = (router) => router.push('/')
export const handleEmailChange = (e, setEmail) => setEmail(e.target.value)
export const handlePasswordChange = (e, setPassword) => setPassword(e.target.value)

export const handleSignInWithEmail = async (e, services, state) => {
	const { setLoading, setEmail, setPassword } = services
	const { signup, router, email, password} = state

	e.preventDefault()
	setLoading(true)

	// Firebase email auth here
	try {
		signup ? await signUpWithEmail(email, password) : await signInWithEmail(email, password) // you can assign to variable to use
		router.push('/plan-weave')
	} catch (e) {
		console.error(e.message)
		toast.error(e.message.replace("FirebaseError: Firebase: ", ""), { autoClose: 5000 })
	} finally {
		setEmail('')
		setPassword('')
		setLoading(false)
	}
}

export const handleSignInWithGoogle = async (e, services, state) => {
	const { setLoading, setEmail, setPassword } = services
	const { router } = state

	e.preventDefault()
	setLoading(true)

	// Google Auth here
	try {
		await signInWithGoogle() // you can assign to variable to use
		router.push('/plan-weave')
	} catch (e) {
		console.error(e.message)
		toast.error('Error Logging In With Google Auth', { autoClose: 5000 })
	} finally {
		setEmail('')
		setPassword('')
		setLoading(false)
	}
}
