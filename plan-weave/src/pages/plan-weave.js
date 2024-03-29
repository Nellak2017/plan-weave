import { React, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signOutOfApp, auth } from '../../firebase/firebase_auth.js'
import { useAuthState } from 'react-firebase-hooks/auth'
import Spinner from '../components/atoms/Spinner/Spinner.js'
import TaskEditor from '../components/organisms/TaskEditor/TaskEditor.js'
import Nav from '../components/molecules/Nav/Nav.js'
import { makeLink } from '../components/molecules/Nav/Nav.helpers.js'
import { toast } from 'react-toastify'
import { fetchTasksFromFirebase, serialize } from '../../firebase/firebase_controller.js'
import store from '../redux/store.js'
import { initialTaskUpdate, initialUserIdUpdate } from '../redux/thunks/planWeavePageThunks.js'

const options = [
	{ name: 'name', listener: () => toast.info('Name Sorting applied. Tasks now appear alphabetically.'), algorithm: 'name' },
	{ name: 'time created', listener: () => toast.info('Time Sorting applied. Tasks now appear in chronological order.'), algorithm: 'timestamp' },
	{ name: 'ETA', listener: () => toast.info('ETA Sorting applied. Tasks now appear in ETA order.'), algorithm: 'eta' },
	{ name: 'default', listener: () => toast.info('Default Sorting applied. Tasks now appear as they do in the database.'), algorithm: '' },
]

const title = () => <h1 style={{ fontSize: '40px' }}>App</h1>

function PlanWeave() {
	const dispatch = store.dispatch
	const router = useRouter()
	const [user, loading, error] = useAuthState(auth)

	const fetchTasks = async (userId, serialize) => {
		const tasks = await fetchTasksFromFirebase(userId, serialize)
		dispatch(initialTaskUpdate(tasks))
	}

	// When auth state changes, push to homepage
	useEffect(() => {
		if (user === null && !loading) router.push('/')
	}, [user, router, loading])

	// When the page loads in, fetch tasks from Firebase
	useEffect(() => {
		if (user) {
			const userId = user?.uid
			fetchTasks(userId, serialize)
			dispatch(initialUserIdUpdate(userId))
		}
	}, [user])

	const handleLogout = async () => {
		try {
			await signOutOfApp()
			router.push('/')
		} catch (e) {
			console.log(e)
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