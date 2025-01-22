import { useRouter } from 'next/router'
import { auth } from '../../firebase/firebase_auth.js'
import { useAuthState } from 'react-firebase-hooks/auth'
import TaskEditor from '../UI/organisms/TaskEditor/TaskEditor.js'
import Nav from '../UI/molecules/Nav/Nav.js'
import { fetchTasksFromFirebase, serialize } from '../../firebase/firebase_controller.js'
import store from '../redux/store.js'
import { initialTaskUpdate, initialUserIdUpdate } from '../redux/thunks/planWeavePageThunks.js'
import { loadingOrError } from '../pageUtils/helper-components.js'
import { useRedirectIfUnauthorized } from '../hooks/useRedirectIfUnauthorized.js'
import { options, title, defaultLogout } from '../Data/PlanWeave/Data.js'
import { useTaskFetching } from '../hooks/useTaskFetching.js'

function PlanWeave() {
	const dispatch = store.dispatch
	const router = useRouter()
	const [user, loading, error] = useAuthState(auth)

	// --- Effects
	useRedirectIfUnauthorized(user, loading)
	useTaskFetching({
		user,
		serialize,
		dispatch,
		taskFetcher: fetchTasksFromFirebase,
		taskUpdateReducer: initialTaskUpdate,
		userIdReducer: initialUserIdUpdate
	})

	// --- Loading or Error Component
	if (loadingOrError({ loading, error, user })) return loadingOrError({ loading, error, user })
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