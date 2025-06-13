import 'react-toastify/dist/ReactToastify.css'
import { SignIn, SignUp, ForgotPassword, ResetPassword } from './AuthForm.slots.js'
import { AUTH_FORM_TYPES } from '../../../Core/utils/constants.js'

const { signUpOption, signInOption, forgotPasswordOption, resetPasswordOption } = AUTH_FORM_TYPES
const getForm = type => ({ [signUpOption]: <SignUp />, [signInOption]: <SignIn />, [forgotPasswordOption]: <ForgotPassword />, [resetPasswordOption]: <ResetPassword /> }?.[type] || <SignIn />)
export const AuthForm = ({ type }) => <>{getForm(type)}</>
export default AuthForm