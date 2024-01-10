import { getFirestore, collection, addDoc, setDoc, query, doc, getDocs, where } from 'firebase/firestore'
import { fillDefaults } from '../src/components/schemas/taskSchema/taskSchema.js'
import app from '../firebase/config.js'
import { toast } from 'react-toastify'

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
	if (!task || !userId) {
		console.error('Invalid task or userId when trying to add tasks. Failed to add tasks')
		toast.error('Failed to add tasks')
		throw new Error('Invalid task or userId when trying to add tasks. Failed to add tasks')
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