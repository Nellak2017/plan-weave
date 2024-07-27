/* eslint-disable max-lines */
// File dedicated solely to schema related functions
import * as Yup from 'yup'

// ------ Schema Coercion helpers
// --- Predicates
export const isDictionary = val => Object.prototype.toString.call(val) === '[object Object]'
export const isIterable = val => (val !== undefined && val !== null && typeof val !== 'string' && typeof val[Symbol.iterator] === 'function') || isDictionary(val)
export const isNode = schema => Boolean(schema && (['string', 'number', 'boolean', 'date'].includes(schema.type) || (schema.type === 'array' && !schema.innerType?.fields)))
// (any, Yup schema) => { isValid: bool, error: string }
export const isInputValid = (input, schema) => {
	try {
		schema.validateSync(input, { strict: true, abortEarly: true, recursive: true })
		// Check if there are extra fields in the input
		const extraFields = typeof input !== 'object' || typeof schema.fields !== 'object'
			? []
			: Object.keys(input).filter(field => !Object.keys(schema.fields).includes(field))
		return (extraFields.length > 0)
			? {
				isValid: false,
				error: `Extra fields present in input: ${extraFields.join(', ')}.`
			}
			: { isValid: true, error: '' }
	} catch (error) {
		return { isValid: false, error: error.message || String(error) } // was error.message
	}
}
// true if the input has the correct types for each field in the schema, false if the input is invalid against the schema
export const isValidFieldTypes = (schema, data) => {
	const getTypeString = value => {
		if (value instanceof Date) return 'date'
		if (typeof value === 'number' && Number.isNaN(value)) return 'NaN'
		return typeof value === 'object'
			? Array.isArray(value)
				? 'array'
				: 'null'
			: typeof value
	}

	const validateField = (fieldSchema, fieldValue) => (fieldSchema.type === 'array' || fieldSchema.type === 'object')
		? (fieldSchema.type === 'array')
			? Array.isArray(fieldValue) && fieldValue.every(item => validateField(fieldSchema.innerType, item))
			: (typeof fieldValue === 'object' && !Array.isArray(fieldValue))
			&& Object.keys(fieldSchema.fields).every(key => validateField(fieldSchema.fields[key], fieldValue?.[key]))
		: getTypeString(fieldValue) === fieldSchema.type

	// Special handling for array and primitive schemas
	return (schema.type === 'array' || !schema.fields)
		? schema.type === 'array'
			? data && Array.isArray(data) ? data.every(element => validateField(schema.innerType, element)) : false
			: getTypeString(data) === schema.type
		: Object.keys(schema.fields).every(key => validateField(schema.fields[key], data?.[key]))
}

// --- Others
export const makeIterable = iterable => isIterable(iterable)
	? isDictionary(iterable)
		? Object.entries(iterable)[Symbol.iterator]()
		: iterable[Symbol.iterator]()
	: iterable
const coercionEdgeCases = (input, schema) => schema && Yup.isSchema(schema) ? { data: input, error: '' } : { data: input, error: 'No Schema provided, input data is unaffected by schema coercions.' }

