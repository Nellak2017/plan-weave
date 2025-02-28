import dynamic from 'next/dynamic'
import Spinner from '../UI/atoms/Spinner/Spinner.js'

const AuthForm = dynamic(() => import('../UI/organisms/AuthForm/AuthForm.js'), { ssr: true, loading: () => <Spinner /> })
const Login = () => <AuthForm signup={false} />
export default Login // TODO: Add server side redirect if the user is authorized already