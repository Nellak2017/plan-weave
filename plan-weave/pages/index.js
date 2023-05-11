import { signOutOfApp } from '../firebase/firebase_auth'
import { auth } from '../firebase/firebase_auth.js'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Home() {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)

  const handleLoginPage = () => {
    router.push('/login')
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
      {user ? (
        <button onClick={handleLogout}>Log Out</button>
      ) : (
        <button onClick={handleLoginPage}>Log In</button>
      )
      }
      <h1>Home Page</h1>
    </>
  )
}
