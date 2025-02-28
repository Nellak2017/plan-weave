import dynamic from 'next/dynamic'
import Spinner from '../UI/atoms/Spinner/Spinner.js'

const AuthForm = dynamic(() => import('../UI/organisms/AuthForm/AuthForm.js'), { ssr: true, loading: () => <Spinner /> })
const SignUp = () => <AuthForm signup={true} />
export default SignUp