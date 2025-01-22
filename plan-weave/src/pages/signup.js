import AuthForm from '../UI/organisms/AuthForm/AuthForm.js'
import { VARIANTS } from '../UI/utils/constants.js'
const SignUp = ({ variant = VARIANTS[0], state = { maxwidth: 409, signup: true } }) => (<AuthForm variant={variant} state={state} />)
export default SignUp