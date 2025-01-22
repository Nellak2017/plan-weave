import { signOutOfApp } from '../../Infra/firebase/firebase_auth.js'

export const handleLogout = async (router) => {
	try {
		await signOutOfApp()
		router.push('/')
	} catch (error) {
		console.error(error)
	}
}