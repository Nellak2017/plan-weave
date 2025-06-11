import dynamic from 'next/dynamic'
import Spinner from '../UI/atoms/Spinner/Spinner.js'
import { AUTH_FORM_TYPES } from '../Core/utils/constants.js'

const AuthForm = dynamic(() => import('../UI/organisms/AuthForm/AuthForm.js'), { ssr: true, loading: () => <Spinner /> })
const ForgotPassword = () => <AuthForm type={AUTH_FORM_TYPES?.forgotPasswordOption} />
export default ForgotPassword