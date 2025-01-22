/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import {
	isDictionary, // example based only
	isIterable, // example based only
	isNode, // example based only
	isInputValid, // example based only
	isValidFieldTypes, // example based only
	makeIterable, // example based only
	dfsFns, // (5 sub-functions out of 5 tested with example based tests and property based tests)
	coerceToSchema, // example based only since dfs is property tested deeply
	// enhancedCastPrimitive, // property tested and example based too
} from '../../../Core/utils/schema-helpers.js'
import { TASK_STATUSES } from '../../../Core/utils/constants.js'
import { simpleTaskSchema } from '../../../Core/schemas/simpleTaskSchema.js'
import { taskSchema, fullTasksSchema } from '.../../../Core/schemas/taskSchema.js'
import { fc } from '@fast-check/jest'
import * as Yup from 'yup'

// TODO: Cover rules.d, getLabelIndex, and getTransform later, I had issues with them reading properties of undefined
// TODO: Fix Valid schema, invalid NaN test case. It has 'NaN' as the task output instead of the type default '' when it should be type default
// TODO: Include Integrity property tests for dfs function. I noticed that sometimes it can not preserve integrity but does preseve validity


// --- Global Arbitraries and test helpers
// TODO: See if it is possible to reformulate the return type of schemaAndDataGenerator to be concrete schema and data, not just concrete schema. (It worked in schema-helpers but not here??)
// Primitive Arbitraries (make primitive schema and data at once), concrete schema and arbitrary data
const primitiveGenerators = {
	string: () => ({ schema: Yup.string(), data: fc.string() }),
	number: () => ({ schema: Yup.number(), data: fc.integer() }), // ints only
	boolean: () => ({ schema: Yup.boolean(), data: fc.boolean() }),
	date: () => ({ schema: Yup.date(), data: fc.date() })
}

// Array Arbitrary (make array schema and data at once), concrete schema and arbitrary data
const arrayGenerator = innerGenerator => ({
	schema: Yup.array().of(innerGenerator.schema), // concrete schema
	data: fc.array(innerGenerator.data), // arbitrary data
})

// Object Arbitrary with Random Fields (shallow only) (make object schema and data at once), concrete schema and arbitrary data
const objectGenerator = (fieldGenerators, maxLen = 5) => fc.sample(fc
	.uniqueArray(fc.constantFrom(...Object.keys(fieldGenerators)), { minLength: 1, maxLength: maxLen }) // unique 1..5 from primitiveGenerator keys. (if not unique it biases to small resultant obj)
	.map(keys => Object.fromEntries(keys.map(key => [key, fieldGenerators[key]()]))) // {key, data from arbitrary}
	.map(fieldEntries => ({
		schema: Yup.object().shape(Object.fromEntries(Object.entries(fieldEntries).map(([key, { schema }]) => [key, schema]))), // { [datatype]: schema }. Ex: { date: DateSchema..., boolean: BooleanSchema..., ...}
		data: fc.record(Object.fromEntries(Object.entries(fieldEntries).map(([key, { data }]) => [key, data])))
	})), 1)[0]

// Recursive Schema and Data Generator
const schemaAndDataGenerator = fc.letrec(tie => ({
	schemaData: fc.oneof(
		{ maxDepth: 2, withCrossShrink: true },
		...Object.values(primitiveGenerators).map(gen => fc.constant(gen())),
		tie('schemaData').map(innerGen => arrayGenerator(innerGen), { maxDepth: 2 }),
		tie('schemaData').map(innerGen => objectGenerator({
			string: primitiveGenerators.string,
			number: primitiveGenerators.number,
			boolean: primitiveGenerators.boolean,
			date: primitiveGenerators.date,
			nested: () => innerGen
		}, 5), { maxDepth: 2 }) // it is objectGenerator({...5 entries}, 5) because there are 5 entries
	)
})).schemaData // { schema, data }, concrete schema, arbitrary data

const invalidDataGenerator = schema => fc.anything().filter(data => !isInputValid(data, schema).isValid)

// --- Property and Example Based Tests

// --- test helper tests
describe('schemaAndDataGenerator', () => {
	// --- Property Tests
	// 1. The schemaAndDataGenerator must always make schemas and data that are compatible
	test('schemaAndDataGenerator must always make schemas and data that are compatible', () => {
		fc.assert(
			fc.property(schemaAndDataGenerator, ({ schema, data }) => isInputValid(fc.sample(data, 1)[0], schema).isValid)
		)
	})
})

describe('invalidDataGenerator', () => {
	// --- Property Tests
	// 1. The invalidDataGenerator must always make data that is incompatible with the schema provided
	test('The invalidDataGenerator must always make data that is incompatible with the schema provided', () => {
		fc.assert(
			fc.property(schemaAndDataGenerator, ({ schema }) => !isInputValid(fc.sample(invalidDataGenerator(schema), 1)[0], schema).isValid),
		)
	})
})

// --- predicates
describe('isDictionary', () => {
	// --- Example tests
	const testCases = [
		{ input: {}, expected: true, description: 'Empty object should be a dictionary' },
		{ input: { key: 'value' }, expected: true, description: 'Non-empty object should be a dictionary' },
		{ input: [], expected: false, description: 'Array should not be a dictionary' },
		{ input: 'string', expected: false, description: 'String should not be a dictionary' },
		{ input: null, expected: false, description: 'Null should not be a dictionary' },
	]
	testCases.forEach(({ input, expected, description }) => {
		it(description, () => {
			expect(isDictionary(input)).toBe(expected)
		})
	})
})

describe('isIterable', () => {
	// --- Example tests
	const testCases = [
		{ input: [], expected: true, description: 'Array should be iterable' },
		{ input: 'string', expected: false, description: 'String should not be iterable' },
		{ input: new Map(), expected: true, description: 'Map should be iterable' },
		{ input: {}, expected: true, description: 'Empty object should be treated as iterable (dictionary)' },
		{ input: null, expected: false, description: 'Null should not be iterable' },
		{ input: undefined, expected: false, description: 'undefined should not be iterable' },
		{ input: NaN, expected: false, description: 'NaN should not be iterable' },
		{ input: 5, expected: false, description: '5 should not be iterable' },
		{ input: true, expected: false, description: 'true should not be iterable' },
	]
	testCases.forEach(({ input, expected, description }) => {
		it(description, () => {
			expect(isIterable(input)).toBe(expected)
		})
	})
})

