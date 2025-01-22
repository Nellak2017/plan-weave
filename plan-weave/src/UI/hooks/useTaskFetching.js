import { useEffect, useCallback } from "react"

export const useTaskFetching = ({ user, serialize, dispatch, taskFetcher, taskUpdateReducer, userIdReducer }) => {
	const fetchTasks = useCallback(async (userId, serialize) => {
		const tasks = await taskFetcher(userId, serialize)
		dispatch(taskUpdateReducer(tasks))
	}, [dispatch, taskFetcher, taskUpdateReducer])
	useEffect(() => {
		if (user) {
			const userId = user?.uid
			fetchTasks(userId, serialize)
			dispatch(userIdReducer(userId))
		}
	}, [dispatch, fetchTasks, serialize, taskUpdateReducer, user, userIdReducer])
}