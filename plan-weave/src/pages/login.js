import dynamic from 'next/dynamic'
import Spinner from '../UI/atoms/Spinner/Spinner.js'
import { AUTH_FORM_TYPES } from '../Core/utils/constants.js'

const AuthForm = dynamic(() => import('../UI/organisms/AuthForm/AuthForm.js'), { ssr: true, loading: () => <Spinner /> })
const Login = () => <AuthForm type={AUTH_FORM_TYPES?.signInOption} />
export default Login // TODO: Add server side redirect if the user is authorized already