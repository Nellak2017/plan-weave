import 'react-toastify/dist/ReactToastify.css'
import { SignIn, SignUp, ForgotPassword } from './AuthForm.slots.js'
import { AUTH_FORM_TYPES } from '../../../Core/utils/constants.js'

const { signUpOption, signInOption, forgotPasswordOption } = AUTH_FORM_TYPES
const getForm = type => ({ [signUpOption]: <SignUp />, [signInOption]: <SignIn />, [forgotPasswordOption]: <ForgotPassword /> }?.[type] || <SignIn />)
export const AuthForm = ({ type }) => <>{getForm(type)}</>
export default AuthForm