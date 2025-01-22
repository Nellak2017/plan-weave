import { getFirestore, collection, setDoc, query, doc, getDocs, deleteDoc } from 'firebase/firestore'
import { fillDefaults } from '../src/UI/schemas/taskSchema/taskSchema.js'
import app from '../firebase/config.js'
import { toast } from 'react-toastify'
import { DEV } from '../src/UI/utils/constants.js'

const db = getFirestore(app)

const getTaskCollection = userId => `users/${userId}/tasks`

export async function fetchTasksFromFirebase(userId, serialize = x => x) {
	if (!userId) {
		console.error("Can't fetch tasks without a userId defined")
		toast.error('Failed to fetch tasks')
		return
	}

	try {
		const TaskCollection = getTaskCollection(userId)
		const tasksQuery = query(collection(db, TaskCollection))
		const tasksSnapshot = await getDocs(tasksQuery)
		const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
		return serialize(tasks)
	} catch (e) {
		console.error(e)
		toast.error('Failed to fetch tasks')
	}
}

export async function addTask(task, userId) {
	// TODO: Add Task schema verification here too
	if ((!task || !userId)) {
		if (DEV) {
			console.error('Invalid task or userId when trying to add tasks. Failed to add tasks to Firebase.')
			toast.error('Failed to add tasks to database, your tasks will not persist after refresh')
		}
		return
	}
	try {
		const TaskCollection = getTaskCollection(userId)
		const taskDocRef = doc(db, TaskCollection, task.id.toString()) // Assuming task.id is a number
		await setDoc(taskDocRef, fillDefaults(task))
	} catch (e) {
		console.error(e)
		toast.error('Failed to add tasks')
	}
}
// TODO: Refactor this to eliminate the add/update task function redundancy
export async function updateTask(updatedTask, userId) {
	if (!updatedTask || !userId) {
		console.error('Invalid updated task or userId when trying to update task. Failed to update task')
		toast.error('Failed to update task')
		throw new Error('Invalid updated task or userId when trying to update task. Failed to update task')
	}
	try {
		const TaskCollection = getTaskCollection(userId)
		const taskDocRef = doc(db, TaskCollection, updatedTask.id.toString()) // Assuming task.id is a number
		await setDoc(taskDocRef, fillDefaults(updatedTask))
	} catch (e) {
		console.error(e)
		toast.error('Failed to update task')
	}
}

// accepts taskIds array or singular taskId
export async function deleteTasks(taskIds, userId) {
	if (!taskIds || !userId) {
		console.error('Invalid taskIds or userId when trying to delete tasks. Failed to delete tasks')
		toast.error('Failed to delete tasks')
		throw new Error('Invalid taskIds or userId when trying to delete tasks. Failed to delete tasks')
	}

	try {
		const TaskCollection = getTaskCollection(userId)
		const taskIdsArray = Array.isArray(taskIds) ? taskIds : [taskIds]

		// Use Promise.all to delete multiple tasks concurrently
		await Promise.all(
			taskIdsArray.map(async (taskId) => {
				const taskDocRef = doc(db, TaskCollection, taskId.toString())
				await deleteDoc(taskDocRef)
			})
		)
	} catch (e) {
		console.error(e)
		toast.error('Failed to delete tasks')
	}
}

// Converts tasks from Firebase version to Redux version
// Was messing with Firebase timestamps, now just uses numbers
export function serialize(tasks) {
	const processedTasks = tasks?.map(task => {
		return {
			...task
		}
	})
	return processedTasks
}