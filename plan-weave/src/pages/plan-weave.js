import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../Infra/firebase/firebase_auth.js'
import { useAuthState } from 'react-firebase-hooks/auth'
import TaskEditor from '../UI/organisms/TaskEditor/TaskEditor.js'
import Nav from '../UI/molecules/Nav/Nav.js'
import { fetchTasksFromFirebase, serialize } from '../Infra/firebase/firebase_controller.js'
import store from '../Application/store.js'
import { LoadingOrError } from '../UI/atoms/LoadingOrError/LoadingOrError.js'
import { useRedirectIfUnauthorized } from '../Application/hooks/Helpers/useRedirectIfUnauthorized.js'
import { NavData } from '../Infra/Data/PlanWeave/Data.js'
import { LeftContent, MiddleContent, RightContent } from '../UI/molecules/Nav/Nav.slots.js'
import { handleLogout } from '../Infra/workflows/logout.handlers.js'
import { initialTaskUpdate } from '../Application/entities/tasks/tasksThunks.js'
import { setUserID } from '../Application/sessionContexts/auth.js'

// TODO: Remove "Data" layer from Infra and replace with Hooks for consistency and simplicity
const PlanWeave = () => {
	const { middleContentData, rightContentData } = NavData
	const dispatch = store.dispatch
	const router = useRouter()
	const [user, loading, error] = useAuthState(auth)
	useRedirectIfUnauthorized(user, loading)

	const fetchTasks = useCallback(async (userID, serialize) => {
		const taskList = await fetchTasksFromFirebase(userID, serialize)
		dispatch(initialTaskUpdate({ taskList }))
	})
	useEffect(() => {
		if (user) {
			fetchTasks(user?.uid, serialize)
			dispatch(setUserID(user?.uid))
		}
	}, [user])

	if (loading || error || !user) return <LoadingOrError loading={loading} error={error} user={user} />
	// TODO: There is a code smell associated with how I implemented the Nav slots. Something about it is off. Investigate to improve abstraction.
	return (
		<>
			<Nav slots={{
				left: <LeftContent />,
				middle: <MiddleContent state={middleContentData()} />,
				right: <RightContent state={rightContentData({ router, handleLogout, isDarkMode: false, handleDarkModeChange: () => toggleTheme() })} />
			}} />
			<TaskEditor />
		</>
	)
}

export default PlanWeave