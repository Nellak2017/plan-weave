import 'react-toastify/dist/ReactToastify.css'
import { SignIn, SignUp, ForgotPassword, ResetPassword } from './AuthForm.slots.js'
import { AUTH_FORM_TYPES } from '../../../Core/utils/constants.js'

const { signUpOption, signInOption, forgotPasswordOption, resetPasswordOption } = AUTH_FORM_TYPES
const getForm = (type, token) => ({ [signUpOption]: <SignUp />, [signInOption]: <SignIn />, [forgotPasswordOption]: <ForgotPassword />, [resetPasswordOption]: <ResetPassword token={token} /> }?.[type] || <SignIn />)
export const AuthForm = ({ type, token }) => <>{getForm(type, token)}</>
export default AuthForm