// File dedicated solely to schema related functions
import * as Yup from 'yup'

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
// Experimental area

// Manual tests for isValidFieldTypes
const formatTest = (result, condition = true, testCase = 1) => {
	if (result === condition) {
		console.log('\x1b[32m%s\x1b[0m', `Test case ${testCase} sucessful.`)
	} else {
		console.error('\x1b[31m%s\x1b[0m', `Test case ${testCase} failed.`)
	}
}

// // 1. It should validate a simple schema with prim. types
// const testSchema1 = Yup.object().shape({
// 	name: Yup.string(),
// 	age: Yup.number(),
// })
// const testData1 = { name: 'John', age: 30 }
// formatTest(isValidFieldTypes(testSchema1, testData1), true)

// // 2. It should fail validation for incorrect primitive types
// const testSchema2 = Yup.object().shape({
// 	name: Yup.string(),
// 	age: Yup.number(),
// })
// const testData2 = {
// 	name: 123, // should be a string
// 	age: '30', // should be a number
// }
// formatTest(isValidFieldTypes(testSchema2, testData2), false, 2)

// // 3. It should validate an array of numbers
// const testSchema3 = Yup.object().shape({
// 	scores: Yup.array().of(Yup.number()),
// })
// const testData3 = {
// 	scores: [100, 95, 80],
// }
// formatTest(isValidFieldTypes(testSchema3, testData3), true, 3)

// // 4. It should fail validation for an array with incorrect item types
// const testSchema4 = Yup.object().shape({
// 	scores: Yup.array().of(Yup.number()),
// })
// const testData4 = {
// 	scores: [100, '95', 80], // '95' should be a number
// }
// formatTest(isValidFieldTypes(testSchema4, testData4), false, 4)

// // 5. It validates nested objects 
// const testSchema5 = Yup.object().shape({
// 	user: Yup.object().shape({
// 		name: Yup.string(),
// 		age: Yup.number(),
// 	}),
// })
// const testData5 = {
// 	user: {
// 		name: 'John',
// 		age: 30,
// 	},
// }
// formatTest(isValidFieldTypes(testSchema5, testData5), true, 5)

// // 6. It fails validation for nested objects with incorrect types
// const testSchema6 = Yup.object().shape({
// 	user: Yup.object().shape({
// 		name: Yup.string(),
// 		age: Yup.number(),
// 	}),
// })

// const testData6 = {
// 	user: {
// 		name: 'John',
// 		age: '30', // should be a number
// 	},
// }
// formatTest(isValidFieldTypes(testSchema6, testData6), false, 6)

// // 7. It validates a primitive type with valid data
// const testSchema7 = Yup.string()
// const testData7 = 'Valid String!'
// formatTest(isValidFieldTypes(testSchema7, testData7), true, 7)

// // 8. It validates a primitive type with invalid data
// const testSchema8 = Yup.number()
// const testData8 = 'Invalid Number!'
// formatTest(isValidFieldTypes(testSchema8, testData8), false, 8)

// // 9. It validates an array of objects that are valid
// const testSchema9 = Yup.object().shape({
// 	users: Yup.array().of(
// 		Yup.object().shape({
// 			name: Yup.string(),
// 			age: Yup.number(),
// 		})
// 	),
// })
// const testData9 = {
// 	users: [
// 		{ name: 'John', age: 30 },
// 		{ name: 'Jane', age: 25 },
// 	],
// }
// formatTest(isValidFieldTypes(testSchema9, testData9), true, 9)

// // 10. It fails validation for an array of objects with incorrect types
// const testSchema10 = Yup.object().shape({
// 	users: Yup.array().of(
// 		Yup.object().shape({
// 			name: Yup.string(),
// 			age: Yup.number(),
// 		})
// 	),
// })
// const testData10 = {
// 	users: [
// 		{ name: 'John', age: 30 },
// 		{ name: 'Jane', age: '25' }, // should be a number
// 	],
// }
// formatTest(isValidFieldTypes(testSchema10, testData10), false, 10)

// // 11. It validates an object with an array of nested objects with valid data
// const testSchema11 = Yup.object().shape({
// 	groups: Yup.array().of(
// 		Yup.object().shape({
// 			groupName: Yup.string(),
// 			members: Yup.array().of(
// 				Yup.object().shape({
// 					name: Yup.string(),
// 					age: Yup.number(),
// 				})
// 			),
// 		})
// 	),
// })
// const testData11 = {
// 	groups: [
// 		{
// 			groupName: 'Group 1',
// 			members: [
// 				{ name: 'John', age: 30 },
// 				{ name: 'Jane', age: 25 },
// 			],
// 		},
// 	],
// }
// formatTest(isValidFieldTypes(testSchema11, testData11), true, 11)

// // 12. It fails validation for an object with an array of nested objects with incorrect types
// const testSchema12 = Yup.object().shape({
// 	groups: Yup.array().of(
// 		Yup.object().shape({
// 			groupName: Yup.string(),
// 			members: Yup.array().of(
// 				Yup.object().shape({
// 					name: Yup.string(),
// 					age: Yup.number(),
// 				})
// 			),
// 		})
// 	),
// })

// const testData12 = {
// 	groups: [
// 		{
// 			groupName: 'Group 1',
// 			members: [
// 				{ name: 'John', age: 30 },
// 				{ name: 'Jane', age: '25' }, // should be a number
// 			],
// 		},
// 	],
// }
// formatTest(isValidFieldTypes(testSchema12, testData12), false, 12)

// // 13. It fails validation for an object with an incorrect shape
// const testSchema13 = Yup.object().shape({
// 	groups: Yup.array().of(
// 		Yup.object().shape({
// 			groupName: Yup.string(),
// 			members: Yup.array().of(
// 				Yup.object().shape({
// 					name: Yup.string(),
// 					age: Yup.number(),
// 				})
// 			),
// 		})
// 	),
// })

// const testData13 = {
// 	groups: "invalid data"
// }
// formatTest(isValidFieldTypes(testSchema13, testData13), false, 13)