import Nav from '../UI/molecules/Nav/Nav.js'
import InfoSection from '../UI/molecules/InfoSection/InfoSection.js'
import { useRouter } from 'next/router'
import { useHomePage } from '../Application/hooks/Pages/HomePage/useHomePage.js'
import { handleLogout } from '../Infra/workflows/logout.handlers.js'
import { LeftContent, MiddleContent, RightContent } from '../UI/molecules/Nav/Nav.slots.js'
import { useSupabaseAuth } from '../Application/hooks/Helpers/useSupabaseAuth.js'

export default function Home() {
  const { NavData, body } = useHomePage?.() || {}
  const { middleContentData, rightContentData } = NavData
  const router = useRouter()
  const { user } = useSupabaseAuth()
  return (
    <>
      <Nav slots={{ left: <LeftContent />, middle: <MiddleContent state={middleContentData({ user })} />, right: <RightContent state={rightContentData({ user, router, handleLogout })} />,}} />
      {body.map((section, index) => (<InfoSection key={section?.topLine || index} state={{ variant: index % 2 === 0 ? 'dark' : 'light', data: section }} />))}
    </>
  )
}