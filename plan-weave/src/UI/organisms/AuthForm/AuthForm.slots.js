import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@mui/material"
import GoogleButton from 'react-google-button'
import { TaskInput } from '../../atoms/TaskInput/TaskInput.js'
import { AuthContainer, StyledAuthForm, InputSection, SignInContainer, OrSeparator, Line, Or, CenteredContainer, SubtitleContainer } from './AuthForm.elements.js'
import { handleSignInWithEmail, handleSignUpWithEmail, handleSignInWithGoogle } from '../../../Infra/workflows/AuthForm.handlers.js'
import logo from '../../../../public/Plan-Weave-Logo.png'
import { useForm } from 'react-hook-form'
import { useAuthForm } from '../../../Application/hooks/AuthForm/useAuthForm.js'

const AuthInput = React.forwardRef((props, ref) => (<TaskInput ref={ref} {...props} />)); AuthInput.displayName = 'AuthInput'

const GeneralAuthForm = ({
    state: { signup = false, title = 'Sign in', emailButtonText = 'Sign in with Email', callToAction = { text: "Don't have an account?", link: '/signup', linkText: 'Sign up.' }, } = {},
    services: { emailSubmit = handleSignInWithEmail } = {}, customHook = useAuthForm
}) => {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { variant, maxwidth } = customHook?.() || {}
    return (
        <CenteredContainer>
            <AuthContainer variant={variant} maxwidth={maxwidth}>
                <StyledAuthForm onSubmit={handleSubmit((data => emailSubmit({ router, ...data })))} method='POST' id='email-form' variant={variant} maxwidth={maxwidth}>
                    <Link href='/'><Image src={logo.src} alt='Plan Weave Logo' width={128} height={96} className={'logo'} title={'Go Home'} priority={true} /></Link>
                    <h2>{title}</h2>
                    <SubtitleContainer>
                        <h3><p>{callToAction?.text}</p></h3>
                        <Link href={callToAction?.link}>{callToAction?.linkText}</Link>
                    </SubtitleContainer>
                    <InputSection>
                        <label htmlFor='email'>Email Address</label>
                        <AuthInput {...register('email', { required: 'Email is required', pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i })} id='email' name="email" type="email" placeholder="email@example.com" autoComplete='username' />
                        {errors.email && <span>{errors.email.message || "Invalid email format"}</span>}
                    </InputSection>
                    <InputSection>
                        <label htmlFor='password'>Password</label>
                        <AuthInput {...register('password', { required: 'Password is required' })} id='password' name="password" type="password" placeholder="Enter your password" autoComplete='current-password' />
                        {errors.password && <span>{errors.password.message || "Password is required"}</span>}
                    </InputSection>
                    <SignInContainer><Button type='submit' name='email-auth' title={emailButtonText}> {emailButtonText}</Button></SignInContainer>
                </StyledAuthForm>
                <OrSeparator><Line /><Or>or</Or><Line /></OrSeparator>
                <SignInContainer id='google-auth-container'>
                    <GoogleButton name='google-auth' type={variant} signup={signup} onClick={e => { e.preventDefault(); handleSignInWithGoogle({ router }) }} />
                </SignInContainer>
            </AuthContainer>
        </CenteredContainer>
    )
}
export const SignIn = ({ state }) => <GeneralAuthForm state={state} />
export const SignUp = ({ state }) => <GeneralAuthForm state={{ ...state, signup: true, title: 'Sign up', emailButtonText: 'Sign up with Email', callToAction: { text: "Have an account?", link: '/login', linkText: 'Sign in.' }, }} services={{ emailSubmit: handleSignUpWithEmail }} />