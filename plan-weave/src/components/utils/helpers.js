import { fillDefaultsForSimpleTask, simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema'

// This file contains many helpers used through out the application

// This one is used to update an attribute of a task in a list of tasks in a pure way
export const pureTaskAttributeUpdate = async (
	index,
	attribute,
	value,
	taskList,
	schema = simpleTaskSchema,
	schemaDefaultFx = fillDefaultsForSimpleTask
) => {
	// Verify Inputs
	// ---
	if (isNaN(index) || index < 0 || index === null || index > taskList?.length || !attribute || !value || taskList === undefined || !schema || !schemaDefaultFx)
		throw new TypeError(
			`Atleast one of the arguments in pureTaskAttributeUpdate is undefined
				index : ${index}
				attribute : ${attribute}
				value : ${value}
				taskList : ${taskList}
				schema : ${schema}
				defaultFill : ${schemaDefaultFx}
				`)
	if (!taskList[index].hasOwnProperty(attribute)) throw new Error(`Entered Attribute is invalid. Attribute : ${attribute}. This is likely a programming bug.`)
	if (taskList.some(task => !task.id || task.id <= 0 || isNaN(task.id))) throw new TypeError('Atleast one id is undefined/null/invalid in your task list. This is likely a database error.')
	if (taskList.some((task, index) => taskList.findIndex(t => t.id === task.id) !== index)) throw new Error('Your Task list has multiple duplicate id values. This is likely a database error.')

	// Perform Function Transformation
	// ---

	const updatedTaskList = [...taskList]
	let updatedTask = { ...updatedTaskList[index] } // Clone the task

	// Function Transformation Helpers
	const validateTransformation = (task, customMessage = `Entered value is not valid. Value : ${value}. This is likely a programming bug.`) => {
		if (!schema.isValidSync(task)) throw new Error(customMessage)
	}

	// Try to update the given task in the list
	try {
		// Validate the task and strip unknown fields
		updatedTask = await schema.validate(updatedTask, { abortEarly: false, stripUnknown: true })

		// Case 1: Task is valid, but maybe has missing/extra fields 
		updatedTask[attribute] = value
		updatedTask = schemaDefaultFx(updatedTask) // fill defaults if there is other undefined attributes too
		validateTransformation(updatedTask)

	} catch (validationError) {
		if (!updatedTask.id) {
			// Case 2: Task is missing an id. Display errors and warnings
			throw new Error('Id is not defined, so it will lead to unexpected display results. This is likely a database error.')
		} else {
			// Case 3: Task is invalid but has a valid id
			// Iterate through fields and apply defaults to invalid ones, or delete it if it isn't in the attribute list
			Object.keys(updatedTask).forEach(field => {
				if (!schema?.fields[field]?.isValidSync(updatedTask[field])) { 
					if (schema?.fields[field]) updatedTask[field] = schema?.fields[field]?.default()
					else delete updatedTask[field]
				}
			})

			// If the entered attribute is valid, then update it
			if (updatedTask.hasOwnProperty(attribute)) {
				updatedTask[attribute] = value
				updatedTask = schemaDefaultFx(updatedTask) // fill defaults if there is other undefined attributes too
			}
			validateTransformation(updatedTask)
		}
	}
	updatedTaskList[index] = updatedTask
	return updatedTaskList
}