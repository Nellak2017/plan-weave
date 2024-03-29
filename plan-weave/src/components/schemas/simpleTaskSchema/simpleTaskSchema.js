import * as Yup from 'yup'
import { TASK_STATUSES } from '../../utils/constants'

const timestamp = Math.floor((new Date()).getTime() / 1000)
const isoStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3}Z|[+-]\d{2}:\d{2})$/
const twelve = new Date(new Date().setHours(12, 0, 0, 0))

// This schema is for the Simple Task

/**
 * Schema for a simple task with validation rules.
 * @typedef {Object} SimpleTaskSchema
 * @property {Yup.StringSchema} task - Validation schema for the task name.
 * @property {Yup.NumberSchema} waste - Validation schema for the waste value.
 * @property {Yup.NumberSchema} ttc - Validation schema for the time-to-complete value.
 * @property {Yup.StringSchema} eta - Validation schema for the estimated time of arrival.
 * @property {Yup.NumberSchema} id - Validation schema for the task ID.
 * @property {Yup.StringSchema} status - Validation schema for the task status.
 * @property {Yup.NumberSchema} timeStamp - Validation schema for the usual timestamp.
 * @property {Yup.NumberSchema} completedTimeStamp - Validation schema for the completed timestamp.
 * @property {Yup.BooleanSchema} hidden - Validation schema for the hidden flag.
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
		.default('')
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null) {
				return ' '
			}
			return value
		}),
	waste: Yup.number()
		.nullable(false)
		//.min(0.01)
		.default(0)
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null) {
				return 0
			}
			return value
		}),
	ttc: Yup.number()
		.typeError('TTC must be a number')
		.min(0.01)
		.default(1)
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null || originalValue <= .01) {
				return 1
			}
			return value
		}),
	/*
	eta: Yup.string()
		.matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid HH:MM format')
		.default('12:00')
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null) {
				return '12:00'
			}
			return value
		}),
	*/
	/*
	eta: Yup.date()
		.typeError('Eta must be a Date object')
		.default(twelve)
		.transform((value, originalValue) => {
			if (!originalValue) return twelve 
			else if (typeof originalValue === 'number') return new Date(value * 1000) // transform epoch to date  
			return value
		}),
	*/
	eta: Yup.string()
		.typeError('Eta must be a valid ISO string')
		.matches(isoStringRegex, 'Eta must be a valid ISO String, it failed the regex test')
		.default(() => twelve.toISOString()) 
		.transform((value, originalValue) => {
			if (!originalValue) return twelve.toISOString()
			else if (typeof originalValue === 'number') {
				const date = new Date(originalValue * 1000)
				return date.toISOString()
			}
			return value
		}),
	id: Yup.number().positive('Id must be greater than 0').required('Id is required'),
	status: Yup.string()
		.oneOf(Object.values(TASK_STATUSES), 'Invalid status value').default(TASK_STATUSES.INCOMPLETE),
	timestamp: Yup.number().positive('Normal Timestamp must be a positive number').default(1),
	completedTimeStamp: Yup.number().positive('Completed Timestamp must be a positive number').default(1),
	hidden: Yup.boolean().default(false)
		.transform((value, originalValue) => {
			if ((originalValue !== false && !originalValue) || (originalValue !== true && originalValue)) return ''
			else return value
		}),
}).default({})

/**
 * Fill default values for a simple task, optionally overridden by provided object.
 * @type {FillDefaultsForSimpleTask}
 */
export const fillDefaultsForSimpleTask = (obj) => {
	const objWithDefaults = {
		task: ' ',
		waste: 1,
		ttc: 1,
		eta: twelve.toISOString(),
		id: new Date().getTime(),
		status: TASK_STATUSES.INCOMPLETE,
		timestamp: timestamp,
		completedTimeStamp: timestamp + 1,
		hidden: false,
		...obj,
	}

	return objWithDefaults
}