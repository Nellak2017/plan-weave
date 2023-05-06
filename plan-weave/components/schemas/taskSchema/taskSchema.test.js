import { taskSchema } from "./taskSchema"
import * as Yup from 'yup'

describe('Task Schema', () => {
	it('Should work on valid tasks', async () => {
		// Arrange
		const validTask = {
			name: 'My Task',
			efficiency: 0.5,
			eta: 2,
			ata: 4,
			parentThread: null,
			dueDate: new Date(),
			dependencies: [],
			value: 100,
		}

		// Act
		const result = await taskSchema.isValid(validTask)

		// Assert
		expect(result).toBe(true)
	})

	it('Should reject bad names', async () => {
		const invalidTask = {
			name: {}, // invalid type
			efficiency: 0.5,
			eta: 2,
			ata: 4,
			parentThread: null,
			dueDate: new Date(),
			dependencies: [],
			value: 100,
		  }
	  
		  const result = await taskSchema.isValid(invalidTask)

		  expect(result).toBe(false)
	})

	it('Should reject bad efficiency that is not eta/ata', async () => {
		const invalidTask = {
			name: 'My Task',
			efficiency: 0.4, // .4 != eta / ata
			eta: 2,
			ata: 4,
			parentThread: null,
			dueDate: new Date(),
			dependencies: [],
			value: 100,
		  }
	  
		  const result = await taskSchema.isValid(invalidTask)

		  expect(result).toBe(false)
	})

	it('Should reject eta = 0', async () => {
		const invalidTask = {
			name: 'My Task',
			efficiency: 0.5,
			eta: 0, // 0 is invalid
			ata: 4,
			parentThread: null,
			dueDate: new Date(),
			dependencies: [],
			value: 100,
		  }
	  
		  const result = await taskSchema.isValid(invalidTask)

		  expect(result).toBe(false)
	})

	it('Should reject ata = 0', async () => {
		const invalidTask = {
			name: 'My Task',
			efficiency: 0.5,
			eta: 2,
			ata: 0, // invalid
			parentThread: null,
			dueDate: new Date(),
			dependencies: [],
			value: 100,
		  }
	  
		  const result = await taskSchema.isValid(invalidTask)

		  expect(result).toBe(false)
	})

	it('Should reject parent thread not being a list type and not null', async () => {
		const invalidTask = {
			name: 'My Task',
			efficiency: 0.5,
			eta: 2,
			ata: 4,
			parentThread: {}, // invalid
			dueDate: new Date(),
			dependencies: [],
			value: 100,
		  }
	  
		  const result = await taskSchema.isValid(invalidTask)

		  expect(result).toBe(false)
	})

	it('Should reject dueDate not being a date and not null', async () => {
		const invalidTask = {
			name: 'My Task',
			efficiency: 0.5,
			eta: 2,
			ata: 4,
			parentThread: null,
			dueDate: 'invalid',
			dependencies: [],
			value: 100,
		  }
	  
		  const result = await taskSchema.isValid(invalidTask)

		  expect(result).toBe(false)
	})

	it('Should reject dependencies not having list type', async () => {
		const invalidTask = {
			name: 'My Task',
			efficiency: 0.5,
			eta: 2,
			ata: 4,
			parentThread: null,
			dueDate: new Date(),
			dependencies: {}, // invalid
			value: 100,
		  }
	  
		  const result = await taskSchema.isValid(invalidTask)

		  expect(result).toBe(false)
	})

	it('Should reject negative values', async () => {
		const invalidTask = {
			name: 'My Task',
			efficiency: 0.5,
			eta: 2,
			ata: 4,
			parentThread: null,
			dueDate: new Date(),
			dependencies: [],
			value: -100, // invalid
		  }
	  
		  const result = await taskSchema.isValid(invalidTask)

		  expect(result).toBe(false)
	})
})