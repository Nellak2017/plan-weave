import { React, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signOutOfApp, auth } from '../../firebase/firebase_auth.js'
import { useAuthState } from 'react-firebase-hooks/auth'
import Spinner from '../components/atoms/Spinner/Spinner.js'
import TaskEditor from '../components/organisms/TaskEditor/TaskEditor.js'
import Nav from '../components/molecules/Nav/Nav.js'
import { makeLink } from '../components/molecules/Nav/Nav.helpers.js'
import { toast } from 'react-toastify'

const options = [
	{ name: 'name', listener: () => toast.info('Name Sorting applied. Tasks now appear alphabetically.'), algorithm: 'name' },
	{ name: 'time created', listener: () => toast.info('Time Sorting applied. Tasks now appear in chronological order.'), algorithm: 'timestamp' },
	{ name: 'ETA', listener: () => toast.info('ETA Sorting applied. Tasks now appear in ETA order.'), algorithm: 'eta' },
	{ name: 'default', listener: () => toast.info('Default Sorting applied. Tasks now appear as they do in the database.'), algorithm: '' },
]

const title = () => <h1 style={{ fontSize: '40px' }}>App</h1>

function PlanWeave() {
	const router = useRouter()
	const [user, loading, error] = useAuthState(auth)

	// When auth state changes, push to homepage
	useEffect(() => { 
		if (user === null && !loading) router.push('/') 
	}, [user, router])

	const handleLogout = async () => {
		try {
			await signOutOfApp()
			router.push('/')
		} catch (error) {
			console.log(error)
		}
	}

	if (loading) return (<Spinner />)
	if (error) return <p>{error.message}</p>
	if (!user) {
		return (
			<div>
				<h1>Unauthorized</h1>
				<p>You need to log in to access this page.</p>
			</div>
		)
	}
	const defaultLogout = ({
		text = 'Log Out',
		link = '/',
		title = 'Log Out',
		label = 'Log Out of Plan-Weave',
		handler = handleLogout,
		index = 4
	}) => (makeLink({ text, link, title, label, handler, index }))

	// The app is displayed if authenticated user
	return (
		<>
			<Nav
				LoginComponent={defaultLogout}
				MiddleComponent={title}
				AppComponent={() => undefined}
				SignUpComponent={() => undefined}
				handleLogo={() => router.push('/')}
			/>
			<TaskEditor variant='dark' sortingAlgorithm='timestamp' options={options} />
		</>
	)
}

export default PlanWeave