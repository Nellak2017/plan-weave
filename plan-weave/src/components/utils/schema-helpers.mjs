/* eslint-disable max-lines */
// File dedicated solely to schema related functions
import * as Yup from 'yup'

// ------ Schema Coercion helpers
// --- Predicates
const isDictionary = val => Object.prototype.toString.call(val) === '[object Object]'
const isIterable = val => (val !== undefined && val !== null && typeof val !== 'string' && typeof val[Symbol.iterator] === 'function') || isDictionary(val)
const isNode = schema => (!schema || !schema?.type)
	? false
	: (schema.type === 'string' || schema.type === 'number' || schema.type === 'boolean' || schema.type === 'date')
// (any, Yup schema) => { isValid: bool, error: string }
const isInputValid = (input, schema) => {
	try {
		schema.validateSync(input, { strict: true, abortEarly: true })
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
		return { isValid: false, error: error.message || String(error) }
	}
}

// --- Others
const makeIterable = iterable => isIterable(iterable)
	? isDictionary(iterable)
		? Object.entries(iterable)[Symbol.iterator]()
		: iterable[Symbol.iterator]()
	: iterable
const coercionEdgeCases = (input, schema) => schema
	? { data: input, error: '' }
	: { data: input, error: 'No Schema provided, input data is unaffected by schema coercions.' }
// input: (data, schema with or without defaults)
// output: { data: input if no defaults else default for this schema, error: "No default set for provided schema. Input was returned unchanged." or "" if there is a default }
// NOTE: the limitation on this function is that it does not work on deeply nested objects, only shallow objects with 1 layer
// eslint-disable-next-line complexity
const getDefaultOrInput = (input, schema) => {
	const doesNotHaveDefault = typeof schema?.default !== 'function' || !schema.default()
	const schemaIsShallowObject = schema && typeof schema?.describe === 'function' && schema?.describe() && schema.describe().type === 'object'
	const hasUndefinedDefaults = schemaIsShallowObject && Object.values(schema.describe()?.default || [undefined]).some(field => field === undefined)
	if (hasUndefinedDefaults) return { data: input, error: `No default or an invalid default set for provided object schema. Input was returned unchanged.\nProvided default: ${JSON.stringify(schema?.describe()?.default)}` }
	return {
		data: doesNotHaveDefault
			? input
			: schema.default(),
		error: doesNotHaveDefault
			? "No default set for provided schema. Input was returned unchanged."
			: ""
	}
}

// --- Node Transformation Logic
const labels = { 'null': 0, 'undefined': 1, 'boolean': 2, 'number': 3, 'bigint': 4, 'string': 5, 'date': 6, 'mixed': 7 }
const rules = {
	d: (_, schema) => schema && schema?.default() ? schema?.default() : null, // d is for default. No default means null
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
	if (typeLabels[type] !== undefined) return typeLabels[type]
	if (input === null) return typeLabels['null']
	if (input instanceof Date) return typeLabels['date']
}
const getXY = (input, schema, typeLabels = labels) => [getLabelIndex(input), typeLabels[schema?.describe()?.type || undefined] || typeLabels['mixed']] // y value is the typelabel or mixed
const getTransform = (input, schema, matrix = transformationMatrix) => {
	const [x, y] = getXY(input, schema)
	return matrix[x][y]
}
const enhancedCastPrimitive = (input, schema) => getTransform(input, schema)(input, schema) // Returns expected casting for primitives only, not bullshit one only if default is defined. If no default then null.

// --- DFS

const reachGet = (input, path) => {
	const getValue = (obj, keys) => {
		if (!obj || keys.length === 0) return obj
		const [key, ...rest] = keys
		return obj !== null && obj !== undefined ? getValue(obj[key], rest) : undefined
	}
	return getValue(input, path)
}
const reachUpdate = (input, path, value) => {
	const updateValue = (obj, keys, val) => {
		if (keys.length === 0) return val
		const [key, ...rest] = keys
		obj[key] = updateValue(obj[key] !== null && obj[key] !== undefined ? obj[key] : Number.isInteger(rest[0]) ? [] : {}, rest, val)
		return obj
	}
	if (path.length === 0) return value
	return updateValue(input, path, value)
}


