import { simpleTaskSchema, fillDefaultsForSimpleTask } from "./simpleTaskSchema"
import { TASK_STATUSES } from '../../utils/constants'

const validTask = {
	task: 'Example task',
	waste: 1,
	ttc: 1,
	eta: '14:30',
	id: 1,
	// missing status
}

describe('Simple Task Schema', () => {
	const validTestCases = [
		validTask,
		// Add other valid test cases here
	]

	const invalidTestCases = [
		{
			task: {}, // invalid type
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		{
			task: 'Example task',
			waste: 'invalid', // invalid type
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		{
			task: 'Example task',
			waste: 1,
			ttc: 'invalid', // invalid type
			eta: '14:30',
			id: 1,
		},
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: 1, // invalid type
			id: 1,
		},
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			// id is missing
		},
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: 1,
			id: 'invalid', // invalid type
		},
		{
			task: 'My Task',
			waste: 0, // invalid
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		{
			task: 'My Task',
			waste: 1,
			ttc: 0, // invalid
			eta: '14:30',
			id: 1,
		},
		{
			task: 'My Task',
			waste: 1,
			ttc: 1,
			eta: 'invalid', // invalid
			id: 1,
		},
		{
			task: 'My Task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 0, // invalid
		},
		{
			// Empty object
		},
		{
			// Some attributes missing
			task: 'Example task',
			waste: 1,
			// ttc, eta, id missing
		},
		{
			// Invalid status
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
			status: 'InvalidStatus', // This status is not one of the allowed values
		},
		// Add more invalid test cases as needed
	]

	const defaultAttributesTestCases = [
		// Add test cases for default attributes here
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '12:00',
			id: 1,
			status: TASK_STATUSES.INCOMPLETE,
		}
	]

	const validStatuses = [
		TASK_STATUSES.COMPLETED,
		TASK_STATUSES.INCOMPLETE,
		TASK_STATUSES.INCONSISTENT,
		TASK_STATUSES.WAITING
		// Add other valid statuses here
	]

	const invalidStatuses = [
		'InvalidStatus', // This status is not one of the allowed values
		// Add other invalid statuses here
	]

	const validTimeStrings = [
		'00:00', '01:30', '12:45', '23:59',
		// Add other valid time strings here
	]

	const invalidHours = ['-1', '25', 'abc', '123']

	const invalidMinutes = ['-1', '60', 'abc', '123']

	const missingColonTimes = ['1200', '0100', '1230', '0500']

	const invalidLengthTestCases = [
		{
			task: 'x'.repeat(51), // 51 characters
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		{
			task: 'x'.repeat(52), // 52 characters
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		{
			task: 'x'.repeat(500), // 500 characters
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		// Add more invalid length test cases as needed
	]

	it.each(validTestCases)('Should work on valid task', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase)
		expect(result).toBe(true)
	})

	it.each(invalidTestCases)('Should reject invalid task', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase)
		expect(result).toBe(false)
	})

	it.each(defaultAttributesTestCases)('Should accept all default attributes', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase)
		expect(result).toBe(true)
	})

	it.each(validStatuses)('Should accept valid status', async (status) => {
		const validTaskWithStatus = { ...validTask, status }
		const result = await simpleTaskSchema.isValid(validTaskWithStatus)
		expect(result).toBe(true)
	})

	it.each(invalidStatuses)('Should reject invalid status', async (status) => {
		const invalidTaskWithStatus = { ...validTask, status }
		const result = await simpleTaskSchema.isValid(invalidTaskWithStatus)
		expect(result).toBe(false)
	})

	it.each(validTimeStrings)('Should accept valid time string', async (eta) => {
		const validTaskWithEta = { ...validTask, eta }
		const result = await simpleTaskSchema.isValid(validTaskWithEta)
		expect(result).toBe(true)
	})

	it.each(invalidHours)('Should reject time string with invalid hours', async (hour) => {
		const invalidTask = { ...validTask, eta: `${hour}:00` }
		const result = await simpleTaskSchema.isValid(invalidTask)
		expect(result).toBe(false)
	})

	it.each(invalidMinutes)('Should reject time string with invalid minutes', async (minute) => {
		const invalidTask = { ...validTask, eta: `12:${minute}` }
		const result = await simpleTaskSchema.isValid(invalidTask)
		expect(result).toBe(false)
	})

	it.each(missingColonTimes)('Should reject time string without colon', async (time) => {
		const invalidTask = { ...validTask, eta: time }
		const result = await simpleTaskSchema.isValid(invalidTask)
		expect(result).toBe(false)
	})
	it.each(invalidLengthTestCases)('Should reject task with incorrect length', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase)
		expect(result).toBe(false)
	})
})

