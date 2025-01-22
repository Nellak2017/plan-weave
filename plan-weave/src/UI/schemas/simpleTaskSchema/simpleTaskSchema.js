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

// NOTE: transform methods not used since schema coercion function does that due to valid default being defined
// NOTE: if all defaults defined and conform to schema then the schema is valid
// NOTE: if .required() is not specified, the coercion will result in undefined for that field
// .required() and valid default is defined for all fields so that the coercion function will guarantee a valid and data integrity preserved output 
// TODO: Test if .nullable(false) is required for all or not
export const simpleTaskSchema = Yup.object({
	task: Yup.string()
		.max(50, 'Task must be at most 50 characters')
		.required()
		.default(' '),
	waste: Yup.number()
		.nullable(false)
		.required()
		.default(0),
	ttc: Yup.number()
		.typeError('TTC must be a number')
		.min(0.01)
		.required()
		.default(1),
	eta: Yup.string()
		.typeError('Eta must be a valid ISO string')
		.matches(isoStringRegex, 'Eta must be a valid ISO String, it failed the regex test')
		.required()
		.default(() => twelve.toISOString()),
	id: Yup.number()
		.positive('Id must be greater than 0')
		.required('Id is required')
		.default(1),
	status: Yup.string()
		.oneOf(Object.values(TASK_STATUSES), 'Invalid status value')
		.required()
		.default(TASK_STATUSES.INCOMPLETE),
	timestamp: Yup.number()
		.positive('Normal Timestamp must be a positive number')
		.required()
		.default(1),
	completedTimeStamp: Yup.number()
		.positive('Completed Timestamp must be a positive number')
		.required()
		.default(1),
	hidden: Yup.boolean()
		.required()
		.default(false)
}).default({})

export const simpleTasksSchema = Yup.array().of(simpleTaskSchema)

/**
 * Fills in default values for a simple task object, allowing overrides with provided values.
 *
 * This function provides default values for each property of a simple task. If any properties are 
 * provided in the input object, those will override the default values. This is useful for ensuring 
 * that all required properties have a valid value and that any provided values are merged correctly 
 * with defaults.
 *
 * @param {Partial<SimpleTaskSchema>} obj - An object containing properties that may override the defaults.
 *   - `task` (string): The name of the task. Defaults to a single space.
 *   - `waste` (number): The waste value associated with the task. Defaults to 1.
 *   - `ttc` (number): The time-to-complete value. Defaults to 1.
 *   - `eta` (string): The estimated time of arrival in ISO string format. Defaults to noon of the current day.
 *   - `id` (number): The unique identifier for the task. Defaults to the current timestamp.
 *   - `status` (string): The status of the task. Defaults to `TASK_STATUSES.INCOMPLETE`.
 *   - `timestamp` (number): The usual timestamp. Defaults to the current timestamp.
 *   - `completedTimeStamp` (number): The timestamp when the task was completed. Defaults to the current timestamp plus 1.
 *   - `hidden` (boolean): A flag indicating whether the task is hidden. Defaults to `false`.
 *
 * @returns {SimpleTaskSchema} An object representing the task with default values applied and any 
 *   provided values merged in.
 */
export const fillDefaultsForSimpleTask = obj => ({
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
})