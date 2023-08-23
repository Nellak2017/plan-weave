import { useEffect, useState } from 'react'
import { toast } from 'react-toastify' // You might need to import the appropriate toast library here
import { pureTaskAttributeUpdate } from '../components/utils/helpers.js'
import { simpleTaskSchema, fillDefaultsForSimpleTask } from '../components/schemas/simpleTaskSchema/simpleTaskSchema.js'

/**
 * Custom hook to validate tasks and correct invalid ones. Only meant to update view of tasks, not redux store. 
 * @param {Array} taskList - The list of tasks to validate.
 * @returns {void}
 */
// TODO: This may be inefficient, analyze for efficiency later
const useValidateTasks = ({ taskList, callback = () => { }, schema = simpleTaskSchema, fillDefaults = fillDefaultsForSimpleTask }) => {
	const [tasks, setTasks] = useState(taskList)
	const [invalidMessage, setInvalidMessage] = useState('')
	useEffect(() => {
		(() => {
			if (!taskList) {
				console.error('There seems to be no taskList defined')
				toast.error(
					'Your Tasks are messed up and things might not display right. Check Dev Tools for more info.'
				)
				return // get out of here early
			}
			const updatedTaskList = [...taskList]
			for (let idx in taskList) {
				try {
					const updatedTask = pureTaskAttributeUpdate({
						index: idx,
						attribute: 'id',
						value: taskList[idx]['id'],
						taskList,
						schema: schema,
						schemaDefaultFx: fillDefaults,
					})
					updatedTaskList[idx] = updatedTask[idx]
				} catch (updateError) {
					console.log(updateError.message)
					setInvalidMessage(updateError.message)
				}
				// Assuming setTaskList is a state update function
				setTasks(updatedTaskList)
				callback(updatedTaskList)
			}
		})()
	}, [])
	if (invalidMessage !== '') {
		console.error(invalidMessage)
		toast.error(
			'Your Tasks are messed up and things might not display right. Check Dev Tools for more info.'
		)
	}
	return tasks
}

export default useValidateTasks