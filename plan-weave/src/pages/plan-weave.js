import { useRouter } from 'next/router'
import { auth } from '../Infra/firebase/firebase_auth.js'
import { useAuthState } from 'react-firebase-hooks/auth'
import TaskEditor from '../UI/organisms/TaskEditor/TaskEditor.js'
import Nav from '../UI/molecules/Nav/Nav.js'
import { fetchTasksFromFirebase, serialize } from '../Infra/firebase/firebase_controller.js'
import store from '../Application/store.js'
//import { initialTaskUpdate, initialUserIdUpdate } from '../Application/redux/thunks/planWeavePageThunks.js'
import { loadingOrError } from '../UI/pageUtils/helper-components.js'
import { useRedirectIfUnauthorized } from '../UI/hooks/useRedirectIfUnauthorized.js'
import { options, NavData } from '../Infra/Data/PlanWeave/Data.js'
import { useTaskFetching } from '../UI/hooks/useTaskFetching.js'
import { LeftContent, MiddleContent, RightContent } from '../UI/molecules/Nav/Nav.slots.js'
import { handleLogout } from '../UI/pageUtils/page-handlers.js'

function PlanWeave() {
	const { middleContentData, rightContentData } = NavData
	const dispatch = store.dispatch
	const router = useRouter()
	const [user, loading, error] = useAuthState(auth)
	// --- Effects
	useRedirectIfUnauthorized(user, loading)
	//useTaskFetching({ user, serialize, dispatch, taskFetcher: fetchTasksFromFirebase, taskUpdateReducer: initialTaskUpdate, userIdReducer: initialUserIdUpdate })
	// --- Loading or Error Component
	return loadingOrError({ loading, error, user })
		? loadingOrError({ loading, error, user })
		: (
			<>
				<Nav
					slots={{
						left: <LeftContent />,
						middle: <MiddleContent state={middleContentData()} />,
						right: <RightContent state={rightContentData({ router, handleLogout })} />
					}}
				/>
				<TaskEditor variant='dark' sortingAlgorithm='timestamp' options={options} />
			</>
		)
}

export default PlanWeave