describe('isNode', () => {
	// --- Example tests
	const testCases = [
		{ input: { type: 'string' }, expected: true, description: 'String type should be a node' },
		{ input: { type: 'number' }, expected: true, description: 'Number type should be a node' },
		{ input: { type: 'array', innerType: { fields: {} } }, expected: false, description: 'Array with inner fields should not be a node' },
		{ input: { type: 'array' }, expected: false, description: 'Array without inner fields should NOT be a node (we changed it)' },
		{ input: { type: 'object' }, expected: false, description: 'Object type should not be a node' },
		{ input: null, expected: false, description: 'Null should not be a node' },
		{ input: undefined, expected: false, description: 'Undefined should not be a node' },
	]
	testCases.forEach(({ input, expected, description }) => {
		it(description, () => {
			expect(isNode(input)).toBe(expected)
		})
	})
})

describe('isInputValid', () => {
	// --- Example tests
	const testCases = [
		{
			input: { name: 'John Doe' },
			schema: Yup.object().shape({ name: Yup.string().required() }),
			expected: { isValid: true, error: '' },
			description: 'Valid input for a simple schema'
		},
		{
			input: { name: 123 },
			schema: Yup.object().shape({ name: Yup.string().required() }),
			expected: { isValid: false, error: expect.stringContaining('name must be a `string` type') },
			description: 'Invalid input type'
		},
		{
			input: { name: 'John Doe', extra: 'field' },
			schema: Yup.object().shape({ name: Yup.string().required() }),
			expected: { isValid: false, error: 'Extra fields present in input: extra.' },
			description: 'Input with extra fields'
		},
		{
			input: { name: 'John Doe' },
			schema: Yup.object().shape({ name: Yup.string().min(10) }),
			expected: { isValid: false, error: expect.stringContaining('name must be at least 10 characters') },
			description: 'Input failing schema validation'
		},
		{
			input: {},
			schema: Yup.object().shape({ name: Yup.string().required() }),
			expected: { isValid: false, error: expect.stringContaining('name is a required field') },
			description: 'Input missing required field'
		}
	]
	testCases.forEach(({ input, schema, expected, description }) => {
		it(description, () => {
			expect(isInputValid(input, schema)).toEqual(expected)
		})
	})
})

describe('isValidFieldTypes', () => {
	// --- Example based tests
	const testCases = [
		{
			schema: Yup.object().shape({
				name: Yup.string(),
				age: Yup.number(),
			}),
			data: { name: 'John', age: 30 },
			expected: true,
			description: 'Validates a simple schema with primitive types'
		},
		{
			schema: Yup.object().shape({
				name: Yup.string(),
				age: Yup.number(),
			}),
			data: { name: 123, age: '30' },
			expected: false,
			description: 'Fails validation for incorrect primitive types'
		},
		{
			schema: Yup.object().shape({
				scores: Yup.array().of(Yup.number()),
			}),
			data: { scores: [100, 95, 80] },
			expected: true,
			description: 'Validates an array of numbers with valid data'
		},
		{
			schema: Yup.object().shape({
				scores: Yup.array().of(Yup.number()),
			}),
			data: { scores: [100, '95', 80] },
			expected: false,
			description: 'Fails validation for an array with incorrect item types'
		},
		{
			schema: Yup.object().shape({
				user: Yup.object().shape({
					name: Yup.string(),
					age: Yup.number(),
				}),
			}),
			data: { user: { name: 'John', age: 30 } },
			expected: true,
			description: 'Validates nested objects with valid data'
		},
		{
			schema: Yup.object().shape({
				user: Yup.object().shape({
					name: Yup.string(),
					age: Yup.number(),
				}),
			}),
			data: { user: { name: 'John', age: '30' } },
			expected: false,
			description: 'Fails validation for nested objects with incorrect types'
		},
		{
			schema: Yup.string(),
			data: 'Valid String!',
			expected: true,
			description: 'Validates a primitive type with valid data'
		},
		{
			schema: Yup.number(),
			data: 'Invalid Number!',
			expected: false,
			description: 'Validates a primitive type with invalid data'
		},
		{
			schema: Yup.object().shape({
				users: Yup.array().of(Yup.object().shape({
					name: Yup.string(),
					age: Yup.number(),
				})),
			}),
			data: { users: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }] },
			expected: true,
			description: 'Validates an array of objects that are valid'
		},
		{
			schema: Yup.object().shape({
				users: Yup.array().of(Yup.object().shape({
					name: Yup.string(),
					age: Yup.number(),
				})),
			}),
			data: { users: [{ name: 'John', age: 30 }, { name: 'Jane', age: '25' }] },
			expected: false,
			description: 'Fails validation for an array of objects with incorrect types'
		},
		{
			schema: Yup.object().shape({
				groups: Yup.array().of(Yup.object().shape({
					groupName: Yup.string(),
					members: Yup.array().of(Yup.object().shape({
						name: Yup.string(),
						age: Yup.number(),
					})),
				})),
			}),
			data: {
				groups: [
					{
						groupName: 'Group 1',
						members: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]
					}
				]
			},
			expected: true,
			description: 'Validates an object with an array of nested objects with valid data'
		},
		{
			schema: Yup.object().shape({
				groups: Yup.array().of(Yup.object().shape({
					groupName: Yup.string(),
					members: Yup.array().of(Yup.object().shape({
						name: Yup.string(),
						age: Yup.number(),
					})),
				})),
			}),
			data: {
				groups: [
					{
						groupName: 'Group 1',
						members: [{ name: 'John', age: 30 }, { name: 'Jane', age: '25' }]
					}
				]
			},
			expected: false,
			description: 'Fails validation for an object with an array of nested objects with incorrect types'
		},
		{
			schema: Yup.object().shape({
				groups: Yup.array().of(
					Yup.object().shape({
						groupName: Yup.string(),
						members: Yup.array().of(
							Yup.object().shape({
								name: Yup.string(),
								age: Yup.number(),
							})
						),
					})
				),
			}),
			data: {
				groups: "invalid data"
			},
			expected: false,
			description: 'It fails validation for an object with an incorrect shape',
		},
		{
			schema: Yup.object().shape({
				number: Yup.number().nullable(true),
				string: Yup.string().nullable(true),
				date: Yup.date().nullable(true),
			}),
			data: { number: 4, date: new Date('1970-01-01T00:00:00.004Z'), string: '#}I#~FJL(' },
			expected: true,
			description: 'It validates an object with a date as a field',
		},
		{
			schema: Yup.array().of(
				Yup.string()
			),
			data: ['$%;ewoA[', 'T^.mx', '`iJnvE`[F', '5VqNS,s7F', '2)!!LoQ4L'],
			expected: true,
			description: 'It validates an array with a string as an innertype',
		},
		{
			schema: Yup.date(),
			data: new Date('1970-01-01T00:00:00.051Z'),
			expected: true,
			description: 'It validates an individual date',
		},
		{
			schema: Yup.array().of(Yup.string()),
			data: [
				{
					'': '#?cI1x',
					'IbN+EY': '%',
					",'/62TGjR": false,
					'Vf=3e/': -1423596285076308,
					A3: true,
					'Vss#QH_Y(': 'hc![',
					'e09ta)GwJ': false,
					"@qnUDN'(": 3.55131383253773e-203,
					'g&)8$1>4Z': -3.385747325746369e-101
				}
			],
			expected: false,
			description: 'It fails validation for an array of strings schema with an array of objects data',
		},
		{
			schema: Yup.array().of(Yup.string()),
			data: { l: null, prototypen: [')?l~b&eCw', 'J'], '': '#|' },
			expected: false,
			description: 'It fails validation for an array of strings schema with objects data',
		},
		{
			schema: Yup.number(),
			data: NaN,
			expected: false,
			description: 'It fails validation for a number schema with NaN. It considers NaN not a number',
		},
	]
	testCases.forEach(({ schema, data, expected, description }) => {
		it(description, () => {
			expect(isValidFieldTypes(schema, data)).toBe(expected)
		})
	})

	// --- Property based tests
	// 1. Should return true for valid data according to schema
	it('Should return true for valid data according to schema', () => {
		fc.assert(
			fc.property(schemaAndDataGenerator, ({ schema, data }) => {
				const testData = fc.sample(data, 1)[0]
				expect(isValidFieldTypes(schema, testData)).toBe(true)
			}),
		)
	})
	// 2. Should return false for invalid data according to the schema
	it('Should return false for invalid data according to the schema', () => {
		fc.assert(
			fc.property(schemaAndDataGenerator, ({ schema }) => {
				const testData = fc.sample(invalidDataGenerator(schema), 1)[0]
				const res = isValidFieldTypes(schema, testData)
				if (res) {
					console.log(schema)
					console.log(testData)
					console.log(res)
				}
				expect(isValidFieldTypes(schema, testData)).toBe(false)
			})
		)
	})
})

