import { taskEditorOptionsSchema, fillWithOptionDefaults } from "./TaskEditorOptionsSchema"

describe('Task Editor Options Schema', () => {

	// Test Data
	const validTestCases = [
		[{ // Example valid option object
			name: 'Example Name',
			listener: () => { },
			algorithm: 'Example Algorithm'
		},
		{ // Example valid option object
			name: 'Example Name 2',
			listener: () => { console.log("hello world") },
			algorithm: 'Example Algorithm'
		}],
		// Add other valid test cases here
	]
	const invalidTestCases = [
		[{ // Invalid option object with missing name
			listener: () => { },
			algorithm: 'Example Algorithm'
		}],
		[{ // Invalid option object with empty name
			name: '',
			listener: () => { },
			algorithm: 'Example Algorithm'
		}],
		[{ // Invalid option object with empty name
			name: '123456789123456789111', // 21 characters instead of 20 or less
			listener: () => { },
			algorithm: 'Example Algorithm'
		}],
		// Add other invalid test cases here
	]

	const expectedFilledOption = {
		name: '',
		listener: expect.any(Function),
		algorithm: '',
	}

	// Test Cases
	it.each(validTestCases)('Should work on valid option', async (...testCase) => {
		const result = await taskEditorOptionsSchema.isValid(testCase)
		expect(result).toBe(true)
	})

	it.each(invalidTestCases)('Should reject invalid option', async (...testCase) => {
		const result = await taskEditorOptionsSchema.isValid(testCase)
		expect(result).toBe(false)
	})

	it('Should fill option object with default values', () => {
		const filledOption = fillWithOptionDefaults({})
		expect(filledOption).toEqual(expectedFilledOption)
	})

})