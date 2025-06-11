import { useState } from 'react'
// import { sendPasswordResetEmail } from '../../../Infra/workflows/AuthForm.handlers'

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    // const triggerForgotPassword = async (email) => {
    //     setLoading(true)
    //     setError(null)
    //     try {
    //         await sendPasswordResetEmail({ email })
    //         setSuccess(true)
    //     } catch (err) {
    //         console.error("Failed to send reset email:", err)
    //         setError(err)
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    const triggerForgotPassword = () => { console.log("hello world. Trigger Forgot password called. ")}
    return { triggerForgotPassword, loading, error, success }
}