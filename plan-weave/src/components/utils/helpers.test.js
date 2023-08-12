import { pureTaskAttributeUpdate } from './helpers'

describe('pureTaskAttributeUpdate function', () => {
	it('should work for a valid task, for the task to update only', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 10, ttc: 5, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: 2, id: 2 },]
		const updatedTaskList = await pureTaskAttributeUpdate(0, 'waste', 2, taskList)
		expect(updatedTaskList[0]['waste']).toBe(2)
	})

	it('should remove extraneous fields, for the task to update only', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 10, ttc: 5, eta: 3, id: 1, extra: 'foo' },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: 2, id: 2 },]
		const updatedTaskList = await pureTaskAttributeUpdate(0, 'waste', 2, taskList)
		expect(updatedTaskList[0]['extra']).toBeUndefined()
	})

	it('should fill in empty or missing fields, for the task to update only, with defaults', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 10, ttc: 5, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: 2, id: 2 },]
		const updatedTaskList = await pureTaskAttributeUpdate(0, 'ttc', 1, taskList)
		expect(updatedTaskList[0].eta).toBe(1)
	})

	it('should update the given valid field even if the field is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: -1, eta: 3, id: 1 }]
		const updatedTaskList = await pureTaskAttributeUpdate(0, 'ttc', 2, taskList)
		expect(updatedTaskList[0].ttc).toBe(2)
	})

	it('should return an error if index, attribute, value, or taskList are null/undefined', async () => {
		await expect(() => pureTaskAttributeUpdate(null, 'waste', 2, [])).rejects.toThrow(TypeError)
		await expect(() => pureTaskAttributeUpdate(0, null, 2, [])).rejects.toThrow(TypeError)
		await expect(() => pureTaskAttributeUpdate(0, 'waste', null, [])).rejects.toThrow(TypeError)
		await expect(() => pureTaskAttributeUpdate(0, 'waste', 2, null)).rejects.toThrow(TypeError)
	})

	/*
	it('should return an error if the index is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: 2, eta: 3, id: 1 }]
		expect(async () => await pureTaskAttributeUpdate(1, 'waste', 2, taskList)).toThrow()
	})

	it('should return an error if the attribute is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: 2, eta: 3, id: 1 }]
		expect(async () => await pureTaskAttributeUpdate(0, 'invalidAttribute', 2, taskList)).toThrow()
	})

	it('should return an error if the value is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: 2, eta: 3, id: 1 }]
		expect(async () => await  pureTaskAttributeUpdate(0, 'waste', 'invalidValue', taskList)).toThrow()
	})

	it('should return an error if any id for the given list is undefined/null/invalid', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: undefined },
		]
		expect(async () => await pureTaskAttributeUpdate(0, 'waste', 2, taskList)).toThrow()

		const taskList1 = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: 0 },
		]
		expect(async () => await pureTaskAttributeUpdate(0, 'waste', 2, taskList1)).toThrow()

		const taskList2 = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: -1 },
		]
		expect(async () => await pureTaskAttributeUpdate(0, 'waste', 2, taskList2)).toThrow()
	})

	it('should return an error if any valid id is a duplicate of another in the list', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: 1 },
		]
		expect(async () => await pureTaskAttributeUpdate(0, 'waste', 2, taskList)).toThrow()
	})
	*/
	it('should return an error if the index is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: 2, eta: 3, id: 1 }]
		await expect(() => pureTaskAttributeUpdate(1, 'waste', 2, taskList)).rejects.toThrow()
	})
	
	it('should return an error if the attribute is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: 2, eta: 3, id: 1 }]
		await expect(() => pureTaskAttributeUpdate(0, 'invalidAttribute', 2, taskList)).rejects.toThrow()
	})
	
	it('should return an error if the value is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: 2, eta: 3, id: 1 }]
		await expect(() => pureTaskAttributeUpdate(0, 'waste', 'invalidValue', taskList)).rejects.toThrow()
	})
	
	it('should return an error if any id for the given list is undefined/null/invalid', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: undefined }
		]
		await expect(() => pureTaskAttributeUpdate(0, 'waste', 2, taskList)).rejects.toThrow()
	
		const taskList1 = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: 0 }
		]
		await expect(() => pureTaskAttributeUpdate(0, 'waste', 2, taskList1)).rejects.toThrow()
	
		const taskList2 = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: -1 }
		]
		await expect(() => pureTaskAttributeUpdate(0, 'waste', 2, taskList2)).rejects.toThrow()

		const taskList3 = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: null }
		]
		await expect(() => pureTaskAttributeUpdate(0, 'waste', 2, taskList3)).rejects.toThrow()
	})
	
	it('should return an error if any valid id is a duplicate of another in the list', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: 1 }
		]
		await expect(() => pureTaskAttributeUpdate(0, 'waste', 2, taskList)).rejects.toThrow()
	})
}
)
