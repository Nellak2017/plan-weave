import { signOutOfApp, auth } from '../../firebase/firebase_auth.js'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Home() {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)

  const handleLoginPage = () => {
    router.push('/login')
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
        <button onClick={handleAppPage}>Go to App</button>
      </nav>
      <h1>Home Page</h1>
      <p>Under Construction</p>
    </>
  )
}
