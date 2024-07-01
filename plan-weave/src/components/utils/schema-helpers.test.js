import {
	isDictionary, // example based only
	isIterable, // example based only
	isNode, // example based only
	isInputValid, // example based only
} from './schema-helpers.js'
// import { simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema.js'
// import { fc } from '@fast-check/jest'
import * as Yup from 'yup'

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