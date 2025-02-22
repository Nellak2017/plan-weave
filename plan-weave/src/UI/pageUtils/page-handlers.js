import { signOutOfApp } from '../../Infra/firebase/firebase_auth.js'
import { tryCatchAsyncFlat } from '../../Core/utils/helpers.js'

export const handleLogout = async (router) => {
	tryCatchAsyncFlat(async () => {
		await signOutOfApp()
		router.push('/')
	}, e => console.error(e))
}