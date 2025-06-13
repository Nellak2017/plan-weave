import { signOutOfApp } from '../Supabase/supabase_auth.js'

export const handleLogout = async (router) => {
	const { error } = await signOutOfApp()
	if (error) console.error(error)
	router.push('/')
}