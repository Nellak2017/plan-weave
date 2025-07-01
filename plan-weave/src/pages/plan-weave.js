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
	}, [user])

	// TODO: There is a code smell associated with how I implemented the Nav slots. Something about it is off. Investigate to improve abstraction.
	return loading || error || !user
		? <LoadingOrError loading={loading} error={error} user={user} />
		: (
			<>
				<Nav slots={{
					left: <LeftContent />,
					middle: <MiddleContent state={middleContentData()} />,
					right: <RightContent state={rightContentData({ router, handleLogout })} />
				}} />
				<TaskEditor />
			</>
		)
}
export default PlanWeave