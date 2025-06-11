import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../firebase/firebase_auth.js'
import { toast } from 'react-toastify'
import { tryCatchAsyncFlat } from '../../Core/utils/helpers.js'
import { supabase } from '../Supabase/supabaseClient.js' // TODO: initialize supabase somewhere; whereever you are initializing.

export const handleAuthCompletion = async (state, authFx, errorFmtFx = e => e.message.replace("FirebaseError: Firebase: ", "")) => { await tryCatchAsyncFlat(async () => { await authFx(); state?.router.replace('/plan-weave') }, e => { console.error(e.message); toast.error(errorFmtFx(e), { autoClose: 5000 }) }) }
export const handleSignUpWithEmail = async (state) => { await handleAuthCompletion(state, async () => signUpWithEmail(state?.email, state?.password)) }
export const handleSignInWithEmail = async (state) => { await handleAuthCompletion(state, async () => signInWithEmail(state?.email, state?.password)) }
export const handleSignInWithGoogle = async (state) => { await handleAuthCompletion(state, async () => signInWithGoogle(), () => 'Error Logging In With Google Auth') }
// --- Supabase related
// TODO: Refactor later to remove "Supa" from these when you remove the original handlers
// TODO: Refactor these to use the tryCatchAsyncFlat abstraction to reduce LOC
export const handleSupaSignInWithEmail = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { console.error(error.message); toast.error(error, { autoClose: 5000 }) }
}
export const handleSupaSignUpWithEmail = async ({ email, password }) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { console.error(error.message); toast.error(error, { autoClose: 5000 }) }
}
export const handleRequestPasswordReset = async ({ email }) => {
    console.log("handleRequestPasswordReset is called. Implement the correct request logic.")
    // const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //     redirectTo: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000': process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
    // })
    // if (error) { console.error(error.message); toast.error(error, { autoClose: 5000 }) }
}
export const handleResetPassword = async ({ token, password }) => {
    console.log("handleResetPassword is called. Implement the correct reset logic.")
    // try {
    //     const { error: sessionError } = await supabase.auth.setSession({ access_token: token, refresh_token: '' })
    //     if (sessionError) { console.error(sessionError.message); toast.error(sessionError.message, { autoClose: 5000 }); return }
    //     const { error: updateError } = await supabase.auth.updateUser({ password })
    //     if (updateError) { console.error(updateError.message); toast.error(updateError.message, { autoClose: 5000 }); return }
    //     toast.success("Password has been successfully reset!", { autoClose: 5000 })
    // } catch (e) { console.error(e); toast.error("An unexpected error occurred.", { autoClose: 5000 }) }
}