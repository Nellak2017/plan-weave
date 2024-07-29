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
	// eslint-disable-next-line complexity
	dfs: ({ input, schema, output = undefined, path = [], errors = [], reachGet = dfsFns.reachGet, reachUpdate = dfsFns.reachUpdate, processErrors = dfsFns.processErrors, processNodes = dfsFns.processNodes }) => {
		const currentInput = reachGet(input, path)
		const { isValid, error } = isInputValid(currentInput, schema) // see if it is valid (works for nodes and shallow non-nodes)
		const isArrDict = Boolean(schema.type === 'array' && schema.innerType.fields)
		const isDictOrArrDict = Boolean(schema.type === 'object' || isArrDict)
		if (isNode(schema)) return processNodes({ currentInput, currentSchema: schema, isValid, errors, error, output, path, errProcessor: processErrors })
		if (isDictOrArrDict && isValid) return { output: input, errors: dfsFns.processErrors(errors)} // TODO: Simplify and test. This line is sus. Also remove eslint disable complexity comment
		const iter = Array.from(makeIterable(isArrDict ? schema.innerType.fields : schema.fields))
		if (isDictOrArrDict) return iter
			.reduce(({ output, errors }, [key, fieldSchema]) => {
				const newPath = [...path, key]
				// If it is an array, we have to loop over all elements in the array and apply the function recursively
				if (isArrDict) {
					return currentInput.reduce(({ output, errors }, _, index) => {
						const elementPath = [...newPath.slice(0, -1), index.toString(), newPath[newPath.length - 1]]
						return dfsFns.dfs({ input, schema: fieldSchema, output, path: elementPath, errors})
					}, { output, errors })
				}
				return dfsFns.dfs({ input, schema: fieldSchema, output, path: newPath, errors })
			}, { output: reachUpdate(output, path, isArrDict ? [{}] : {}), errors: processErrors([...errors, error]) }) // isArrDict ? [{}] : {}
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
const timestamp = Math.floor((new Date()).getTime() / 1000)
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
		.default(false)
}).default({})
const taskSchema = Yup.object({
	...simpleTaskSchema.fields,
	// --- Full Task Exclusives
	efficiency: Yup.number() // Percentage as raw number. Ex: 1 = 100%
		.min(0)
		.max(86400)
		.required()
		.default(0),
	parentThread: Yup.string()
		.min(2, 'Parent Thread must be atleast 2 characters')
		.max(50, 'Parent Thread must be at most 50 characters')
		.required()
		.default(''),
	dueDate: Yup.string()
		.typeError('DueDate must be a valid ISO string')
		.matches(isoStringRegex, 'DueDate must be a valid ISO String, it failed the regex test')
		.required()
		.default(() => twelve.toISOString()),
	dependencies: Yup.array()
		.of(Yup.mixed())
		.required()
		.default([]),
	weight: Yup.number()
		.required()
		.min(0),
}).default({})

const fullTasksSchema = Yup.array().of(taskSchema)

const testData = [
	{
		"id": 1716861377766,
		"eta": "2024-07-10T02:27:46.993Z",
		"efficiency": 1330.049240776306,
		"ttc": 3,
		"completedTimeStamp": 1720578466.993,
		"timestamp": 1716687091,
		"dueDate": "2024-05-25T17:00:00.000Z",
		"parentThread": "default",
		"dependencies": [],
		"waste": -3.9975019444444446,
		"hidden": false,
		"task": "task 1",
		"status": "completed",
		"weight": 1
	},
	{
		"id": 1718143126427,
		"weight": 1,
		"hidden": false,
		"task": " ",
		"waste": 673.4899841666667,
		"parentThread": "default",
		"status": "completed",
		"ttc": 1,
		"completedTimeStamp": 1720578476.943,
		"dependencies": [],
		"efficiency": 0,
		"dueDate": "2024-06-11T17:00:00.000Z",
		"eta": "2024-07-10T02:27:56.943Z",
		"timestamp": 1718142843
	},
	{
		"id": 1720578472876,
		"hidden": false,
		"waste": 452.06042722222224,
		"status": "incomplete",
		"completedTimeStamp": 1720578382,
		"ttc": 1,
		"timestamp": 1720578381,
		"dependencies": [],
		"weight": 1,
		"task": " ",
		"parentThread": "default",
		"eta": 1720582066, // Invalid Eta
		"efficiency": 0,
		"dueDate": "2024-07-09T17:00:00.000Z"
	},
	{
		"id": 1720578475320,
		"efficiency": 0,
		"dueDate": "2024-07-09T17:00:00.000Z",
		"ttc": 1,
		"waste": 0,
		"hidden": false,
		"status": "incomplete",
		"eta": 1720585666, // Invalid Eta
		"dependencies": [],
		"completedTimeStamp": 1720578382,
		"task": " ",
		"timestamp": 1720578381,
		"weight": 1,
		"parentThread": "default"
	},
	{
		"id": 1720578478240,
		"efficiency": 0, 
		"eta": 1720589266, // Invalid Eta
		"dueDate": "2024-07-09T17:00:00.000Z",
		"parentThread": "default",
		"waste": 0,
		"ttc": 1,
		"status": "incomplete",
		"timestamp": 1720578381,
		"weight": 1,
		"dependencies": [],
		"task": " ",
		"completedTimeStamp": 1720578382,
		"hidden": false
	}
]

// console.log(isInputValid(testData, fullTasksSchema))
// console.log(coerceToSchema(testData, fullTasksSchema))