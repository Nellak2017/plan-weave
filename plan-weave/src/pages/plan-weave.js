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
import { tasks as tasksSelector } from '../Application/selectors.js'

// TODO: There is a bug where if the user unexpectedly refreshes or closes the tab, then the data fetched later is stale
// NOTE: This seems to be caused by liveTime being stale. We need to periodically update liveTime or something to mitigate this
const PlanWeave = () => {
	const { NavData } = usePlanWeavePage?.() || {}
	const { middleContentData, rightContentData } = NavData
	const dispatch = store.dispatch
	const router = useRouter()
	const { user, loading, error } = useSupabaseAuth()
	const taskList = tasksSelector()
	useRedirectIfUnauthorized(user, loading)
	useEffect(() => {
		if (user && taskList?.length === 0) {
			(async () => dispatch(initialTaskUpdate({ taskList: await fetchTasksFromSupabase() })))()
			dispatch(setUserID(user?.id))
		}
	}, [user, taskList?.length, dispatch])
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