// --- others
describe('makeIterable', () => {
	// --- Example tests
	const testCases = [
		{
			description: 'Array is iterable',
			input: [1, 2, 3],
			expected: [1, 2, 3]
		},
		{
			description: 'Set is iterable',
			input: new Set([1, 2, 3]),
			expected: [1, 2, 3]
		},
		{
			description: 'Map is iterable',
			input: new Map([['a', 1], ['b', 2], ['c', 3]]),
			expected: [['a', 1], ['b', 2], ['c', 3]]
		},
		{
			description: 'Object is iterable via Object.entries',
			input: { a: 1, b: 2, c: 3 },
			expected: [['a', 1], ['b', 2], ['c', 3]]
		},
		{
			description: 'Non-iterable value returns itself',
			input: 123,
			expected: 123
		},
		{
			description: 'String is not iterable in this context',
			input: 'string',
			expected: 'string'
		},
		{
			description: 'Null is not iterable',
			input: null,
			expected: null
		},
		{
			description: 'Undefined is not iterable',
			input: undefined,
			expected: undefined
		},
		{
			description: 'Boolean true is not iterable',
			input: true,
			expected: true
		},
		{
			description: 'Boolean false is not iterable',
			input: false,
			expected: false
		}
	]

	testCases.forEach(({ description, input, expected }) => {
		test(description, () => {
			const result = makeIterable(input)
			if (isIterable(input)) {
				expect(Array.from(result)).toEqual(expected)
			} else {
				expect(result).toBe(expected)
			}
		})
	})
})

// --- dfsFns
const { reachGet, reachUpdate, processErrors, processNodes, dfs } = dfsFns // destructure the methods out
describe('dfsFns.reachGet', () => {
	const testCases = [
		{ input: { a: { b: { c: 42 } } }, path: ['a', 'b', 'c'], expected: 42 },
		{ input: { a: { b: null } }, path: ['a', 'b', 'c'], expected: null }, // Possibly rethink this one based on desired properties
		{ input: { a: { b: { c: 42 } } }, path: ['a', 'x', 'c'], expected: undefined },
		{ input: { a: { b: { c: 42 } } }, path: [], expected: { a: { b: { c: 42 } } } },
		{ input: null, path: ['a', 'b', 'c'], expected: null }
	]

	testCases.forEach(({ input, path, expected }) => {
		test(`returns ${JSON.stringify(expected)} for input ${JSON.stringify(input)} and path ${path}`, () => {
			expect(reachGet(input, path)).toStrictEqual(expected)
		})
	})
})

describe('dfsFns.reachUpdate', () => {
	const testCases = [
		{ input: { a: { b: { c: 42 } } }, path: ['a', 'b', 'c'], value: 100, expected: { a: { b: { c: 100 } } } },
		{ input: { a: { b: null } }, path: ['a', 'b', 'c'], value: 100, expected: { a: { b: { c: 100 } } } },
		{ input: { a: { b: { c: 42 } } }, path: ['a', 'x', 'c'], value: 100, expected: { a: { b: { c: 42 }, x: { c: 100 } } } },
		{ input: {}, path: ['a', 'b', 'c'], value: 100, expected: { a: { b: { c: 100 } } } },
		{ input: { a: [1, 2, 3] }, path: ['a', 1], value: 42, expected: { a: [1, 42, 3] } }
	]

	testCases.forEach(({ input, path, value, expected }) => {
		test(`updates ${JSON.stringify(input)} at path ${path} to ${value} and returns ${JSON.stringify(expected)}`, () => {
			expect(reachUpdate(input, path, value)).toStrictEqual(expected)
		})
	})
})

