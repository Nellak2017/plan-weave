import { React, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signOutOfApp, auth } from '../../firebase/firebase_auth.js'
import { useAuthState } from 'react-firebase-hooks/auth'
import { InfinitySpin } from 'react-loader-spinner'
import { fillDefaults } from '../components/schemas/taskSchema/taskSchema.js'
import { addTask } from '../../firebase/firebase_controller.js'

function PlanWeave() {
	const router = useRouter()
	const [user, loading, error] = useAuthState(auth)

	const [name, setName] = useState('')
	const [eta, setEta] = useState('')
	const [ata, setAta] = useState('')
	const [dueDate, setDueDate] = useState('')
	const [value, setValue] = useState('')

	// When auth state changes, push to homepage
	useEffect(() => {
		if (!user) router.push('/')
	}, [user])

	const handleHome = () => {
		router.push('/')
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const task = { name, eta, ata, dueDate, value }
		const defaultFilled = fillDefaults(task)
		addTask(defaultFilled)
	}

	const handleLogout = async () => {
		try {
			await signOutOfApp()
			router.push('/')
		} catch (error) {
			console.log(error)
		}
	}

	if (loading) {
		return (
			<InfinitySpin
				width='200'
				color="#4fa94d"
			/>
		)
	}

	if (error) {
		return <p>{error.message}</p>
	}

	if (!user) {
		return (
			<div>
				<h1>Unauthorized</h1>
				<p>You need to log in to access this page.</p>
			</div>
		)
	}

	// The app is displayed if authenticated user
	return (
		<>
			<nav>
				<button onClick={handleLogout}>Log out</button>
				<button onClick={handleHome}>Go Home</button>
			</nav>
			<h2>Plan-Weave</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Name:
					<input required type="text" value={name} onChange={(e) => setName(e.target.value)} />
				</label>
				<br />
				<label>
					ETA:
					<input type="text" value={eta} onChange={(e) => setEta(e.target.value)} />
				</label>
				<br />
				<label>
					ATA:
					<input type="text" value={ata} onChange={(e) => setAta(e.target.value)} />
				</label>
				<br />
				<label htmlFor="dueDate">
					Due Date:
					<input type="date" id="dueDate" name="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
				</label>
				<br />
				<label>
					Value:
					<input required type="number" value={value} onChange={(e) => setValue(e.target.value)} />
				</label>
				<br />
				<button type="submit">Submit</button>
			</form>
		</>
	)
}

export default PlanWeave