import Nav from '../components/molecules/Nav/Nav.js'
import { makeLink, defaultLogin } from '../components/molecules/Nav/Nav.helpers.js'
import { signOutOfApp, auth } from '../../firebase/firebase_auth.js'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Home() {
  const router = useRouter()
  const [user] = useAuthState(auth) // [user, loading, error]

  const handleApp = () => router.push('/plan-weave')
  const handleLogIn = () => router.push('/login')
  const handleSignUp = () => router.push('/signup')

  const handleLogout = async () => {
    console.log("Logging out")
    try {
      await signOutOfApp()
      router.push('/')
      console.log("Logged out")
    } catch (error) {
      console.log(error)
    }
  }

  const defaultLogout = ({
    text = 'Log Out',
    link = '/',
    title = 'Log Out',
    label = 'Login Out of Plan-Weave',
    handler,
    index = 4
  }) => (makeLink({ text, link, title, label, handler, index }))

  return (
    <>
      <Nav
        LoginComponent={user ? defaultLogout : defaultLogin}
        handleApp={handleApp}
        handleLogIn={user ? handleLogout : handleLogIn}
        handleSignUp={handleSignUp}
      />
      <h1>Home Page</h1>
      <p>Under Construction</p>
    </>
  )
}
