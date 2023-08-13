import * as Yup from 'yup'
import { TASK_STATUSES, STATUS_COLORS } from '../../utils/constants'

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
	eta: Yup.string()
		.matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid HH:MM format')
		.default('12:00')
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null) {
				return '12:00'
			}
			return value
		}),
	id: Yup.number().positive('Id must be greater than 0').required('Id is required'),
	status: Yup.string()
		.oneOf(Object.values(TASK_STATUSES), 'Invalid status value')
}).default({})

// NOTE: Avoid using default id, as it will not be unique
export const fillDefaultsForSimpleTask = (obj) => {
	const objWithDefaults = {
		task: 'Example task',
		waste: 1,
		ttc: 1,
		eta: '12:00',
		id: 1,
		status: TASK_STATUSES.INCOMPLETE,
		...obj,
	}

	return objWithDefaults
}