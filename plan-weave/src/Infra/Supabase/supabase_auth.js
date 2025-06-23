import { supabase } from '../Supabase/supabaseClient.js'

export const signUpWithEmail = async (email, password, client = supabase) => {
    const { data, error } = await client.auth.signUp({ email, password })
    return { user: data?.user ?? null, error }
}
export const signInWithEmail = async (email, password, client = supabase) => {
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    console.log("Access token: ", data?.session?.access_token) // TODO: Remove before production
    return { user: data?.user ?? null, error }
}
export const signInWithGoogle = async (client = supabase) => {
    const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        }
    })
    return { data, error }
}
export const signOutOfApp = async (client = supabase) => {
    const { error } = await client.auth.signOut()
    return { error }
}
export const requestPasswordReset = async (email, client = supabase) => {
    const { data, error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL}/reset-password` })
    return { data, error }
}
export const resetPassword = async (password, client = supabase) => {
    const { data, error: updateError } = await client.auth.updateUser({ password })
    return updateError ? { data, error: updateError } : { data, error: false }
}
export default supabase.auth