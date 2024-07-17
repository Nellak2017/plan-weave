/* eslint-disable max-lines */
import {
	isDictionary, // example based only
	isIterable, // example based only
	isNode, // example based only
	isInputValid, // example based only
	makeIterable, // example based only
	// enhancedCastPrimitive, // property tested and example based too
	dfsFns, // (_ sub-functions out of _ tested with _ and _)
	// coerceToSchema, // proerty tested and examble based too
} from './schema-helpers.js'
// import { simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema.js'
// import { fc } from '@fast-check/jest'
import * as Yup from 'yup'

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
			expected: { output: { b: '123' }, errors: ['Invalid type at path: "b", and it was coerced to 123'] }
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
			expected: { output: { c: 10 }, errors: ['Invalid type at path: "c", and it was coerced to 10'] }
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
			expected: { output: { d: "" }, errors: ['Previous error', "Invalid type at path: \"d\", and it was coerced to "] }
		}
	]

	testCases.forEach(({ input, expected }) => {
		test(`processNodes with input ${JSON.stringify(input)} should return ${JSON.stringify(expected)}`, () => {
			expect(processNodes(input)).toEqual(expected)
		})
	})
})

describe('dfsFns.dfs', () => {
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
})