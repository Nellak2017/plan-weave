import { useEffect, useState } from 'react'
import { toast } from 'react-toastify' // You might need to import the appropriate toast library here
import { pureTaskAttributeUpdate } from '../components/utils/helpers.js'
import { simpleTaskSchema, fillDefaultsForSimpleTask } from '../components/schemas/simpleTaskSchema/simpleTaskSchema.js'

// TODO: Possibly remove this, it may be extra

/**
 * Custom hook to validate tasks and correct invalid ones. Only meant to update view of tasks, not redux store. 
 * @param {Object} task - The task to validate.
 * @returns {void}
 */
const useValidateTask = ({ task, callback = () => {}, schema = simpleTaskSchema, fillDefaults = fillDefaultsForSimpleTask }) => {
	const [newTask, setNewTask] = useState(task)
	useEffect(() => {
		const validateTask = async () => {
			if (task) {
				const ret = [task]
				try {
					const updatedTask = await pureTaskAttributeUpdate({
						index: 0,
						attribute: 'id',
						value: task.id,
						taskList: ret,
						schema: schema,
						schemaDefaultFx: fillDefaults,
					})
					ret[0] = updatedTask[0]
				} catch (updateError) {
					console.error(updateError.message)
					toast.error(
						'Your Tasks are messed up and things might not display right. Check Dev Tools for more info.'
					)
				}
				// Assuming setTaskList is a state update function
				setNewTask(ret[0])
				callback(ret[0])
			}
		}
		validateTask()
	}, [])
	console.log(newTask)
	return newTask
}

export default useValidateTask