describe('dfsFns.processErrors', () => {
	const testCases = [
		{ input: ['error1', 'error2', ''], expected: ['error1', 'error2'] },
		{ input: ['error1', 'error1', 'error2'], expected: ['error1', 'error2'] },
		{ input: [' ', 'error1'], expected: ['error1'] },
		{ input: ['error1', 'error1', 'error1'], expected: ['error1'] },
		{ input: ['error1', '', '   '], expected: ['error1'] }
	]

	testCases.forEach(({ input, expected }) => {
		test(`processes errors from ${input} to ${expected}`, () => {
			expect(processErrors(input)).toEqual(expected)
		})
	})
})

describe('dfsFns.processNodes', () => {
	const testCases = [
		{
			input: {
				currentInput: 'test',
				currentSchema: Yup.string(),
				isValid: true,
				errors: [],
				error: '',
				output: {},
				path: ['a']
			},
			expected: { output: { a: 'test' }, errors: [] }
		},
		{
			input: {
				currentInput: 123,
				currentSchema: Yup.number(),
				isValid: true,
				errors: [],
				error: '',
				output: {},
				path: ['b']
			},
			expected: { output: { b: 123 }, errors: [] }
		},
		{
			input: {
				currentInput: 123,
				currentSchema: Yup.string().default('5'), // default is defined, but coercion attempts will be made before applying default
				isValid: false,
				errors: [],
				error: 'Invalid type',
				output: {},
				path: ['b']
			},
			expected: { output: { b: '123' }, errors: ["this must be a `string` type, but the final value was: `123`.", 'Invalid type at path: "b", and it was coerced to 123'] }
		},
		{
			input: {
				currentInput: 'abc',
				currentSchema: Yup.number().default(10), // default provided and coercion is impossible, so default is respected
				isValid: false,
				errors: [],
				error: 'Invalid type',
				output: {},
				path: ['c']
			},
			expected: { output: { c: 10 }, errors: ["this must be a `number` type, but the final value was: `\"abc\"`.", 'Invalid type at path: "c", and it was coerced to 10'] }
		},
		{
			input: {
				currentInput: null,
				currentSchema: Yup.string(), // No default so string default "" provided
				isValid: false,
				errors: ['Previous error'],
				error: 'Invalid type',
				output: {},
				path: ['d']
			},
			expected: { output: { d: "" }, errors: ['Previous error', "this cannot be null", "Invalid type at path: \"d\", and it was coerced to "] }
		}
	]

	testCases.forEach(({ input, expected }) => {
		test(`processNodes with input ${JSON.stringify(input)} should return ${JSON.stringify(expected)}`, () => {
			expect(processNodes(input)).toEqual(expected)
		})
	})
})