// MUTABLE Recursive function to traverse the schema and input data
// WARNING: This function is mutable meaning it may mutate the output variable passed in. Only use in a closure.
// schema => Schema at that point in the DFS.
// input => Data at that point in the DFS.
// errors => List of errors accumulated in DFS.
// output => Accumulated Output based on mutatating output
// eslint-disable-next-line complexity
const dfs = (input, schema, output = undefined, path = [], errors = []) => {
	const currentSchema = schema
	const currentInput = reachGet(input, path)
	const { isValid, error } = isInputValid(currentInput, currentSchema) // see if it is valid (works for nodes and non-nodes)
	if ((isNode(currentSchema) && isValid) || (!isNode(currentSchema) && isValid)) {
		return { output: reachUpdate(output, path, currentInput), errors }
	}
	if (isNode(currentSchema) && !isValid) {
		const castedValue = enhancedCastPrimitive(currentInput, currentSchema)
		return { output: reachUpdate(output, path, castedValue), errors: [...errors, error] }
	}

	if (currentSchema.type === 'object') {
		// eslint-disable-next-line no-param-reassign
		output = reachUpdate(output, path, {})
		// eslint-disable-next-line no-param-reassign
		errors = [...errors, error]
		const fields = currentSchema.fields // Assuming fields are iterable
		const iterable = makeIterable(fields)
		const entries = Array.from(iterable)
		entries.forEach(([key, fieldSchema]) => {
			const newPath = [...path, key] // is this always right??
			const { output: updatedOutput, errors: updatedErrors } = dfs(input, fieldSchema, output, newPath, errors) // Recursively call dfs
			// eslint-disable-next-line no-param-reassign
			output = updatedOutput
			// eslint-disable-next-line no-param-reassign
			errors = updatedErrors
		})
		return { output, errors }
	}

	// Array with nested dict
	// ex: schema.innerType.fields = [field1, field2, ...]
	if (currentSchema.type === 'array' && currentSchema.innerType.fields) {
		reachUpdate(output, path, []) // untested
		const fields = currentSchema.innerType.fields
		const iterable = makeIterable(fields)
		const entries = Array.from(iterable)
		entries.forEach(([key, fieldSchema]) => {
			const newPath = [...path, key]
			return dfs(input, fieldSchema, output, newPath, errors)
		})
	}

	// Array without nested dict
	if (currentSchema.type === 'array' && !currentSchema.innerType?.fields) {
		/*
		Arrays without dicts are a bit different than Objects. 
		You need to iterate through the _input_ and keep the schema fixed at path.
		*/
		reachUpdate(output, path, [])
		const inputFields = reachGet(input, path)
		const { isValid, error } = isInputValid(inputFields, currentSchema)
		const def = currentSchema.default
		if (!isValid) {
			reachUpdate(output, path, def || null)
			return { output, errors: [...errors, error] }
		}
		reachUpdate(output, path, inputFields)
		return { output, errors: [...errors, error] }
	}

	return { output, errors: [...errors, { message: `Schema type '${currentSchema?.type}' is not supported` }] }

	// Handle iterables (arrays/objects/other)
	// const iterable = makeIterable(input)
	// const entries = Array.from(iterable)

	// entries.forEach(([key, value]) => {
	// 	const itemPath = [...path, key]
	// 	return dfs(value, output, schema[key], itemPath, errors) // TODO: fix [schema[key], input passed, output] 
	// })

	// return { output, errors }
}

// --- Main Coercion function
/**
 * Coerces any input data to conform to the provided Yup schema.
 * It fills in defaults for missing fields, corrects invalid fields,
 * and leaves valid data unchanged. It also returns warnings
 * if any coercions occur.
 *
 * @param {Object} input - The data to be coerced.
 * @param {yup.ObjectSchema} schema - The Yup schema to coerce the data to.
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
 * console.log(result.data)
 * // Output: { name: 'John Doe', age: 0, email: 'no-reply@example.com' }
 *
 * console.log(result.warnings)
 * // Output: [
 * //   'Field age was invalid and was coerced to 0',
 * //   'Field email was missing and was set to no-reply@example.com'
 * // ]
 */
export const coerceToSchema = (input, schema) => {
	const edgeCasesErr = coercionEdgeCases(input, schema).error
	if (edgeCasesErr != '') return { output: input, errors: [edgeCasesErr] }
	return dfs(input, schema)
}

// --- Testing it out
const schema = Yup.object().shape({
	name: Yup.string().required().default('Default Name'),
	age: Yup.number().required().default(0),
	// preferences: Yup.object().shape({
	// 	likes: Yup.array().of(Yup.string()).required().default([]),
	// 	dislikes: Yup.array().of(Yup.string()).required().default([])
	// }).default({})
}).default({ name: 'Default Name', age: 0 }) // preferences: {}

const inputData = {
	name: "Alice",
	preferences: {
		likes: ["reading", "swimming"],
		//dislikes: ["loud music"]
	},
	age: 25,
}

const result = dfs(inputData, schema)
console.log(result)

// const temp = Yup.array().of(Yup.object().shape({ id: Yup.string() }))
// console.log(temp.type)
// console.log(temp.innerType?.fields)
// console.log(temp.type && !temp.innerType?.fields)