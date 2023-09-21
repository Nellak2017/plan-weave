import { signOutOfApp, auth } from '../../firebase/firebase_auth.js'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)

  const handleLoginPage = () => {
    router.push('/login')
  }

  const handleSignUp = () => {
    router.push('/signup')
  }

  const handleAppPage = () => {
    router.push('/plan-weave')
  }

  const handleLogout = async () => {
    try {
      await signOutOfApp()
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <nav>
        <button onClick={user ? handleLogout : handleLoginPage}>{user ? 'Log Out' : 'Log In'}</button>
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={handleAppPage}>Go to App</button>
      </nav>
      <h1>Home Page</h1>
      <p>Under Construction</p>
      <button onClick={() => toast.warning('This is a warning message!')}>Warning Notification</button>
      <button onClick={() => toast.info('This is an info message!')}>Info Notification</button>
      <button onClick={() => toast.success('This is a success message!')}>Success Notification</button>
      <button onClick={() => toast.error('This is an error message!')}>Error Notification</button>
    </>
  )
}
