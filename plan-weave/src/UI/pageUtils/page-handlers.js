import { signOutOfApp } from '../../Infra/firebase/firebase_auth.js'

// --- General handlers for any page
export const handleLogout = async (router) => {
	try {
		await signOutOfApp()
		router.push('/')
	} catch (error) {
		console.error(error)
	}
}