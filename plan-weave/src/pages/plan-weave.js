import { useEffect } from 'react'
import { useRouter } from 'next/router'
import TaskEditor from '../UI/organisms/TaskEditor/TaskEditor.js'
import Nav from '../UI/molecules/Nav/Nav.js'
import store from '../Application/store.js'
import { LoadingOrError } from '../UI/atoms/LoadingOrError/LoadingOrError.js'
import { useRedirectIfUnauthorized } from '../Application/hooks/Helpers/useRedirectIfUnauthorized.js'
import { usePlanWeavePage } from '../Application/hooks/Pages/PlanWeavePage/usePlanWeavePage.js'
import { LeftContent, MiddleContent, RightContent } from '../UI/molecules/Nav/Nav.slots.js'
import { handleLogout } from '../Infra/workflows/logout.handlers.js'
import { initialTaskUpdate } from '../Application/entities/tasks/tasksThunks.js'
import { setUserID } from '../Application/sessionContexts/auth.js'
import { useSupabaseAuth } from '../Application/hooks/Helpers/useSupabaseAuth.js'
import { fetchTasksFromSupabase } from '../Infra/Supabase/supabase_controller.js'

// TODO: There is a bug where if the user navigates away from the page and returns, waste and efficiency and liveTimeStamp are messed with
// NOTE: The Above TODO may possibly be fixed if we find a way to make the 'initialTaskUpdate' only run for the length of the session!
// NOTE: It may also be possible to fix the problem by checking if valid tasks exist in the redux store and if so we don't need to fetch or something
const PlanWeave = () => {
	const { NavData } = usePlanWeavePage?.() || {}
	const { middleContentData, rightContentData } = NavData
	const dispatch = store.dispatch
	const router = useRouter()
	const { user, loading, error } = useSupabaseAuth()
	useRedirectIfUnauthorized(user, loading)
	useEffect(() => {
		if (user) {
			(async () => dispatch(initialTaskUpdate({ taskList: await fetchTasksFromSupabase() })))()
			dispatch(setUserID(user?.id))
		}
	}, [user, dispatch])
	// TODO: There is a code smell associated with how I implemented the Nav slots. Something about it is off. Investigate to improve abstraction.
	return loading || error || !user
		? <LoadingOrError loading={loading} error={error} user={user} />
		: (
			<>
				<Nav slots={{ left: <LeftContent />, middle: <MiddleContent state={middleContentData()} />, right: <RightContent state={rightContentData({ router, handleLogout })} />}} />
				<TaskEditor />
			</>
		)
}
export default PlanWeave