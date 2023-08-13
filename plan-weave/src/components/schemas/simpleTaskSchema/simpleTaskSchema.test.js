import { simpleTaskSchema, fillDefaultsForSimpleTask } from "./simpleTaskSchema"
import { TASK_STATUSES } from '../../utils/constants'

describe('Simple Task Schema', () => {
	it('Should work on valid tasks', async () => {
		// Arrange
		const validTask = {
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: 1,
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
			eta: 1,
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
				eta: 1,
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
				eta: 1,
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
			eta: 1,
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
			eta: 1,
			id: 1,
		};

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject eta not being a number', async () => {
		const invalidTask = {
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: 'invalid', // invalid type
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
			eta: 1,
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
			eta: 1,
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
			eta: 1,
			id: 1,
		}

		const result = await simpleTaskSchema.isValid(invalidTask)

		expect(result).toBe(false)
	})

	it('Should reject eta <= 0', async () => {
		const invalidTask = {
			task: 'My Task',
			waste: 1,
			ttc: 1,
			eta: 0, // invalid
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
			eta: 1,
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
			eta: 1,
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
			eta: 1,
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
		  eta: 1,
		  id: 1,
		  // no status
		}
	  
		const result = await simpleTaskSchema.isValid(validTask)
	  
		expect(result).toBe(true)
	  })
})