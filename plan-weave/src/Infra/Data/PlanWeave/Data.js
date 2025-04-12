import { DarkModeSwitch } from 'react-toggle-dark-mode'
import { usePreferredTheme } from '../../../Application/hooks/Helpers/useClientTheme'
const CustomDarkModeSwitch = () => {
	const { mode, setModeProperly } = usePreferredTheme()
	return <DarkModeSwitch checked={mode === 'dark'} onChange={setModeProperly} />
} // NOTE: using the hook makes this fully self-contained
export const NavData = {
	middleContentData: () => ({ label: 'App', href: '/plan-weave' }),
	rightContentData: ({ router, handleLogout }) => ({
		prevComponent: <CustomDarkModeSwitch />,
		linkData: [{ label: 'Log out', href: '/', title: 'Log out of PlanWeave App', onClick: () => { router.push('/'); handleLogout(router) } },],
		lastButtonData: null,
		postComponent: null,
	})
}
export const title = () => <h1 style={{ fontSize: '40px' }}>App</h1>