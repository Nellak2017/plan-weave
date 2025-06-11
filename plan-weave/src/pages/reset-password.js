import dynamic from 'next/dynamic'
import Spinner from '../UI/atoms/Spinner/Spinner.js'
import { AUTH_FORM_TYPES } from '../Core/utils/constants.js'
import { useRouter } from 'next/router.js'

const AuthForm = dynamic(() => import('../UI/organisms/AuthForm/AuthForm.js'), { ssr: true, loading: () => <Spinner /> })
const ResetPassword = () => {
    // CSR for the URL from the magic link parsing
    const router = useRouter()
    const [token, setToken] = useState(null)

    useEffect(() => {
        if (!router.isReady) return
        const { access_token } = router.query
        if (access_token) { setToken(access_token) }
        else { router.push('/login') }
    }, [router.isReady, router.query])

    // SSR for the page rendering itself
    return <AuthForm type={AUTH_FORM_TYPES?.resetPasswordOption} token={token} />
}
export default ResetPassword