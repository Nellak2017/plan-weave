import { toast } from 'react-toastify'
export const options = [
	{ name: 'name', listener: () => toast.info('Name Sorting applied. Tasks now appear alphabetically.'), algorithm: 'name' },
	{ name: 'time created', listener: () => toast.info('Time Sorting applied. Tasks now appear in chronological order.'), algorithm: 'timestamp' },
	{ name: 'ETA', listener: () => toast.info('ETA Sorting applied. Tasks now appear in ETA order.'), algorithm: 'eta' },
	{ name: 'default', listener: () => toast.info('Default Sorting applied. Tasks now appear as they do in the database.'), algorithm: '' },
]
export const NavData = {
	middleContentData: () => ({ label: 'App', href: '/plan-weave' }),
	rightContentData: ({ router, handleLogout }) => ({
		linkData: [{ label: 'Log out', href: '/', title: 'Log out of PlanWeave App', onClick: () => { router.push('/'); handleLogout(router) } },],
		lastButtonData: null
	})
}
export const title = () => <h1 style={{ fontSize: '40px' }}>App</h1>