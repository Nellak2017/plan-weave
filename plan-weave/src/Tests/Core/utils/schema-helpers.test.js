import { isInputValid } from '../../../Core/utils/schema-helpers.js'
import * as Yup from 'yup'

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
		it(description, () => { expect(isInputValid(input, schema)).toEqual(expected) })
	})
})