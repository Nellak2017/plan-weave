/* eslint-disable max-lines */
// File dedicated solely to schema related functions
import * as Yup from 'yup'

// ------ Schema Coercion helpers
// --- Predicates
export const isDictionary = val => Object.prototype.toString.call(val) === '[object Object]'
export const isIterable = val => (val !== undefined && val !== null && typeof val !== 'string' && typeof val[Symbol.iterator] === 'function') || isDictionary(val)
export const isNode = schema => Boolean(schema && (['string', 'number', 'boolean', 'date'].includes(schema.type))) // || (schema.type === 'array' && !schema.innerType?.fields)
// (any, Yup schema) => { isValid: bool, error: string }
export const isInputValid = (input, schema) => {
	try {
		schema.validateSync(input, { strict: true, abortEarly: true, recursive: true })
		const extraFields = typeof input !== 'object' || typeof schema.fields !== 'object'
			? [] : Object.keys(input).filter(field => !Object.keys(schema.fields).includes(field))
		return (extraFields.length > 0)
			? { isValid: false, error: `Extra fields present in input: ${extraFields.join(', ')}.`}
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
			? Array.isArray(value) ? 'array' : 'null'
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
		const currentSchema = Yup.reach(schema, path.join('.')) // TODO: Revert back to non-yup reach version, turns out I didn't need this way..
		const { isValid, error } = isInputValid(currentInput, currentSchema) // see if it is valid (works for nodes and shallow non-nodes)
		const isArrDict = Boolean(currentSchema.type === 'array' && currentSchema.innerType.fields)
		const isDictOrArrDict = Boolean(currentSchema.type === 'object' || isArrDict || currentSchema.type === 'array') // NOTE: Added currentSchema.type === 'array' untested
		// TODO: Remove hacky epicycle solution corrections added here and discover the general elegant solution.. 
		// TODO: Fix Cyclomatic complexity!
		if (isNode(currentSchema)) return processNodes({ currentInput, currentSchema, isValid, errors, error, output, path, errProcessor: processErrors })
		if (Array.isArray(input) && isValid && input.length === 0) return { output: input, errors } // To make the test case pass f([], array schema) = []
		if (!Array.isArray(currentInput) && isArrDict) return { output: reachUpdate(output, path, []), errors: processErrors([...errors, error])}  // to make f(default task, fullTasksSchema) = {output: [], errors: [1+]} pass
		const iter = Array.from(makeIterable(isArrDict ? currentSchema.innerType.fields : currentSchema?.fields ? currentSchema.fields : (currentInput ?? [])?.map((el, i) => [i, currentSchema.innerType])))
		if (isDictOrArrDict) return iter
			.reduce(({ output, errors }, [key, fieldSchema]) => {
				const newPath = [...path, key]
				// If it is an array, we have to loop over all elements in the array and apply the function recursively
				// if you are an array that has only primitives, then loop over it verifying each passes to the currentSchema and if not simply remove it
				if (currentSchema && currentSchema?.innerType && !currentSchema?.innerType?.fields) { // Number(newPath[newPath.length - 1]) === 0 && 
					const filteredPrimitiveArray = Array.from(makeIterable(currentInput)).filter(el => isInputValid(el, currentSchema.innerType).isValid)
					const theOutput = reachUpdate(output, path, filteredPrimitiveArray) // TODO: Revise the casting logic for arrays of primitives..
					//return dfsFns.dfs({ input:theInput, schema, output: theOutput, path: newPath, errors }) // was schema: fieldSchema
					return { output: theOutput, errors }
				}
				if (isArrDict) {
					return (Array.isArray(currentInput) ? currentInput : []).reduce(({ output, errors }, _, index) => {
							const elementPath = [...newPath.slice(0, -1), index.toString(), newPath[newPath.length - 1]]
							return dfsFns.dfs({ input, schema, output, path: elementPath, errors }) // was schema: fieldSchema
						}, { output, errors })
				}
				return dfsFns.dfs({ input, schema, output, path: newPath, errors }) // was schema: fieldSchema
			}, { output: reachUpdate(output, path, isArrDict ? [{}] : currentSchema.type === 'object' ? {} : []), errors: processErrors([...errors, error]) }) // isArrDict ? [{}] : {}
		return { output, errors: [...errors, { message: `Schema type '${currentSchema?.type}' is not supported` }] }
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