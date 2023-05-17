import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { fillDefaults } from '../src/components/schemas/taskSchema/taskSchema.js'
import app from '../firebase/config.js'

const db = getFirestore(app)

const TaskCollection = 'tasks'

export async function addTask(task) {
	await addDoc(collection(db, TaskCollection), fillDefaults(task))
}