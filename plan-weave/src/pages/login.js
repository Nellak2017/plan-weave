import AuthForm from '../UI/organisms/AuthForm/AuthForm.js'
import { VARIANTS } from '../Core/utils/constants.js'
const Login = ({ variant = VARIANTS[0], state = { maxwidth: 409, signup: false } }) => (<AuthForm variant={variant} state={state} />)
export default Login