// --- Node Transformation Logic
const labels = { 'null': 0, 'undefined': 1, 'boolean': 2, 'number': 3, 'bigint': 4, 'string': 5, 'date': 6, 'mixed': 7 }
const typeDefaults = { 'null': null, 'undefined': undefined, 'boolean': false, 'number': 0, 'bigint': 0n, 'string': '', 'date': new Date(), 'array': [], 'object': {}, 'mixed': null }
const rules = {
	d: (_, schema) => schema && schema?.default() && !Yup.isSchema(schema?.default()) ? schema?.default() : schema?.type in typeDefaults ? typeDefaults[schema?.type] : null, // d is for default. No default means type default or null if unsupported type
	c: (input, schema) => {
		try {
			return schema.cast(input)
		} catch (e) {
			return rules.d(input, schema)
		}
	}, // c is for cast
	C: (input, schema) => isInputValid(input, schema).isValid ? rules.c(input, schema) : rules.d(input, schema), // C is for isValid Cast or default
	N: (_, __) => null, // N is for always null
	U: (_, __) => undefined, // U is for always undefined
	F: (_, __) => false, // F is for always false
	f: (input, schema) => rules.C(Boolean(input), schema), // f is for falsey
	B: (input, schema) => rules.C(Number(input), schema), // B is for Boolean conversion
	I: (input, schema) => rules.C(Number(input), schema), // I is for BigInt
	S: (input, schema) => rules.C(Number(input), schema), // S is for String and dealing with NaN on numbers
	s: (input, schema) => rules.C(String(input), schema), // s is for String and dealing with strings
	D: (input, schema) => rules.C(new Date(input), schema), // D is for Date
	M: (input, schema) => rules.d(input, schema), // I don't know how to handle mixed types yet.. TODO: Handle mixed types
}
const transformationMatrix = [
	//  null   undef.     bool   number   bigint   string     date     mixed
	[rules.N, rules.U, rules.F, rules.d, rules.d, rules.d, rules.d, rules.M],     // null
	[rules.N, rules.U, rules.F, rules.d, rules.d, rules.d, rules.d, rules.M],     // undefined
	[rules.N, rules.U, rules.C, rules.B, rules.B, rules.s, rules.D, rules.M],     // boolean
	[rules.N, rules.U, rules.f, rules.C, rules.d, rules.s, rules.D, rules.M],     // number
	[rules.N, rules.U, rules.f, rules.I, rules.C, rules.s, rules.d, rules.M],     // bigint
	[rules.N, rules.U, rules.f, rules.S, rules.S, rules.C, rules.D, rules.M],     // string
	[rules.N, rules.U, rules.f, rules.D, rules.D, rules.s, rules.C, rules.M],     // date
	[rules.M, rules.M, rules.M, rules.M, rules.M, rules.M, rules.M, rules.M],     // mixed
]
const getLabelIndex = (input, typeLabels = labels) => {
	const type = typeof input
	if (input === null) return typeLabels['null']
	if (Array.isArray(input)) return typeLabels['mixed']
	if (input instanceof Date) return typeLabels['date']
	if (typeLabels[type] !== undefined) return typeLabels[type]
	return typeLabels['mixed'] // default value
}
const getXY = (input, schema, typeLabels = labels) => [getLabelIndex(input), typeLabels[schema?.describe()?.type || undefined] || typeLabels['mixed']] // y value is the typelabel or mixed
const getTransform = (input, schema, matrix = transformationMatrix) => {
	const [x, y] = getXY(input, schema)
	const ret = matrix?.[x]?.[y] || rules.c
	return ret
}
const enhancedCastPrimitive = (input, schema) => getTransform(input, schema)(input, schema) // Returns expected casting for primitives only, not bullshit one only if default is defined. If no default then null.

// --- DFS

// Related dfs functions is in this object for readability
// Note: Main dfs function does not respect defaults for arrays with dicts nor objects
// Note: Mixed type is unsupported
// Note: Unsure why changing processNodes currentSchema to schema makes tests fail?
export const dfsFns = {
	reachGet: (input, path) => path.reduce((acc, key) => (!acc || key.length === 0) || (acc === null || acc === undefined)
		? (!acc || key.length === 0) ? acc : undefined
		: acc[key]
		, input)
	,
	reachUpdate: (input, path, value) => {
		const updateValue = (obj, keys, val) => {
			if (keys.length === 0) return val
			const [key, ...rest] = keys
			obj[key] = updateValue(obj[key] !== null && obj[key] !== undefined ? obj[key] : Number.isInteger(rest[0]) ? [] : {}, rest, val)
			return obj
		}
		return (path.length === 0)
			? value
			: updateValue(input, path, value)
	},
	processErrors: errs => Array.from(new Set(errs.filter(e => e.trim() !== ''))),
	processNodes: ({ currentInput, currentSchema, isValid, errors, error, output, path, errProcessor = dfsFns.processErrors, reachUpdate = dfsFns.reachUpdate }) => isValid
		? { output: reachUpdate(output, path, currentInput), errors: errProcessor(errors) }
		: { output: reachUpdate(output, path, enhancedCastPrimitive(currentInput, currentSchema)), errors: errProcessor([...errors, isInputValid(currentInput, currentSchema).error, error + ` at path: "${path.join('.')}", and it was coerced to ${enhancedCastPrimitive(currentInput, currentSchema)}`]) },
	dfs: ({ input, schema, output = undefined, path = [], errors = [], reachGet = dfsFns.reachGet, reachUpdate = dfsFns.reachUpdate, processErrors = dfsFns.processErrors, processNodes = dfsFns.processNodes }) => {
		const currentInput = reachGet(input, path)
		const { isValid, error } = isInputValid(currentInput, schema) // see if it is valid (works for nodes and shallow non-nodes)
		const isArrDict = schema.type === 'array' && schema.innerType.fields
		const isDictOrArrDict = schema.type === 'object' || isArrDict
		if (isNode(schema)) return processNodes({ currentInput, currentSchema: schema, isValid, errors, error, output, path, errProcessor: processErrors })
		if (isDictOrArrDict) return Array.from(makeIterable(isArrDict ? schema.innerType.fields : schema.fields))
			.reduce(({ output, errors }, [key, fieldSchema]) => {
				const newPath = [...path, key]
				return dfsFns.dfs({ input, schema: fieldSchema, output, path: isArrDict ? [...newPath.slice(0, -1), '0', newPath[newPath.length - 1]] : newPath, errors })
			}, { output: reachUpdate(output, path, isArrDict ? [{}] : {}), errors: processErrors([...errors, error]) })
		return { output, errors: [...errors, { message: `Schema type '${schema?.type}' is not supported` }] }
	}
}

