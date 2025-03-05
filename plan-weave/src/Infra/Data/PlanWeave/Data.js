export const NavData = {
	middleContentData: () => ({ label: 'App', href: '/plan-weave' }),
	rightContentData: ({ router, handleLogout }) => ({ linkData: [{ label: 'Log out', href: '/', title: 'Log out of PlanWeave App', onClick: () => { router.push('/'); handleLogout(router) } },], lastButtonData: null})
}
export const title = () => <h1 style={{ fontSize: '40px' }}>App</h1>