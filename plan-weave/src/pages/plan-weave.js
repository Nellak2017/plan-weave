import { useRouter } from 'next/router'
import { auth } from '../Infra/firebase/firebase_auth.js'
import { useAuthState } from 'react-firebase-hooks/auth'
import TaskEditor from '../UI/organisms/TaskEditor/TaskEditor.js'
import Nav from '../UI/molecules/Nav/Nav.js'
import { fetchTasksFromFirebase, serialize } from '../Infra/firebase/firebase_controller.js'
import store from '../Application/store.js'
//import { initialTaskUpdate, initialUserIDUpdate } from '../Application/redux/thunks/planWeavePageThunks.js'
import { loadingOrError } from '../UI/pageUtils/helper-components.js'
import { useRedirectIfUnauthorized } from '../Application/hooks/Helpers/useRedirectIfUnauthorized.js'
import { NavData } from '../Infra/Data/PlanWeave/Data.js'
import { useTaskFetching } from '../Application/hooks/Helpers/useTaskFetching.js'
import { LeftContent, MiddleContent, RightContent } from '../UI/molecules/Nav/Nav.slots.js'
import { handleLogout } from '../UI/pageUtils/page-handlers.js'

// TODO: Remove "Data" layer from Infra and replace with Hooks for consistency and simplicity
const PlanWeave = () => {
	const { middleContentData, rightContentData } = NavData // TODO: Instead of writing out Nav verbosely here, export default ones for each user of it for clarity
	const dispatch = store.dispatch
	const router = useRouter()
	const [user, loading, error] = useAuthState(auth)
	useRedirectIfUnauthorized(user, loading)
	//useTaskFetching({ user, serialize, dispatch, taskFetcher: fetchTasksFromFirebase, taskUpdateReducer: initialTaskUpdate, userIDReducer: initialUserIDUpdate })
	if (loadingOrError({ loading, error, user })) return loadingOrError({ loading, error, user })
	return (
		<>
			<Nav slots={{ left: <LeftContent />, middle: <MiddleContent state={middleContentData()} />, right: <RightContent state={rightContentData({ router, handleLogout })} /> }} />
			<TaskEditor />
		</>
	)
}

export default PlanWeave