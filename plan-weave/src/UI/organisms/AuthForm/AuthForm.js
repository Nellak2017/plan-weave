import 'react-toastify/dist/ReactToastify.css'
import { SignIn, SignUp } from './AuthForm.slots.js'

export const AuthForm = ({ signup }) =><>{signup ? <SignUp /> : <SignIn />}</>
export default AuthForm