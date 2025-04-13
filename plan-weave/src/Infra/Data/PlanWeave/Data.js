import { DarkModeSwitch } from 'react-toggle-dark-mode'
import { useLocalStorage } from '../../../Application/hooks/Helpers/useLocalStorage'
const CustomDarkModeSwitch = () => {
	const { value, setValue } = useLocalStorage('themeMode')
	return <DarkModeSwitch checked={value === 'dark'} onChange={() => setValue(value === 'dark' ? 'light' : 'dark')} />
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