// --- Main Coercion function
/**
 * Coerces any input data to try to conform to the provided Yup schema, and guarantees atleast proper typing and shape.
 * It fills in defaults for missing fields, corrects invalid fields,
 * and leaves valid data unchanged. It also returns warnings
 * if any coercions occur.
 *
 * @param {Object} input - The data to be coerced.
 * @param {Yup.ObjectSchema} schema - The Yup schema to coerce the data to.
 * @returns {Object} - The result containing coerced data and warnings.
 * @returns {Object} result.data - The coerced data conforming to the schema.
 * @returns {string[]} result.warnings - Warnings about any coercions that occurred.
 *
 * @example
 * // Define a Yup schema
 * const schema = yup.object().shape({
 *   name: yup.string().default('Anonymous'),
 *   age: yup.number().default(0),
 *   email: yup.string().email().default('no-reply@example.com')
 * })
 *
 * // Example input data
 * const data = {
 *   name: 'John Doe',
 *   age: 'invalid-age', // This is invalid
 *   // email is missing
 * }
 *
 * const result = coerceToSchema(data, schema)
 *
 * console.log(result.output)
 * // Output: { name: 'John Doe', age: 0, email: 'no-reply@example.com' }
 *
 * console.log(result.errors)
 * // Output: [
 * //   'Field age was invalid and was coerced to 0',
 * //   'Field email was missing and was set to no-reply@example.com'
 * // ]
 */
export const coerceToSchema = (input, schema) =>
	coercionEdgeCases(input, schema).error !== ''
		? { output: input, errors: [coercionEdgeCases(input, schema).error] }
		: dfsFns.dfs({ input, schema })

// ------------ Experimental area
const TASK_STATUSES = {
	COMPLETED: 'completed',
	INCOMPLETE: 'incomplete',
	WAITING: 'waiting',
	INCONSISTENT: 'inconsistent',
}
const isoStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3}Z|[+-]\d{2}:\d{2})$/
const twelve = new Date(new Date().setHours(12, 0, 0, 0))
const simpleTaskSchema = Yup.object({
	task: Yup.string()
		.max(50, 'Task must be at most 50 characters')
		.required()
		.default(''),
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
		.default(false), // NOTE: Yup does not respect boolean defaults!!!!
}).default({})

// 1. invalid schema, valid data
const validData1 = { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false }
//console.log(coerceToSchema(validData1, null))

// 2. invalid schema, invalid data
const invalidData1 = { "task": " ", "waste": Number.NaN, "ttc": 0.010999999940395355, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false }
//console.log(coerceToSchema(invalidData1, null))

// 3. valid schema, valid data
const validData3 = { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false }
//console.log(coerceToSchema(validData3, simpleTaskSchema))

// 4. valid schema, invalid task
const invalidTask = { "task": 1234, "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false }
//console.log(coerceToSchema(invalidTask, simpleTaskSchema))

// 5. valid schema, invalid waste
const invalidWaste = { "task": " ", "waste": "Foobar", "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false }
// console.log(coerceToSchema(invalidWaste, simpleTaskSchema))

// 6. valid schema, invalid ttc
const invalidTTC = { "task": " ", "waste": 0.01, "ttc": NaN, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false }
// console.log(coerceToSchema(invalidTTC, simpleTaskSchema))

// 7. valid schema, invalid eta
const invalidETA = { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": new Date(0), "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false }
// console.log(coerceToSchema(invalidETA , simpleTaskSchema))

// 8. valid schema, invalid id
const invalidID = { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": -100, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false }
// console.log(coerceToSchema(invalidID, simpleTaskSchema))

// 9. valid schema, invalid status
const invalidStatus = { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "pending", "timestamp": 1, "completedTimeStamp": 1, "hidden": false }
// console.log(coerceToSchema(invalidStatus, simpleTaskSchema))

// 10. valid schema, invalid timestamp
const invalidTimeStamp = { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": new Date(100), "completedTimeStamp": 1, "hidden": false }
// console.log(coerceToSchema(invalidTimeStamp, simpleTaskSchema))

// 11. valid schema, invalid completedTimeStamp
const invalidCompletedTimeStamp = { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": {}, "hidden": false }
// console.log(coerceToSchema(invalidCompletedTimeStamp, simpleTaskSchema))

// 12. valid schema, invalid hidden
const invalidHidden = { "hidden": [], "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1 }
// console.log(coerceToSchema(invalidHidden, simpleTaskSchema))

// 13. valid schema, invalid task+waste

// 14. valid schema, invalid task+ttc

// 15. valid schema, invalid task+eta

// 16. valid schema, invalid task+id

// 17. valid schema, invalid {}
// 18. valid schema, invalid null
// 19. valid schema, invalid NaN
// 20. valid schema, invalid 1234 
