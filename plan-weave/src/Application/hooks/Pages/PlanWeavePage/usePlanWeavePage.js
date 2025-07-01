import { DarkModeSwitch } from 'react-toggle-dark-mode'
import { useLocalStorage } from '../../Helpers/useLocalStorage'
const CustomDarkModeSwitch = () => {
	const { value, setValue } = useLocalStorage('themeMode')
	return <DarkModeSwitch checked={value === 'dark'} onChange={() => setValue(value === 'dark' ? 'light' : 'dark')} />
}
const NavData = {
    middleContentData: () => ({ label: 'App', href: '/plan-weave' }),
    rightContentData: ({ router, handleLogout }) => ({
        prevComponent: <CustomDarkModeSwitch />,
        linkData: [{ label: 'Log out', href: '/', title: 'Log out of PlanWeave App', onClick: () => { router.push('/'); handleLogout(router) } },],
        lastButtonData: null,
        postComponent: null,
    })
}
export const usePlanWeavePage = () => ({ NavData })