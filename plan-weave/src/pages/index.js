import Nav from '../UI/molecules/Nav/Nav.js'
import InfoSection from '../UI/molecules/InfoSection/InfoSection.js'
import { makeLink, defaultLogin } from '../UI/molecules/Nav/Nav.helpers.js'
import { auth } from '../Infra/firebase/firebase_auth.js'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { body } from '../Infra/Data/HomePage/Data.js'
import { handleLogout } from '../UI/pageUtils/page-handlers.js'

export default function Home() {
  const router = useRouter()
  const [user] = useAuthState(auth) // [user, loading, error]

  const handleApp = () => router.push('/plan-weave')
  const handleLogIn = () => router.push('/login')
  const handleSignUp = () => router.push('/signup')

  const defaultLogout = ({
    text = 'Log Out',
    link = '/',
    title = 'Log Out',
    label = 'Log Out of Plan-Weave',
    handler,
    index = 0,
    ...props
  }) => (makeLink({ text, link, title, label, handler, index, ...props }))

  return (
    <>
      <Nav
        LoginComponent={user ? defaultLogout : defaultLogin}
        handleApp={handleApp}
        handleLogIn={user ? handleLogout : handleLogIn}
        handleSignUp={handleSignUp}
      />
      {body.map((section, index) => (
        <InfoSection
          key={section?.topLine || index}
          variant={index % 2 === 0 ? 'dark' : 'light'}
          data={section}
          priority={true} // for optimization purpose
        />
      ))}
    </>
  )
}