/*
describe('Simple Task Schema', () => {
	it('Should work on valid tasks', async () => {
		// Arrange
		const validTask = {
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		}

		// Act
		const result = await simpleTaskSchema.isValid(validTask)

		// Assert
		expect(result).toBe(true)
	})

	it('Should reject task not being a string', async () => {
		const invalidTask = {
			task: {}, // invalid type
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject task with incorrect length', async () => {
		// Test cases for task length: 0, 1, 49, 50, 51
		const validLengths = [0, 1, 49, 50]

		for (const length of validLengths) {
			const validTask = {
				task: 'x'.repeat(length),
				waste: 1,
				ttc: 1,
				eta: '14:30',
				id: 1,
			}

			const result = await simpleTaskSchema.isValid(validTask)

			expect(result).toBe(true)
		}

		const invalidLengths = [51, 52, 500]

		for (const length of invalidLengths) {
			const invalidTask = {
				task: 'x'.repeat(length),
				waste: 1,
				ttc: 1,
				eta: '14:30',
				id: 1,
			}

			const result = await simpleTaskSchema.isValid(invalidTask)

			expect(result).toBe(false)
		}
	})

	it('Should reject waste not being a number', async () => {
		const invalidTask = {
			task: 'Example task',
			waste: 'invalid', // invalid type
			ttc: 1,
			eta: '14:30',
			id: 1,
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject ttc not being a number', async () => {
		const invalidTask = {
			task: 'Example task',
			waste: 1,
			ttc: 'invalid', // invalid type
			eta: '14:30',
			id: 1,
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject eta not being a string', async () => {
		const invalidTask = {
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: 1, // invalid type
			id: 1,
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject missing id', async () => {
		const invalidTask = {
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			// id is missing
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject id not being a number', async () => {
		const invalidTask = {
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: 1,
			id: 'invalid', // invalid type
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject waste <= 0', async () => {
		const invalidTask = {
			task: 'My Task',
			waste: 0, // invalid
			ttc: 1,
			eta: '14:30',
			id: 1,
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject ttc <= 0', async () => {
		const invalidTask = {
			task: 'My Task',
			waste: 1,
			ttc: 0, // invalid
			eta: '14:30',
			id: 1,
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject eta being literally "invalid" string', async () => {
		const invalidTask = {
			task: 'My Task',
			waste: 1,
			ttc: 1,
			eta: 'invalid', // invalid
			id: 1,
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject id <= 0', async () => {
		const invalidTask = {
			task: 'My Task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 0, // invalid
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject empty object', async () => {
		const invalidTask = {}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should accept all default attributes object', async () => {
		const validTask = fillDefaultsForSimpleTask({})

		const result = await simpleTaskSchema.isValid(validTask)

		expect(result).toBe(true)
	})

	it('Should accept valid status', async () => {
		const validTask = {
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
			status: TASK_STATUSES.COMPLETED, // or 'Incomplete', 'Waiting', 'Inconsistent'
		}

		const result = await simpleTaskSchema.isValid(validTask)

		expect(result).toBe(true)
	})

	it('Should reject invalid status', async () => {
		const invalidTask = {
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
			status: 'InvalidStatus', // This status is not one of the allowed values
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should accept task with missing status', async () => {
		const validTask = {
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
			// no status
		}

		const result = await simpleTaskSchema.isValid(validTask)

		expect(result).toBe(true)
	})

	it('Should accept valid time string', async () => {
		const validHours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
		const validMinutes = ['00', '15', '30', '45']

		for (const hour of validHours) {
			for (const minute of validMinutes) {
				const validTime = `${hour}:${minute}`
				const validTask = {
					task: 'Example task',
					waste: 1,
					ttc: 1,
					eta: validTime,
					id: 1,
				}

				const result = await simpleTaskSchema.isValid(validTask)

				expect(result).toBe(true)
			}
		}
	})

	it('Should reject time string with invalid hours', async () => {
		const invalidHours = ['-1', '25', 'abc', '123']

		for (const hour of invalidHours) {
			const invalidTime = `${hour}:00`
			const invalidTask = {
				task: 'Example task',
				waste: 1,
				ttc: 1,
				eta: invalidTime,
				id: 1,
			}

			const result = await simpleTaskSchema.isValid(invalidTask)

			expect(result).toBe(false)
		}
	})

	it('Should reject time string with invalid minutes', async () => {
		const invalidMinutes = ['-1', '60', 'abc', '123']

		for (const minute of invalidMinutes) {
			const invalidTime = `12:${minute}`
			const invalidTask = {
				task: 'Example task',
				waste: 1,
				ttc: 1,
				eta: invalidTime,
				id: 1,
			}

			const result = await simpleTaskSchema.isValid(invalidTask)

			expect(result).toBe(false)
		}
	})

	it('Should reject time string without colon', async () => {
		const missingColonTimes = ['1200', '0100', '1230', '0500']

		for (const time of missingColonTimes) {
			const invalidTask = {
				task: 'Example task',
				waste: 1,
				ttc: 1,
				eta: time,
				id: 1,
			}

			const result = await simpleTaskSchema.isValid(invalidTask)

			expect(result).toBe(false)
		}
	})
})
*/