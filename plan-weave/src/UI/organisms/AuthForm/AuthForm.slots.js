import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@mui/material"
// import GoogleButton from 'react-google-button'
import { TaskInput } from '../../atoms/TaskInput/TaskInput.js'
import { AuthContainer, StyledAuthForm, InputSection, SignInContainer, OrSeparator, Line, Or, CenteredContainer, SubtitleContainer, ForgotPasswordButton } from './AuthForm.elements.js'
import { handleSignInWithEmail, handleSignUpWithEmail, handleSignInWithGoogle } from '../../../Infra/workflows/AuthForm.handlers.js'
import { useForm } from 'react-hook-form'
import { useAuthForm } from '../../../Application/hooks/AuthForm/useAuthForm.js'
// import { useTheme } from '@mui/material/styles'

const logo = { src: '/Plan-Weave-Logo.png' }
const AuthInput = React.forwardRef((props, ref) => (<TaskInput ref={ref} {...props} />)); AuthInput.displayName = 'AuthInput'

// TODO: Make the form more modern by using MUI for the email/password inputs and also make the Forgot your password? thing appear modern and standard
const GeneralAuthForm = ({
    state: { title = 'Sign in', emailButtonText = 'Sign in with Email', callToAction = { text: "Don't have an account?", link: '/signup', linkText: 'Sign up.' }, inputSections = { topText: 'Email Address', bottomText: 'Password' }, forgotPasswordText = 'Forgot your password?', forgotPasswordRedirect = '/forgot-password' } = {},
    services: { emailSubmit = handleSignInWithEmail } = {}, customHook = useAuthForm
}) => {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { maxwidth } = customHook?.() || {}
    // const theme = useTheme(), variant = theme.palette.mode
    return (
        <CenteredContainer>
            <AuthContainer maxwidth={maxwidth}>
                <StyledAuthForm onSubmit={handleSubmit((data => emailSubmit({ router, ...data })))} method='POST' id='email-form' maxwidth={maxwidth}>
                    <Link href='/'><Image src={logo.src} alt='Plan Weave Logo' width={128} height={96} className={'logo'} title={'Go Home'} priority={true} /></Link>
                    <h2>{title}</h2>
                    {callToAction && <SubtitleContainer>
                        <h3><p>{callToAction?.text}</p></h3>
                        <Link href={callToAction?.link}>{callToAction?.linkText}</Link>
                    </SubtitleContainer>}
                    {inputSections?.topText &&
                        <InputSection>
                            <label htmlFor='email'>{inputSections?.topText}</label>
                            <AuthInput {...register('email', { required: 'Email is required', pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i })} id='email' name="email" type="email" placeholder="email@example.com" autoComplete='username' />
                            {errors.email && <span>{errors.email.message || "Invalid email format"}</span>}
                        </InputSection>}
                    {inputSections?.bottomText &&
                        <InputSection>
                            <label htmlFor='password'>{inputSections?.bottomText}</label>
                            <AuthInput {...register('password', { required: 'Password is required' })} id='password' name="password" type="password" placeholder="Enter your password" autoComplete='current-password' />
                            {errors.password && <span>{errors.password.message || "Password is required"}</span>}
                        </InputSection>}
                    <SignInContainer><Button type='submit' name='email-auth' title={emailButtonText}> {emailButtonText}</Button></SignInContainer>
                </StyledAuthForm>
                {forgotPasswordText && <Link href={forgotPasswordRedirect}>{forgotPasswordText}</Link>}
                {/* <OrSeparator><Line /><Or>or</Or><Line /></OrSeparator>
                <SignInContainer id='google-auth-container'>
                    <GoogleButton name='google-auth' type={variant} signup={signup} onClick={e => { e.preventDefault(); handleSignInWithGoogle({ router }) }} />
                </SignInContainer> */}
                {/* The Google Button is commented out on purpose. It will have to be re-implemented when we can properly handle OAuth */}
            </AuthContainer>
        </CenteredContainer>
    )
}
export const SignIn = ({ state }) => <GeneralAuthForm state={state} />
export const SignUp = ({ state }) => <GeneralAuthForm state={{ ...state, title: 'Sign up', emailButtonText: 'Sign up with Email', callToAction: { text: "Have an account?", link: '/login', linkText: 'Sign in.' }, forgotPasswordText: 'Forgot your password?' }} services={{ emailSubmit: handleSignUpWithEmail }} />
export const ForgotPassword = ({ state }) => <GeneralAuthForm state={{ ...state, title: 'Reset Password', callToAction: null, inputSections: { topText: null, bottomText: 'New Password' }, emailButtonText: 'Reset Password', forgotPasswordText: null }} />