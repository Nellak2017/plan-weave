import * as Yup from 'yup'

// This schema is for the Simple Task

/* 
Legend: 

task,
waste,
ttc,
eta,
id
*/

export const simpleTaskSchema = Yup.object({
	task: Yup.string()
		.max(50, 'Task must be at most 50 characters')
		.default('Example task')
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null) {
				return 'Example task'
			}
			return value
		}),
	waste: Yup.number()
		.nullable(false)
		.min(0.01)
		.default(1)
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null) {
				return 1
			}
			return value
		}),
	ttc: Yup.number()
		.typeError('TTC must be a number')
		.min(0.01)
		.default(1)
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null) {
				return 1
			}
			return value
		}),
	eta: Yup.number()
		.nullable(false)
		.min(0.01)
		.default(1)
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null) {
				return 1
			}
			return value
		}),
	id: Yup.number().positive('Id must be greater than 0').required('Id is required'),
}).default({})

// NOTE: Avoid using default id, as it will not be unique
export const fillDefaultsForSimpleTask = (obj) => {
	const objWithDefaults = {
		task: 'Example task',
		waste: 1,
		ttc: 1,
		eta: 1,
		id: 1,
		...obj,
	}

	return objWithDefaults
}