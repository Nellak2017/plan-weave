import dynamic from 'next/dynamic'
import Spinner from '../UI/atoms/Spinner/Spinner.js'
import { AUTH_FORM_TYPES } from '../Core/utils/constants.js'

const AuthForm = dynamic(() => import('../UI/organisms/AuthForm/AuthForm.js'), { ssr: true, loading: () => <Spinner /> })
const SignUp = () => <AuthForm type={AUTH_FORM_TYPES?.signUpOption} />
export default SignUp