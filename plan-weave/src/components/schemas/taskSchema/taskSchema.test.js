import { taskSchema, fillDefaults } from "./taskSchema"
import { DEFAULT_FULL_TASK, TASK_STATUSES } from "../../utils/constants"

const twelve = new Date(new Date().setHours(12, 0, 0, 0))

describe('Task Schema', () => {

	const testData = [
		// Normal cases
		{
			description: 'Should work on valid Full Tasks',
			input: DEFAULT_FULL_TASK,
			expectValid: true,
		},
		{
			description: 'Should work on valid Full Tasks Generated with fillDefaults function',
			input: fillDefaults({}),
			expectValid: true,
		},
		// Edge case: Minimum values
		{
			description: 'Minimum values for Full Task',
			input: {
				task: ' ',
				waste: 0,
				ttc: 0.01,
				eta: twelve.toISOString(),
				id: 1,
				status: TASK_STATUSES.INCOMPLETE,
				timestamp: 1,
				completedTimeStamp: 1,
				hidden: false,
				efficiency: 0,
				parentThread: ' ',
				dueDate: twelve.toISOString(),
				dependencies: [],
				weight: 0,
			},
			expectValid: true,
		},
		// Edge case: Maximum values
		{
			description: 'Maximum values for Full Task',
			input: {
				task: 'X'.repeat(50), // Maximum length
				waste: Number.MAX_SAFE_INTEGER,
				ttc: Number.MAX_SAFE_INTEGER,
				eta: new Date(Date.now() + 1000000).toISOString(),
				id: Number.MAX_SAFE_INTEGER,
				status: TASK_STATUSES.COMPLETED,
				timestamp: Number.MAX_SAFE_INTEGER,
				completedTimeStamp: Number.MAX_SAFE_INTEGER,
				hidden: true,
				efficiency: 100,
				parentThread: 'X'.repeat(50), // Maximum length
				dueDate: new Date(Date.now() + 1000000).toISOString(),
				dependencies: [
					fillDefaults({ id: 1 }),
					fillDefaults({ id: 2 }),
				],
				weight: Number.MAX_SAFE_INTEGER,
			},
			expectValid: true,
		},
		// Error case: Invalid efficiency (greater than 86400) (one day)
		{
			description: 'Invalid efficiency value (greater than 86400) (one day in seconds)',
			input: {
				...fillDefaults(),
				efficiency: 86400 + 1,
			},
			expectValid: false,
		},
		// Error case: Invalid parentThread (greater than 50 characters)
		{
			description: 'Invalid parentThread value (greater than 50 characters)',
			input: {
				...fillDefaults(),
				parentThread: 'X'.repeat(51),
			},
			expectValid: false,
		},
		// Error case: Invalid dueDate (not a valid ISO string)
		{
			description: 'Invalid dueDate value (not a valid ISO string)',
			input: {
				...fillDefaults(),
				dueDate: 'invalid-date',
			},
			expectValid: false,
		},
		// Error case: Invalid dependencies (not a array type)
		{
			description: 'Invalid dueDate value (not a valid ISO string)',
			input: {
				...fillDefaults(),
				dependencies: {},
			},
			expectValid: false,
		},
		// Error case: Invalid weight (negative)
		{
			description: 'Invalid weight value (negative)',
			input: {
				...fillDefaults(),
				weight: -1,
			},
			expectValid: false,
		},
	]

	// Run parameterized tests
	testData.forEach(({ description, input, expectValid }) => {
		it(description, async () => {
			const isValid = await taskSchema.isValid(input)
			expect(isValid).toBe(expectValid)
		})
	})
})