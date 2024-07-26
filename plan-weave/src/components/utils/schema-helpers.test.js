/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import {
	isDictionary, // example based only
	isIterable, // example based only
	isNode, // example based only
	isInputValid, // example based only
	isValidFieldTypes, // example based only
	makeIterable, // example based only
	dfsFns, // (_ sub-functions out of _ tested with _ and _)
	// enhancedCastPrimitive, // property tested and example based too
	// coerceToSchema, // proerty tested and examble based too
} from './schema-helpers.js'
// import { simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema.js'
import { fc } from '@fast-check/jest'
import * as Yup from 'yup'

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
		{ input: { type: 'array' }, expected: true, description: 'Array without inner fields should be a node' },
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
		test(`returns ${expected} for input ${JSON.stringify(input)} and path ${path}`, () => {
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
	// Fixed schema definition (Surrogate)
	const schema = Yup.object().shape({
		primitiveField: Yup.string().default('defaultString'),
		arrayFieldNoInnerDict: Yup.array().of(Yup.number().default(0)),
		arrayFieldWithInnerDict: Yup.array().of(
			Yup.object().shape({
				innerField: Yup.string().required(),
			})
		),
		dictionaryField: Yup.object().shape({
			dictField: Yup.number().default(42),
		}),
	})
	const validDataArbitrary = fc.record({
		primitiveField: fc.string({ minLength: 1 }),
		arrayFieldNoInnerDict: fc.array(fc.integer()),
		arrayFieldWithInnerDict: fc.array(fc.record({ innerField: fc.string({ minLength: 1 }) }), { minLength: 1 }),
		dictionaryField: fc.record({ dictField: fc.integer() }),
	})

	/*
	Properties known, but not tested:

	8. Default values of schema when field is not coerceable - f(a) returns each field with the default value of the schema at each point iff the field is not coercable
	9. Type Default values when field is coerceable AND invalid - f(a) returns each field with the Type default at each point iff the field is coercable and invalid
	*/

	// 1. Idempotence of data - f(a).output === f(f(a).output).output 
	test('dfsFns.dfs is idempotent. f(a) === c === f(c.output)', () => {
		fc.assert(
			fc.property(validDataArbitrary, (input) => {
				// input is from the validDataArbitrary, schema is from fixed definition above
				const result1 = dfs({ input, schema }) // f(a) = c
				const result2 = dfs({ input: result1.output, schema }) // c = f(c.output)
				expect(result1).toStrictEqual(result2) // f(a) = c = f(c.output). f(a) = f(f(a).output)
			}),
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
			, { seed: -828827706, numRuns: 100000 }
		)
	})

	// 7. Non-altering of valid data - f(a.output).output = a.output if a.output is valid against the schema
	test('Non-altering of valid data - f(a.output).output = a.output if a.output is valid against the schema', () => {
		fc.assert(
			fc.property(validDataArbitrary, (input) => {
				const a = dfs({ input, schema }) // a
				const c = dfs({ input: a.output, schema }).output // f(a.output).output = c
				const d = a.output // a.output = d
				expect(c).toStrictEqual(d) // f(a.output).output = a.output :=> c = d
			})
			, { numRuns: 10000 }
		)
	})

	/*
		What my 7 properties prove so far:

		dfs({ input, schema }) => { 
			output: 
				input is valid -> valid output,
				input is not valid -> output with correct type and shape only,
			, 
			errors: 
				input is valid -> [],
				input is not valid -> [string+] where there is Yup errors included that are informative 
			}

		So what this means is that the way to move forward is to constrain output even more by proving special cases such as when all defaults are defined and valid.
	*/
})