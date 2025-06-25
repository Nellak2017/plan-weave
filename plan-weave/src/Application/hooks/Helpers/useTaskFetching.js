import { useEffect, useCallback } from "react"

// TODO: use or remove, this is not currently used!
export const useTaskFetching = ({ user, serialize, dispatch, taskFetcher, taskUpdateReducer, userIDReducer }) => {
	const fetchTasks = useCallback(async (userId, serialize) => {
		const tasks = await taskFetcher(userId, serialize)
		dispatch(taskUpdateReducer(tasks))
	}, [dispatch, taskFetcher, taskUpdateReducer])
	useEffect(() => {
		if (user) {
			const userID = user?.uid
			fetchTasks(userID, serialize)
			dispatch(userIDReducer(userID))
		}
	}, [dispatch, fetchTasks, serialize, taskUpdateReducer, user, userIDReducer])
}