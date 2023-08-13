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

/**
 * Schema for a simple task with validation rules.
 * @typedef {Object} SimpleTaskSchema
 * @property {Yup.StringSchema} task - Validation schema for the task name.
 * @property {Yup.NumberSchema} waste - Validation schema for the waste value.
 * @property {Yup.NumberSchema} ttc - Validation schema for the time-to-complete value.
 * @property {Yup.StringSchema} eta - Validation schema for the estimated time of arrival.
 * @property {Yup.NumberSchema} id - Validation schema for the task ID.
 * @property {Yup.StringSchema} status - Validation schema for the task status.
 */

/**
 * Default values for a simple task, optionally overridden by provided object.
 * @callback FillDefaultsForSimpleTask
 * @param {Object} obj - Object with task properties to override defaults.
 * @returns {Object} Object with default or overridden task properties.
 */

/**
 * Validation schema for a simple task with default values and transformation logic.
 * @type {SimpleTaskSchema}
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
/**
 * Fill default values for a simple task, optionally overridden by provided object.
 * @type {FillDefaultsForSimpleTask}
 */
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