describe('dfsFns.dfs', () => {
	// --- Example based tests
	const testCases = [
		{
			input: {
				input: { a: 'test' },
				schema: Yup.object({
					a: Yup.string().required()
				})
			},
			expected: { output: { a: 'test' }, errors: [] }
		},
		{
			input: {
				input: { a: 123 },
				schema: Yup.object({
					a: Yup.number().required()
				})
			},
			expected: { output: { a: 123 }, errors: [] }
		},
		{
			input: {
				input: { a: 123 },
				schema: Yup.object({
					a: Yup.string().required()
				})
			},
			expected: { output: { a: '123' }, errors: ["this must be a `string` type, but the final value was: `123`. at path: \"a\", and it was coerced to 123"] }
		},
		{
			input: {
				input: { a: 'abc' },
				schema: Yup.object({
					a: Yup.number().required()
				})
			},
			expected: { output: { a: 0 }, errors: ["this must be a `number` type, but the final value was: `\"abc\"`. at path: \"a\", and it was coerced to 0"] }
		},
		{
			input: {
				input: { a: null },
				schema: Yup.object({
					a: Yup.string().required()
				})
			},
			expected: { output: { a: '' }, errors: ["this is a required field at path: \"a\", and it was coerced to "] }
		}
	]

	testCases.forEach(({ input, expected }) => {
		test(`dfs with input ${JSON.stringify(input)} should return ${JSON.stringify(expected)}`, () => {
			const result = dfs(input)
			expect(result.output).toStrictEqual(expected.output) // outputs always same
			// Verify the errors atleast have the coercion error, and the Yup specific ones are counted good too without explicitly checking for themm
			if (expected.errors.length > 0) {
				expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining(expected.errors[0])]))
			} else {
				expect(result.errors).toEqual([])
			}
		})
	})

	// --- Property based tests (using fixed schema, arbitrary data)
	// Fixed schema definition (Simple Task Schema), with the associated arbitraries
	const schema = simpleTaskSchema
	const isoDateArbitrary = fc.date({ min: new Date(2000, 0, 1), max: new Date(2025, 11, 31) }).map(date => date.toISOString())
	const validDataArbitrary = fc.record({
		task: fc.string({ minLength: 1, maxLength: 50 }), // Ensures task is between 1 and 50 characters
		waste: fc.float({ min: Math.fround(0.011), noNaN: true }), // Waste must be a non-negative number. It can't be NaN since that is coerced
		ttc: fc.float({ min: Math.fround(0.011), noNaN: true }), // TTC must be a float greater than 0.01. It can't be NaN since that is coerced
		eta: isoDateArbitrary, // ETA must be a valid ISO string
		id: fc.integer({ min: 1 }), // ID must be a positive number
		status: fc.constantFrom(...Object.values(TASK_STATUSES)), // Status must be one of the predefined values
		timestamp: fc.integer({ min: 1 }), // Timestamp must be a positive number
		completedTimeStamp: fc.integer({ min: 1 }), // Completed timestamp must be a positive number
		hidden: fc.boolean() // Hidden flag must be a boolean
	})

	// For the integrity checks
	const validPrimitiveTypes = { 'number': fc.integer(), 'string': fc.string(), 'boolean': fc.boolean(), 'date': fc.date() }
	const validPrimitiveSchemas = { 'number': Yup.number().integer(), 'string': Yup.string(), 'boolean': Yup.boolean(), 'date': Yup.date() }
	const typeArbitary = (validTypes = validPrimitiveTypes) => fc.constantFrom(...Object.keys(validTypes)) // returns a string name for a type
	const arraySchemaArbitrary = (type, validTypes = validPrimitiveTypes) => fc.array(validTypes[type], { minLength: 1 })
	const validArrayArbitrary = schema => arraySchemaArbitrary(schema.type) // fc.array(valid fc.primitive())
	const invalidArrayArbitrary = (schema, validTypes = validPrimitiveTypes) => {
		const remainingTypeArbitraries = Object
			.keys(validTypes)
			.filter(type => type !== schema.type) // ['number', 'float', 'string', 'boolean'] - 'float' = ['number', 'string', 'boolean']
		return arraySchemaArbitrary(fc.sample(fc.constantFrom(...remainingTypeArbitraries), 1)[0]) // fc.array(invalid fc.primitive())
	}
	const partiallyValidArrayArbitary = (schema, validTypes = validPrimitiveTypes) => {
		return fc.record({ validArray: validArrayArbitrary(schema), invalidArray: invalidArrayArbitrary(schema, validTypes) })
			.chain(({ validArray, invalidArray }) => fc.constant([...validArray, ...invalidArray]))
	} // returns array with atleast one element that is bad against the internal type
	const validArraySlice = (arr, schema) => arr.filter(item => isInputValid(item, schema).isValid)

	it('should generate arrays with both valid and invalid items', () => {
		fc.assert(
			fc.property(typeArbitary(), (type) => {
				const schema = validPrimitiveSchemas[type]
				const arr = fc.sample(partiallyValidArrayArbitary(schema), 1)[0]
				const cond = arr.some(item => schema.isValidSync(item))
				if (!cond) {
					console.log(type)
					console.log(arr)
					console.log(schema)
				}
				expect(arr.some(item => schema.isValidSync(item))).toBe(true)
			})
		)
	})

	/*
	Properties known, but not tested:
	
	9. Integrity of Object fields -   
	10. User Default values when field is not coerceable AND has user default - f(a) returns each field with the default value of the schema at each point iff the field is not coercable
	11. Coercion table values when field is coerceable AND invalid - f(a) returns each field with the Type default at each point iff the field is coercable and invalid
	12. Type Default values when field is not coerceable AND has no user default - 
	*/

	// 1. Idempotence of data - f(a).output === f(f(a).output).output 
	test('Idempotence - f(a).output === f(f(a).output).output', () => {
		fc.assert(
			fc.property(validDataArbitrary, (input) => {
				// input is from the validDataArbitrary, schema is from fixed definition above
				const result1 = dfs({ input, schema }).output // f(a).output
				const result2 = dfs({ input: result1, schema }).output // f(f(a).output).output
				expect(result1).toStrictEqual(result2) // f(a).output === f(f(a).output).output
			})
		)
	})

	// 2. Type compliance - f(a) = c, where c has correct type for each field
	test('Type compliance - f(a) = c, where c has correct type for each field', () => {
		fc.assert(
			fc.property(validDataArbitrary, (input) => {
				const c = dfs({ input, schema }) // f(a) = c
				const isValid = isValidFieldTypes(schema, c.output) // f(a) = c, where c has correct type for each field
				if (!isValid) {
					console.log(isInputValid(input, schema))
					console.log(c)
				}
				expect(isValid).toBe(true)
			})
		)
	})

	// 3. Error cases - f(a) returns atleast one error if a does not conform to the schema precisely 
	test('Error cases - f(a) returns atleast one error if a does not conform to the schema precisely ', () => {
		fc.assert(
			fc.property(invalidDataGenerator(schema), (input) => {
				const errors = dfs({ input, schema }).errors // f(a) returns atleast one error, because a does not conform to the schema precisely
				expect(errors.length).toBeGreaterThanOrEqual(1)
			})
		)
	})

	// 4. No Errors on valid input - f(a) returns an empty list of errors if a conforms to the schema precisely
	test('No Errors on valid input - f(a) returns an empty list of errors if a conforms to the schema precisely', () => {
		fc.assert(
			fc.property(validDataArbitrary, (input) => {
				const errors = dfs({ input, schema }).errors // f(a).errors, where a is valid
				expect(errors.length).toBe(0) // f(a).errors, where a is valid, should be = []
			})
		)
	})

	// 5. Errors are a list of strings - f(a).errors, where a is invalid, is a list of strings
	test('Errors are a list of strings - f(a).errors, where a is invalid, is a list of strings', () => {
		fc.assert(
			fc.property(invalidDataGenerator(schema), (input) => {
				const errors = dfs({ input, schema }).errors // should be an array of strings
				expect(Array.isArray(errors)).toBe(true) // errors should be an array
				expect(errors.every(error => typeof error === 'string')).toBe(true) // errors should be an array of strings
			})
		)
	})

	// 6. Errors contain Yup errors - f(a).errors, where a is invalid, atleast has the Yup errors contained in the list
	test('Errors contain Yup errors - f(a).errors, where a is invalid, atleast has the Yup errors contained in the list', () => {
		fc.assert(
			fc.property(invalidDataGenerator(schema), (input) => {
				const errors = dfs({ input, schema }).errors
				const yupError = isInputValid(input, schema).error
				const cond = errors.some(error => error === yupError)
				if (!cond) {
					console.log(input)
					console.log(yupError)
					console.log(errors)
				}
				expect(errors.some(error => error === yupError)).toBe(true)
			})
		)
	})

	// 7. Fixed point if valid (Non-altering of valid data) - f(a.output).output = a.output if a.output is valid against the schema
	test('Fixed point if valid (Non-altering of valid data) - f(a.output).output = a.output if a.output is valid against the schema', () => {
		fc.assert(
			fc.property(validDataArbitrary, (input) => {
				const a = dfs({ input, schema }) // a
				const c = dfs({ input: a.output, schema }).output // f(a.output).output = c
				const d = a.output // a.output = d
				expect(c).toStrictEqual(d) // f(a.output).output = a.output :=> c = d
			})
		)
	})

	// 8. Integrity of Primitive Array elements - valid array slice = f(array, schema).output. ex: validArraySlice([{...}, 42]) == [42] == output == [42] 
	test('Integrity of Primitive Array elements - valid array slice = f(array, schema).output.', () => {
		fc.assert(
			fc.property(typeArbitary(), (type) => {
				const schema = validPrimitiveSchemas[type]
				const arr = fc.sample(partiallyValidArrayArbitary(schema), 1)[0]
				const expectedOutput = validArraySlice(arr, schema) // Expected valid output array

				const res = dfs({ input: arr, schema: Yup.array().of(schema) }).output

				if (JSON.stringify(expectedOutput) !== JSON.stringify(res)) {
					console.log(`input: ${arr}`)
					console.log(`expected output: ${expectedOutput}`)
					console.log(`actual output: ${result}`)
				}
				expect(res).toEqual(expectedOutput) // valid array slice === f(arr, schema).output
			}
			),
		)
	})
	/*
		What my 8 properties prove so far:

		dfs({ input, schema }) => { 
			output: 
				input is valid -> valid output,
				input is not valid -> output with correct type and shape + Primitive Arrays remove invalid,
			, 
			errors: 
				input is valid -> [],
				input is not valid -> [string+] where there is Yup errors included that are informative 
			}

		So what this means is that the way to move forward is to constrain output even more by proving special cases such as when all defaults are defined and valid.
	*/
})

