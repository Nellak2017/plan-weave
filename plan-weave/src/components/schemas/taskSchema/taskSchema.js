import * as Yup from 'yup'
import { TASK_STATUSES } from '../../utils/constants.js'
import { simpleTaskSchema } from '../simpleTaskSchema/simpleTaskSchema.js'

const timestamp = Math.floor((new Date()).getTime() / 1000)
const isoStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3}Z|[+-]\d{2}:\d{2})$/
const twelve = new Date(new Date().setHours(12, 0, 0, 0))

/**
 * Schema for a full task with validation rules.
 * @typedef {Object} TaskSchema
 * @property {Yup.StringSchema} task - Validation schema for the task name.
 * @property {Yup.NumberSchema} waste - Validation schema for the waste value.
 * @property {Yup.NumberSchema} ttc - Validation schema for the time-to-complete value.
 * @property {Yup.StringSchema} eta - Validation schema for the estimated time of arrival.
 * @property {Yup.NumberSchema} id - Validation schema for the task ID.
 * @property {Yup.StringSchema} status - Validation schema for the task status.
 * @property {Yup.NumberSchema} timeStamp - Validation schema for the usual timestamp.
 * @property {Yup.NumberSchema} completedTimeStamp - Validation schema for the completed timestamp.
 * @property {Yup.BooleanSchema} hidden - Validation schema for the hidden flag.
 * 
 * @property {Yup.NumberSchema} efficiency - Validation schema for the efficiency percentage.
 * @property {Yup.StringSchema} parentThread - Validation schema for the parentThread string.
 * @property {Yup.StringSchema} dueDate - Validation schema for the due date.
 * @property {Yup.ArraySchema} dependencies - Validation schema for the dependency list.
 * @property {Yup.NumberSchema} weight - Validation schema for the weight value.
 */

export const taskSchema = Yup.object({
	...simpleTaskSchema.fields,
	// --- Full Task Exclusives
	efficiency: Yup.number() // percentage
		.default(0)
		.min(0)
		.max(100),
	parentThread: Yup.string()
		.max(50, 'Parent Thread must be at most 50 characters')
		.default('')
		.transform((value, originalValue) => {
			if (originalValue === '' || originalValue === null) {
				return ' '
			}
			return value
		}),
	dueDate: Yup.string()
		.typeError('DueDate must be a valid ISO string')
		.matches(isoStringRegex, 'DueDate must be a valid ISO String, it failed the regex test')
		.default(() => twelve.toISOString())
		.transform((value, originalValue) => {
			if (!originalValue) return twelve.toISOString()
			else if (typeof originalValue === 'number') {
				const date = new Date(originalValue * 1000)
				return date.toISOString()
			}
			return value
		}),
	dependencies: Yup.array()
		.of(Yup.lazy((value) => {
			if (!value) {
				return Yup.mixed().nullable()
			}
			return taskSchema
		}))
		.default([]),
	weight: Yup.number()
		.min(0),
}).default({})


/**
 * Fill default values for a simple task, optionally overridden by provided object.
 * @type {FillDefaults}
 */
export const fillDefaults = (obj) => {
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

		efficiency: 0,
		parentThread: 'default',
		dueDate: twelve.toISOString(),
		dependencies: [],
		weight: 1, // Idk what value range for this to be honest
		...obj,
	}

	return objWithDefaults
}