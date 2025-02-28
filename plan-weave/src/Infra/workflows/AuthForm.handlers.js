import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../firebase/firebase_auth.js'
import { toast } from 'react-toastify'
import { tryCatchAsyncFlat } from '../../Core/utils/helpers.js'

export const handleAuthCompletion = async (state, authFx, errorFmtFx = e => e.message.replace("FirebaseError: Firebase: ", "")) => { await tryCatchAsyncFlat(async () => { await authFx(); state?.router.replace('/plan-weave') }, e => { console.error(e.message); toast.error(errorFmtFx(e), { autoClose: 5000 }) })}
export const handleSignUpWithEmail = async (state) => { await handleAuthCompletion(state, async () => signUpWithEmail(state?.email, state?.password)) }
export const handleSignInWithEmail = async (state) => { await handleAuthCompletion(state, async () => signInWithEmail(state?.email, state?.password)) }
export const handleSignInWithGoogle = async (state) => { await handleAuthCompletion(state, async () => signInWithGoogle(), () => 'Error Logging In With Google Auth') }