// --- main coercion function
describe('coerceToSchema', () => {
	const twelve = new Date(new Date().setHours(12, 0, 0, 0))
	const defaultTask = {
		"task": " ",
		"waste": 1,
		"ttc": 1,
		"eta": "2024-08-05T17:00:00.000Z",
		"id": 1722911470758,
		"status": "incomplete",
		"timestamp": 1722910996,
		"completedTimeStamp": 1722910996,
		"hidden": false
	} // NOTE: using this rather than the constant so I know it is consistent, because the constant uses Date()

	// --- Example based tests

	// Using individual simple task schema
	const testCases = [
		{
			description: 'Valid data with all fields correct',
			input: { name: 'Alice', age: 25, email: 'alice@example.com' },
			schema: Yup.object().shape({
				name: Yup.string().default('Anonymous'),
				age: Yup.number().default(0),
				email: Yup.string().email().default('no-reply@example.com')
			}),
			expected: {
				output: { name: 'Alice', age: 25, email: 'alice@example.com' },
				errors: []
			}
		},
		{
			description: 'Invalid data with age and email fields incorrect',
			input: { name: 'John Doe', age: 'invalid-age' },
			schema: Yup.object().shape({
				name: Yup.string().default('Anonymous'),
				age: Yup.number().default(0),
				email: Yup.string().email().default('no-reply@example.com').required()
			}),
			expected: {
				output: { name: 'John Doe', age: 0, email: 'no-reply@example.com' },
				errors: [
					"email is a required field",
					"this must be a `number` type, but the final value was: `\"invalid-age\"`.",
					"this must be a `number` type, but the final value was: `\"invalid-age\"`. at path: \"age\", and it was coerced to 0",
					"this is a required field",
					"this is a required field at path: \"email\", and it was coerced to no-reply@example.com",
				]
			}
		},
		{
			description: 'Invalid schema, valid data',
			input: { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: null,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: ['No Schema provided, input data is unaffected by schema coercions.']
			}
		},
		{
			description: 'Invalid schema, invalid data',
			input: { "task": " ", "waste": Number.NaN, "ttc": 0.010999999940395355, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: NaN,
			expected: {
				output: { "task": " ", "waste": Number.NaN, "ttc": 0.010999999940395355, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
				errors: ['No Schema provided, input data is unaffected by schema coercions.']
			}
		},
		{
			description: 'Valid schema, valid data',
			input: { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: []
			}
		},
		{
			description: 'Valid schema, invalid task',
			input: { "task": 1234, "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: '1234', waste: 0.01, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'task must be a `string` type, but the final value was: `1234`.',
					'this must be a `string` type, but the final value was: `1234`.',
					'this must be a `string` type, but the final value was: `1234`. at path: "task", and it was coerced to 1234'
				]
			}
		},
		{
			description: 'Valid schema, invalid waste',
			input: { "task": " ", "waste": "Foobar", "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'waste must be a `number` type, but the final value was: `"Foobar"`.',
					'this must be a `number` type, but the final value was: `"Foobar"`.',
					'this must be a `number` type, but the final value was: `"Foobar"`. at path: "waste", and it was coerced to 0'
				]
			}
		},
		{
			description: 'Valid schema, invalid ttc',
			input: { "task": " ", "waste": 0.01, "ttc": NaN, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 1, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'TTC must be a number',
					'TTC must be a number at path: "ttc", and it was coerced to 1'
				]
			}
		},
		{
			description: 'Valid schema, invalid eta',
			input: { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": new Date(0), "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 0.01, eta: twelve.toISOString(), id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'Eta must be a valid ISO string',
					`Eta must be a valid ISO string at path: "eta", and it was coerced to ${twelve.toISOString()}`
				]
			}
		},
		{
			description: 'Valid schema, invalid id',
			input: { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": -100, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'Id must be greater than 0',
					'Id must be greater than 0 at path: "id", and it was coerced to 1'
				]
			}
		},
		{
			description: 'Valid schema, invalid status',
			input: { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "pending", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'incomplete', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'Invalid status value',
					'Invalid status value at path: "status", and it was coerced to incomplete'
				]
			}
		},
		{
			description: 'Valid schema, invalid timestamp',
			input: { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": new Date(100), "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'timestamp must be a `number` type, but the final value was: `1970-01-01T00:00:00.100Z`.',
					'this must be a `number` type, but the final value was: `1970-01-01T00:00:00.100Z`.',
					'this must be a `number` type, but the final value was: `1970-01-01T00:00:00.100Z`. at path: "timestamp", and it was coerced to 1'
				]
			}
		},
		{
			description: 'Valid schema, invalid completedTimeStamp',
			input: { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": {}, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'completedTimeStamp must be a `number` type, but the final value was: `{}`.',
					'this must be a `number` type, but the final value was: `{}`.',
					'this must be a `number` type, but the final value was: `{}`. at path: "completedTimeStamp", and it was coerced to 1'
				]
			}
		},
		{
			description: 'Valid schema, invalid hidden',
			input: { "task": " ", "waste": 0.01, "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": [] },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'hidden must be a `boolean` type, but the final value was: `[]`.',
					'this must be a `boolean` type, but the final value was: `[]`.',
					'this must be a `boolean` type, but the final value was: `[]`. at path: "hidden", and it was coerced to false'
				]
			}
		},
		{
			description: 'Valid schema, invalid task+waste',
			input: { "task": {}, "waste": [], "ttc": 0.01, "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0, ttc: 0.01, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					'waste must be a `number` type, but the final value was: `[]`.',
					'this must be a `string` type, but the final value was: `{}`.',
					'this must be a `string` type, but the final value was: `{}`. at path: "task", and it was coerced to  ',
					"this must be a `number` type, but the final value was: `[]`.",
					"this must be a `number` type, but the final value was: `[]`. at path: \"waste\", and it was coerced to 0",
				]
			}
		},
		{
			description: 'Valid schema, invalid task+ttc',
			input: { "task": new Date(1), "waste": 0.01, "ttc": new Set(), "eta": "2000-01-01T06:00:00.000Z", "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 1, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					"TTC must be a number",
					"this must be a `string` type, but the final value was: `1970-01-01T00:00:00.001Z`.",
					"this must be a `string` type, but the final value was: `1970-01-01T00:00:00.001Z`. at path: \"task\", and it was coerced to  ",
					"TTC must be a number at path: \"ttc\", and it was coerced to 1",
				]
			}
		},
		{
			description: 'Valid schema, invalid task+eta',
			// NOTE: using current date is hard to test for..
			input: { "task": null, "waste": 0.01, "ttc": 1, "eta": [], "id": 1, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0.01, ttc: 1, eta: twelve.toISOString(), id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					"Eta must be a valid ISO string",
					"this is a required field",
					"this is a required field at path: \"task\", and it was coerced to  ",
					`Eta must be a valid ISO string at path: "eta", and it was coerced to ${twelve.toISOString()}`,
				]
			}
		},
		{
			description: 'Valid schema, invalid task+id',
			input: { "task": NaN, "waste": 0.01, "ttc": 1, "eta": '2000-01-01T06:00:00.000Z', "id": -0, "status": "completed", "timestamp": 1, "completedTimeStamp": 1, "hidden": false },
			schema: simpleTaskSchema,
			expected: {
				output: { task: 'NaN', waste: 0.01, ttc: 1, eta: '2000-01-01T06:00:00.000Z', id: 1, status: 'completed', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					"Id must be greater than 0",
					"this must be a `string` type, but the final value was: `NaN` (cast from the value `NaN`).",
					"this must be a `string` type, but the final value was: `NaN` (cast from the value `NaN`). at path: \"task\", and it was coerced to NaN",
					"Id must be greater than 0 at path: \"id\", and it was coerced to 1",
				]
			}
		},
		{
			description: 'Valid schema, invalid {}',
			input: {},
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0, ttc: 1, eta: twelve.toISOString(), id: 1, status: 'incomplete', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					"hidden is a required field",
					"this is a required field",
					"this is a required field at path: \"task\", and it was coerced to  ",
					"this is a required field at path: \"waste\", and it was coerced to 0",
					"this is a required field at path: \"ttc\", and it was coerced to 1",
					`this is a required field at path: "eta", and it was coerced to ${twelve.toISOString()}`,
					"Id is required",
					"Id is required at path: \"id\", and it was coerced to 1",
					"this is a required field at path: \"status\", and it was coerced to incomplete",
					"this is a required field at path: \"timestamp\", and it was coerced to 1",
					"this is a required field at path: \"completedTimeStamp\", and it was coerced to 1",
					"this is a required field at path: \"hidden\", and it was coerced to false",
				]
			}
		},
		{
			description: 'Valid schema, invalid null',
			input: null,
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0, ttc: 1, eta: twelve.toISOString(), id: 1, status: 'incomplete', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					"this cannot be null",
					"this is a required field",
					"this is a required field at path: \"task\", and it was coerced to  ",
					"this is a required field at path: \"waste\", and it was coerced to 0",
					"this is a required field at path: \"ttc\", and it was coerced to 1",
					`this is a required field at path: "eta", and it was coerced to ${twelve.toISOString()}`,
					"Id is required",
					"Id is required at path: \"id\", and it was coerced to 1",
					"this is a required field at path: \"status\", and it was coerced to incomplete",
					"this is a required field at path: \"timestamp\", and it was coerced to 1",
					"this is a required field at path: \"completedTimeStamp\", and it was coerced to 1",
					"this is a required field at path: \"hidden\", and it was coerced to false",
				]
			}
		},
		{
			description: 'Valid schema, invalid NaN',
			input: NaN,
			schema: simpleTaskSchema,
			// What? task should be '' ????
			expected: {
				output: { task: 'NaN', waste: 0, ttc: 1, eta: twelve.toISOString(), id: 1, status: 'incomplete', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					"this must be a `object` type, but the final value was: `NaN` (cast from the value `NaN`).",
					"this must be a `string` type, but the final value was: `NaN` (cast from the value `NaN`).",
					"this must be a `string` type, but the final value was: `NaN` (cast from the value `NaN`). at path: \"task\", and it was coerced to NaN",
					"this must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`).",
					"this must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`). at path: \"waste\", and it was coerced to 0",
					"TTC must be a number",
					"TTC must be a number at path: \"ttc\", and it was coerced to 1",
					"Eta must be a valid ISO string",
					`Eta must be a valid ISO string at path: "eta", and it was coerced to ${twelve.toISOString()}`,
					"this must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`). at path: \"id\", and it was coerced to 1",
					"this must be a `string` type, but the final value was: `NaN` (cast from the value `NaN`). at path: \"status\", and it was coerced to incomplete",
					"this must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`). at path: \"timestamp\", and it was coerced to 1",
					"this must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`). at path: \"completedTimeStamp\", and it was coerced to 1",
					"this must be a `boolean` type, but the final value was: `NaN` (cast from the value `NaN`).",
					"this must be a `boolean` type, but the final value was: `NaN` (cast from the value `NaN`). at path: \"hidden\", and it was coerced to false",
				]
			}
		},
		{
			description: 'Valid schema, invalid 1234',
			input: 1234,
			schema: simpleTaskSchema,
			expected: {
				output: { task: ' ', waste: 0, ttc: 1, eta: twelve.toISOString(), id: 1, status: 'incomplete', timestamp: 1, completedTimeStamp: 1, hidden: false },
				errors: [
					"this must be a `object` type, but the final value was: `1234`.",
					"this is a required field",
					"this is a required field at path: \"task\", and it was coerced to  ",
					"this is a required field at path: \"waste\", and it was coerced to 0",
					"this is a required field at path: \"ttc\", and it was coerced to 1",
					`this is a required field at path: "eta", and it was coerced to ${twelve.toISOString()}`,
					"Id is required",
					"Id is required at path: \"id\", and it was coerced to 1",
					"this is a required field at path: \"status\", and it was coerced to incomplete",
					"this is a required field at path: \"timestamp\", and it was coerced to 1",
					"this is a required field at path: \"completedTimeStamp\", and it was coerced to 1",
					"this is a required field at path: \"hidden\", and it was coerced to false",
				]
			}
		},
	]
	testCases.forEach(({ description, input, schema, expected }) => {
		test(description, () => {
			const result = coerceToSchema(input, schema)
			expect(result.output).toEqual(expected.output)
			expect(result.errors).toEqual(expected.errors)
		})
	})

	// Using full task list schema
	const fullTaskTestCases = [
		{
			description: 'f([], fullTasksSchema) => { output: [], errors: [] }',
			input: [],
			schema: fullTasksSchema,
			expected: {
				output: [],
				errors: []
			}
		},
		{
			description: 'f((5)[{...}], fullTasksSchema) => { output: (5)[valid {...}], errors: [atleast 1] }',
			input: [
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
			], // From real life example
			schema: fullTasksSchema,
			expected: {
				output: [
					{
						task: 'task 1',
						waste: -3.9975019444444446,
						ttc: 3,
						eta: "2024-07-10T02:27:46.993Z",
						id: 1716861377766,
						status: 'completed',
						timestamp: 1716687091,
						completedTimeStamp: 1720578466.993,
						hidden: false,
						efficiency: 1330.049240776306,
						parentThread: 'default',
						dueDate: '2024-05-25T17:00:00.000Z',
						dependencies: [],
						weight: 1
					},
					{
						task: ' ',
						waste: 673.4899841666667,
						ttc: 1,
						eta: "2024-07-10T02:27:56.943Z",
						id: 1718143126427,
						status: 'completed',
						timestamp: 1718142843,
						completedTimeStamp: 1720578476.943,
						hidden: false,
						efficiency: 0,
						parentThread: 'default',
						dueDate: '2024-06-11T17:00:00.000Z',
						dependencies: [],
						weight: 1
					},
					{
						task: ' ',
						waste: 452.06042722222224,
						ttc: 1,
						eta: twelve.toISOString(),
						id: 1720578472876,
						status: 'incomplete',
						timestamp: 1720578381,
						completedTimeStamp: 1720578382,
						hidden: false,
						efficiency: 0,
						parentThread: 'default',
						dueDate: '2024-07-09T17:00:00.000Z',
						dependencies: [],
						weight: 1
					},
					{
						task: ' ',
						waste: 0,
						ttc: 1,
						eta: twelve.toISOString(),
						id: 1720578475320,
						status: 'incomplete',
						timestamp: 1720578381,
						completedTimeStamp: 1720578382,
						hidden: false,
						efficiency: 0,
						parentThread: 'default',
						dueDate: '2024-07-09T17:00:00.000Z',
						dependencies: [],
						weight: 1
					},
					{
						task: ' ',
						waste: 0,
						ttc: 1,
						eta: twelve.toISOString(),
						id: 1720578478240,
						status: 'incomplete',
						timestamp: 1720578381,
						completedTimeStamp: 1720578382,
						hidden: false,
						efficiency: 0,
						parentThread: 'default',
						dueDate: '2024-07-09T17:00:00.000Z',
						dependencies: [],
						weight: 1
					}
				],
				errors: [
					'Eta must be a valid ISO string',
					`Eta must be a valid ISO string at path: "2.eta", and it was coerced to ${twelve.toISOString()}`,
					`Eta must be a valid ISO string at path: "3.eta", and it was coerced to ${twelve.toISOString()}`,
					`Eta must be a valid ISO string at path: "4.eta", and it was coerced to ${twelve.toISOString()}`
				]
			}
		},
		{
			description: 'f(default Task, fullTasksSchema) => { output: [], errors: [1 errors] }',
			input: defaultTask,
			schema: fullTasksSchema,
			expected: {
				output: [],
				errors: [
					'this must be a `array` type, but the final value was: `{\n' +
					'  "task": "\\" \\"",\n' +
					'  "waste": "1",\n' +
					'  "ttc": "1",\n' +
					'  "eta": "\\"2024-08-05T17:00:00.000Z\\"",\n' +
					'  "id": "1722911470758",\n' +
					'  "status": "\\"incomplete\\"",\n' +
					'  "timestamp": "1722910996",\n' +
					'  "completedTimeStamp": "1722910996",\n' +
					'  "hidden": "false"\n' +
					'}`.'
				]
			}
		},
	]
	fullTaskTestCases.forEach(({ description, input, schema, expected }) => {
		test(description, () => {
			const result = coerceToSchema(input, schema)
			expect(result.output).toEqual(expected.output)
			expect(result.errors).toEqual(expected.errors)
		})
	})

	// Using full task individual schema
	const fullTaskIndividualTestCases = [
		{
			description: 'f(default Task, fullTaskIndividualSchema) => { output: valid full task, errors: [6 errors] }',
			input: defaultTask,
			schema: taskSchema,
			expected: {
				output: {
					task: ' ',
					waste: 1,
					ttc: 1,
					eta: '2024-08-05T17:00:00.000Z',
					id: 1722911470758,
					status: 'incomplete',
					timestamp: 1722910996,
					completedTimeStamp: 1722910996,
					hidden: false,
					efficiency: 0,
					parentThread: '',
					dueDate: twelve.toISOString(),
					dependencies: [],
					weight: 0
				},
				errors: [
					'weight is a required field',
					'this is a required field',
					'this is a required field at path: "efficiency", and it was coerced to 0',
					'this is a required field at path: "parentThread", and it was coerced to ',
					`this is a required field at path: "dueDate", and it was coerced to ${twelve.toISOString()}`,
					'this is a required field at path: "weight", and it was coerced to 0'
				]
			}
		},
	]
	fullTaskIndividualTestCases.forEach(({ description, input, schema, expected }) => {
		test(description, () => {
			const result = coerceToSchema(input, schema)
			expect(result.output).toEqual(expected.output)
			expect(result.errors).toEqual(expected.errors)
		})
	})
})