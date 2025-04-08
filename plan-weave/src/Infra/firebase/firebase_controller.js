import { getFirestore, collection, setDoc, query, doc, getDocs, deleteDoc } from 'firebase/firestore'
import app from '../firebase/config.js'
import { toast } from 'react-toastify'
import { DEV } from '../../Core/utils/constants.js'

const db = getFirestore(app)
const getTaskCollection = userID => `users/${userID}/tasks`
export async function fetchTasksFromFirebase(userID, serialize = x => x) {
	if (!userID) {
		console.error("Can't fetch tasks without a userID defined")
		toast.error('Failed to fetch tasks')
		return
	}
	try {
		const TaskCollection = getTaskCollection(userID)
		const tasksQuery = query(collection(db, TaskCollection))
		const tasksSnapshot = await getDocs(tasksQuery)
		const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
		return serialize(tasks)
	} catch (e) {
		console.error(e)
		toast.error('Failed to fetch tasks')
	}
}

export async function addTask(task, userID) {
	if ((!task || !userID) && DEV) {
		console.error('Invalid task or userID when trying to add tasks. Failed to add tasks to Firebase.')
		toast.error('Failed to add tasks to database, your tasks will not persist after refresh')
	}
	if ((!task || !userID)) return
	try {
		const TaskCollection = getTaskCollection(userID)
		const taskDocRef = doc(db, TaskCollection, task.id.toString()) // Assuming task.id is a number
		await setDoc(taskDocRef, task)
	} catch (e) {
		console.error(e)
		toast.error('Failed to add tasks')
	}
}
// TODO: Refactor this to eliminate the add/update task function redundancy
export async function updateTask(updatedTask, userID) {
	if (!updatedTask || !userID) {
		console.error('Invalid updated task or userID when trying to update task. Failed to update task')
		toast.error('Failed to update task')
	}
	try {
		const TaskCollection = getTaskCollection(userID)
		const taskDocRef = doc(db, TaskCollection, updatedTask.id.toString()) // Assuming task.id is a number
		await setDoc(taskDocRef, updatedTask)
	} catch (e) {
		console.error(e)
		toast.error('Failed to update task')
	}
}
// accepts taskIds array or singular taskId
export async function deleteTasks(taskIds, userID) {
	if (!taskIds || !userID) {
		console.error('Invalid taskIds or userID when trying to delete tasks. Failed to delete tasks')
		toast.error('Failed to delete tasks')
	}
	try {
		const TaskCollection = getTaskCollection(userID)
		const taskIdsArray = Array.isArray(taskIds) ? taskIds : [taskIds]
		await Promise.all(taskIdsArray.map(async (taskId) => {
			const taskDocRef = doc(db, TaskCollection, taskId.toString())
			await deleteDoc(taskDocRef)
		})
		)
	} catch (e) {
		console.error(e)
		toast.error('Failed to delete tasks')
	}
}
// Converts tasks from Firebase version to Redux version. Was messing with Firebase timestamps, now just uses numbers
export const serialize = tasks => tasks?.map(task => ({ ...task }))