/* eslint-disable max-lines */
// File dedicated solely to schema related functions
import * as Yup from 'yup'
import fc from 'fast-check' // TODO: REMOVE

// ------ Schema Coercion helpers
// --- Predicates
export const isDictionary = val => Object.prototype.toString.call(val) === '[object Object]'
export const isIterable = val => (val !== undefined && val !== null && typeof val !== 'string' && typeof val[Symbol.iterator] === 'function') || isDictionary(val)
export const isNode = schema => (!schema || !schema?.type)
	? false
	: (schema.type === 'string' || schema.type === 'number' || schema.type === 'boolean' || schema.type === 'date' || (schema.type === 'array' && !schema.innerType?.fields))
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
		return { isValid: false, error: error.message || String(error) }
	}
}

// --- Others
export const makeIterable = iterable => isIterable(iterable)
	? isDictionary(iterable)
		? Object.entries(iterable)[Symbol.iterator]()
		: iterable[Symbol.iterator]()
	: iterable
const coercionEdgeCases = (input, schema) => schema
	? { data: input, error: '' }
	: { data: input, error: 'No Schema provided, input data is unaffected by schema coercions.' }

// --- Node Transformation Logic
const labels = { 'null': 0, 'undefined': 1, 'boolean': 2, 'number': 3, 'bigint': 4, 'string': 5, 'date': 6, 'mixed': 7 }
const typeDefaults = { 'null': null, 'undefined': undefined, 'boolean': false, 'number': 0, 'bigint': 0n, 'string': '', 'date': new Date(), 'array': [], 'object': {}, 'mixed': null }
const rules = {
	d: (_, schema) => schema && schema?.default() ? schema?.default() : schema?.type in typeDefaults ? typeDefaults[schema?.type] : null, // d is for default. No default means type default or null if unsupported type
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

// Related dfs functions is in this object for readability
// Note: Main dfs function does not respect defaults for arrays with dicts nor objects
// Note: Mixed type is unsupported
export const dfsFns = {
	reachGet: (input, path) => {
		const getValue = (obj, keys) => {
			if (!obj || keys.length === 0) return obj
			const [key, ...rest] = keys
			return obj !== null && obj !== undefined ? getValue(obj[key], rest) : undefined
		}
		return getValue(input, path)
	},
	reachUpdate: (input, path, value) => {
		const updateValue = (obj, keys, val) => {
			if (keys.length === 0) return val
			const [key, ...rest] = keys
			obj[key] = updateValue(obj[key] !== null && obj[key] !== undefined ? obj[key] : Number.isInteger(rest[0]) ? [] : {}, rest, val)
			return obj
		}
		if (path.length === 0) return value
		return updateValue(input, path, value)
	},
	processErrors: errs => Array.from(new Set(errs.filter(e => e.trim() !== ''))),
	processNodes: ({ currentInput, currentSchema, isValid, errors, error, output, path, errProcessor = dfsFns.processErrors, reachUpdate = dfsFns.reachUpdate }) => isValid
		? { output: reachUpdate(output, path, currentInput), errors: errProcessor(errors) }
		: { output: reachUpdate(output, path, enhancedCastPrimitive(currentInput, currentSchema)), errors: errProcessor([...errors, error + ` at path: "${path.join('.')}", and it was coerced to ${enhancedCastPrimitive(currentInput, currentSchema)}`]) },
	dfs: ({ input, schema, output = undefined, path = [], errors = [], reachGet = dfsFns.reachGet, reachUpdate = dfsFns.reachUpdate, processErrors = dfsFns.processErrors, processNodes = dfsFns.processNodes }) => {
		const currentSchema = schema
		const currentInput = reachGet(input, path)
		const { isValid, error } = isInputValid(currentInput, currentSchema) // see if it is valid (works for nodes and shallow non-nodes)
		const isArrDict = currentSchema.type === 'array' && currentSchema.innerType.fields
		const isDictOrArrDict = currentSchema.type === 'object' || isArrDict

		if (isNode(currentSchema)) return processNodes({ currentInput, currentSchema, isValid, errors, error, output, path, errProcessor: processErrors })
		if (isDictOrArrDict) return Array.from(makeIterable(isArrDict ? currentSchema.innerType.fields : currentSchema.fields))
			.reduce(({ output, errors }, [key, fieldSchema]) => {
				const newPath = [...path, key]
				const processedNewPath = isArrDict ? [...newPath.slice(0, -1), '0', newPath[newPath.length - 1]] : newPath
				const { output: nestedOutput, errors: nestedErrors } = dfsFns.dfs({ input, schema: fieldSchema, output, path: processedNewPath, errors })
				return {
					output: nestedOutput,
					errors: nestedErrors,
				}
			}, { output: reachUpdate(output, path, isArrDict ? [{}] : {}), errors: processErrors([...errors, error]) })

		return { output, errors: [...errors, { message: `Schema type '${currentSchema?.type}' is not supported` }] }
	}
}

// --- Main Coercion function
/**
 * Coerces any input data to conform to the provided Yup schema.
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
		? { output: input, errors: [edgeCasesErr] }
		: dfsFns.dfs({ input, schema })

// Will return true if the input has the correct types for each field in the schema
export const isValidFieldTypes = (schema, data) => {
	// const validateField = (fieldSchema, fieldValue) => (Array.isArray(fieldSchema._type) || fieldSchema._type === Object)
	// 	? Array.isArray(fieldSchema._type)
	// 		? Array.isArray(fieldValue) && fieldValue.every(item => validateField(fieldSchema._type[0], item))
	// 		: (typeof fieldValue === 'object' && !Array.isArray(fieldValue))
	// 		&& Object.keys(fieldSchema.fields).every(key => validateField(fieldSchema.fields[key], fieldValue[key]))
	// 	: typeof fieldValue === typeof fieldSchema.type

	const validateField = (fieldSchema, fieldValue) => {
		if (fieldSchema.type === 'array' || fieldSchema.type === 'object') {
			if (fieldSchema.type === 'array') {
				const isarr = Array.isArray(fieldValue)
				return isarr && fieldValue.every(item => validateField(fieldSchema.innerType, item))
			} else {
				const a = typeof fieldValue === 'object'
				const b = !Array.isArray(fieldValue)
				return (a && b)
					&& Object.keys(fieldSchema.fields).every(key => validateField(fieldSchema.fields[key], fieldValue[key]))
			}
		} else {
			const a = typeof fieldValue
			const b = fieldSchema.type
			return a === b
		}
	}
	// Special handling for primitive schemas
	if (!schema.fields) {
		return typeof data === schema.type
	}
	return Object.keys(schema.fields).every(key => validateField(schema.fields[key], data[key]))
}
// ------------ Experimental area

// Manual tests for isValidFieldTypes
const formatTest = (result, condition = true, testCase = 1) => {
	if (result === condition) {
		console.log('\x1b[32m%s\x1b[0m', `Test case ${testCase} sucessful.`)
	} else {
		console.error('\x1b[31m%s\x1b[0m', `Test case ${testCase} failed.`)
	}
}

const primitiveGenerators = {
	string: () => ({ schema: Yup.string(), data: fc.string() }),
	number: () => ({ schema: Yup.number(), data: fc.integer() }), // ints only
	boolean: () => ({ schema: Yup.boolean(), data: fc.boolean() }),
	date: () => ({ schema: Yup.date(), data: fc.date() })
}

const arrayGenerator = innerGenerator => ({
	schema: Yup.array().of(innerGenerator.schema),
	data: fc.array(innerGenerator.data),
})

const objectGeneratorTest = (fieldGenerators, maxLen = 4) => {
	// uniqueKeys, fieldEntries, schema+data
	const a = fc
		.uniqueArray(fc.constantFrom(...Object.keys(fieldGenerators)), { minLength: 1, maxLength: maxLen }) // unique 1..5 from primitiveGenerator keys. (if not unique it biases to small resultant obj)
	const b = a
		.map(keys => // {key1: data1, key2: data2, ...keyN: dataN}
			Object.fromEntries( // {key1: data1, key2: data2, ...keyN: dataN}
				keys.map(key => [key, fieldGenerators[key]()]) // [[key, data from arbitrary]]
			)
		)
	const c = b
		.map(fieldEntries => ({
			schema: Yup.object().shape(
				Object.fromEntries(
					Object.entries(fieldEntries)
						.map(([key, { schema }]) => [key, schema])
				)
			), // { [datatype]: schema }. Ex: { date: DateSchema..., boolean: BooleanSchema..., ...}
			data: fc.record(
				Object.fromEntries(
					Object.entries(fieldEntries)
						.map(([key, { data }]) => [key, data])
				)
			)
		}))
	return fc.sample(c, 1)[0] // { schema: concrete schema, data: arbitrary } which is concrete but the data inside is arbitrary
}

const a = objectGeneratorTest({
	string: primitiveGenerators.string,
	number: primitiveGenerators.number,
	boolean: primitiveGenerators.boolean,
	date: primitiveGenerators.date,
})

// const { schema, data } = a
// const output = fc.sample(data, 1)[0]
// const out2 = schema
// console.log(output.map(obj => Object.keys(obj?.schema?.fields) || 'no fields'))
// console.log(output.map(obj => obj?.schema?.fields || 'no fields'))
// console.log(`Is the generated schema and data compatible? ${isInputValid(output, schema).isValid ? 'Yes!' : 'No!'}`)
// console.log(a)
// console.log(output)
// console.log(out2)


const schemaAndDataGenerator = fc.letrec(tie => {
	return {
		schemaData: fc.oneof(
			{ maxDepth: 2 , withCrossShrink: true },
			...Object.values(primitiveGenerators).map(gen => fc.constant(gen())),
			tie('schemaData').map(innerGen => arrayGenerator(innerGen), { maxDepth: 2 }),
			tie('schemaData').map(innerGen => objectGeneratorTest({
				string: primitiveGenerators.string,
				number: primitiveGenerators.number,
				boolean: primitiveGenerators.boolean,
				date: primitiveGenerators.date,
				nested: () => innerGen
			}, 5), { maxDepth: 2 })
		)
	}
}).schemaData // arbitrary for an object of the shape { schema, data }

const b = fc.sample(schemaAndDataGenerator, 1)

console.log(b.map(obj => (obj?.schema?.fields && Object.keys(obj?.schema?.fields)) || obj?.schema?.type || 'no fields'))
const output = fc.sample(b[0]?.data, 1)
const schema = b[0]?.schema || 'no schema'
console.log(`Is the generated schema and data compatible? ${isInputValid(output, schema).isValid ? 'Yes!' : 'No!'}`)
console.log(output)
console.log(schema)

// Property-based test (ad-hoc)
fc.assert(
	fc.property(schemaAndDataGenerator, ({ schema, data }) => {
	  const sampleData = fc.sample(data, 1)[0]
	  const testSchema = schema
	  const ret = isInputValid(sampleData, testSchema).isValid
	  return ret
	}),
	{ numRuns: 1000000 }
  )
console.log("HEY ALL TESTS PASSED! YAY!!")