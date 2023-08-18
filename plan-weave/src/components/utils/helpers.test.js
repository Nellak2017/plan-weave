import { pureTaskAttributeUpdate, formatTimeLeft } from './helpers'

describe('pureTaskAttributeUpdate function', () => {
	// Data
	const validTaskLists = [
		[ // should work for valid lists of tasks
			{ task: 'Example Task 1', waste: 10, ttc: 5, eta: '01:30', id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: '01:30', id: 2 },
		],
		[{ task: 'Example Task', waste: 1, ttc: 2, eta: '01:30', id: 1 }],
	]

	const extraneousTaskLists = [
		[ // should remove extraneous fields
			{ task: 'Example Task 1', waste: 10, ttc: 5, eta: '01:30', id: 1, extra: 'foo' },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: '01:30', id: 2 },
		],
	]

	const missingFields = [
		[ // should fill in missing fields
			{ task: 'Example Task 1', waste: 10, ttc: 5, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: '01:30', id: 2 },
		],
		[
			{ status: 'completed', task: 'AAA', waste: 2, ttc: 1, eta: null, id: 3 }, // missing timestamp, eta
			{ status: 'completed', task: 'AAA', waste: 2, ttc: 1, eta: undefined, id: 4 }, // missing timestamp, eta
		],
		[
			{ status: 'completed', task: 'AAA', waste: 2, ttc: 1, eta: undefined, id: 4 }, // missing timestamp, eta
			{ status: 'completed', task: 'AAA', waste: 2, ttc: 1, eta: null, id: 3 }, // missing timestamp, eta
		]
	]

	const invalidUpdateFields = [
		[ // should update field, even if field is invalid
			{ task: 'Example Task', waste: 1, ttc: -1, eta: '01:30', id: 1 }
		],
	]

	const invalidFunctionParameters = [ // All of these should .rejects.toThrow(TypeError)
		{ index: null, attribute: 'waste', value: 2, taskList: [] },
		{ index: 0, attribute: null, value: 2, taskList: [] },
		{ index: 0, attribute: 'waste', value: null, taskList: [] },
		{ index: 0, attribute: 'waste', value: 2, taskList: null },
		{ index: 1, attribute: 'waste', value: 2, taskList: validTaskLists[1] },  // should return an error if the index is invalid
		{ index: 1, attribute: 'invalidAttribute', value: 2, taskList: validTaskLists[1] }, // invalid attribute
		{ index: 1, attribute: 'waste', value: 'invalid', taskList: validTaskLists[1] }, // should return an error if the value is invalid
	]

	const invalidIds = [ // should return an error if any id for the given list is undefined/null/invalid
		[
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: '01:30', id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: undefined },
		],
		[
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: '01:30', id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 0 },
		],
		[
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: '01:30', id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: -1 },
		],
		[
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: '01:30', id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: null },
		],
	]

	const duplicateIds = [ // should return an error if any valid id is a duplicate of another in the list
		[
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: '01:30', id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 1 },
		]
	]

	// Tests
	it.each(validTaskLists)('Should work for valid list of tasks', async (...testCase) => {
		const updatedTaskList = await pureTaskAttributeUpdate({ index: 0, attribute: 'waste', value: 2, taskList: testCase })
		expect(updatedTaskList[0]['waste']).toBe(2)
	})

	it.each(extraneousTaskLists)('Should remove extraneous fields, for the task to update only', async (...testCase) => {
		// TODO: Change hard coded 'extra' to be any attribute found that is not in the list
		const updatedTaskList = await pureTaskAttributeUpdate({ index: 0, attribute: 'waste', value: 2, taskList: testCase })
		expect(updatedTaskList[0]['extra']).toBeUndefined()
	})

	it.each(missingFields)('Should fill in empty or missing fields, for the task to update only, with defaults', async (...testCase) => {
		// TODO: Change hard coded eta to be any one of the missing fields and the 'toBe' should be the default value
		const updatedTaskList = await pureTaskAttributeUpdate({ index: 0, attribute: 'ttc', value: 1, taskList: testCase })
		expect(updatedTaskList[0].eta).toBe('12:00')
	})

	it.each(invalidUpdateFields)('Should update the given valid field even if the field is invalid', async (...testCase) => {
		// TODO: Should scan for invalid fields, choose the first one, then do the test with default values applied
		const updatedTaskList = await pureTaskAttributeUpdate({ index: 0, attribute: 'ttc', value: 2, taskList: testCase })
		expect(updatedTaskList[0].ttc).toBe(2)
	})

	it.each(invalidFunctionParameters)('Should return an error if index, attribute, value, or taskList are null/undefined/invalid', async (...testCase) => {
		await expect(() => pureTaskAttributeUpdate(testCase)).rejects.toThrow()
	})

	it.each(invalidIds)('Should return an error if any id for the given list is undefined/null/invalid', async (...testCase) => {
		// Note, this test only covers index = 0, it is to ensure that if there is any id in the list other than index 0, it will throw
		await expect(() => pureTaskAttributeUpdate({ index: 0, attribute: 'waste', value: 2, taskList: testCase })).rejects.toThrow()
	})

	it.each(duplicateIds)('Should return an error if any valid id is a duplicate of another in the list', async (...testCase) => {
		// Note, this test only covers index = 0, it because a duplicate found should throw from any index in the list
		await expect(() => pureTaskAttributeUpdate({ index: 0, attribute: 'waste', value: 2, taskList: testCase })).rejects.toThrow()
	})
})

/*
describe('pureTaskAttributeUpdate function', () => {
	it('should work for a valid task, for the task to update only', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 10, ttc: 5, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: 2, id: 2 },]
		const updatedTaskList = await pureTaskAttributeUpdate({index: 0, attribute: 'waste', value: 2, taskList})
		expect(updatedTaskList[0]['waste']).toBe(2)
	})

	it('should remove extraneous fields, for the task to update only', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 10, ttc: 5, eta: 3, id: 1, extra: 'foo' },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: 2, id: 2 },]
		const updatedTaskList = await pureTaskAttributeUpdate({index: 0, attribute: 'waste', value: 2, taskList})
		expect(updatedTaskList[0]['extra']).toBeUndefined()
	})

	it('should fill in empty or missing fields, for the task to update only, with defaults', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 10, ttc: 5, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: 2, id: 2 },]
		const updatedTaskList = await pureTaskAttributeUpdate({index: 0, attribute: 'ttc', value: 1, taskList})
		expect(updatedTaskList[0].eta).toBe('12:00')
	})

	it('should update the given valid field even if the field is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: -1, eta: 3, id: 1 }]
		const updatedTaskList = await pureTaskAttributeUpdate({index: 0, attribute: 'ttc', value: 2, taskList})
		expect(updatedTaskList[0].ttc).toBe(2)
	})

	it('should return an error if index, attribute, value, or taskList are null/undefined', async () => {
		await expect(() => pureTaskAttributeUpdate({index: null, attribute: 'waste', value: 2, taskList: []})).rejects.toThrow(TypeError)
		await expect(() => pureTaskAttributeUpdate({index: 0, attribute: null, value: 2, taskList: []})).rejects.toThrow(TypeError)
		await expect(() => pureTaskAttributeUpdate({index: 0, attribute: 'waste', value: null, taskList: []})).rejects.toThrow(TypeError)
		await expect(() => pureTaskAttributeUpdate({index: 0, attribute: 'waste', value: 2, taskList: null})).rejects.toThrow(TypeError)
	})

	it('should return an error if the index is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: 2, eta: 3, id: 1 }]
		await expect(() => pureTaskAttributeUpdate({index: 1, attribute: 'waste', value: 2, taskList})).rejects.toThrow()
	})

	it('should return an error if the attribute is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: 2, eta: 3, id: 1 }]
		await expect(() => pureTaskAttributeUpdate({index: 1, attribute: 'invalidAttribute', value: 2, taskList})).rejects.toThrow()
	})

	it('should return an error if the value is invalid', async () => {
		const taskList = [{ task: 'Example Task', waste: 1, ttc: 2, eta: 3, id: 1 }]
		await expect(() => pureTaskAttributeUpdate({index: 1, attribute: 'waste', value: 'invalid', taskList})).rejects.toThrow()
	})

	it('should return an error if any id for the given list is undefined/null/invalid', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: undefined }
		]
		await expect(() => pureTaskAttributeUpdate({index: 0, attribute: 'waste', value: 2, taskList})).rejects.toThrow()

		const taskList1 = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: 0 }
		]
		await expect(() => pureTaskAttributeUpdate({index: 1, attribute: 'waste', value: 2, taskList1})).rejects.toThrow()

		const taskList2 = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: -1 }
		]
		await expect(() => pureTaskAttributeUpdate({index: 0, attribute: 'waste', value: 2, taskList2})).rejects.toThrow()

		const taskList3 = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: null }
		]
		await expect(() => pureTaskAttributeUpdate({index: 0, attribute: 'waste', value: 2, taskList3})).rejects.toThrow()
	})

	it('should return an error if any valid id is a duplicate of another in the list', async () => {
		const taskList = [
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: 3, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: 3, id: 1 }
		]
		await expect(() => pureTaskAttributeUpdate({index: 0, attribute: 'waste', value: 2, taskList})).rejects.toThrow()
	})
}
)
*/

// TODO: TEST THIS FUNCTION MORE RIGOUROUSLY! I think the Overnight mode is messed up.

describe('calculateTimeLeft', () => {
	it('should return the correct string when endTime - startTime = 1', () => {
		const currentTime = new Date('2023-08-09T12:00:00')
		const endTime = new Date('2023-08-09T13:00:00')
		const result = formatTimeLeft({ currentTime, endTime })

		expect(result).toBe('1 hours left')
	})

	it('should return the correct string when endTime - startTime < 1', () => {
		const currentTime = new Date('2023-08-09T12:00:00')
		const endTime = new Date('2023-08-09T12:30:00')
		const result = formatTimeLeft({ currentTime, endTime })

		expect(result).toBe('30 minutes left')
	})

	it('should return the correct string when endTime - startTime > 1 and not an integer', () => {
		const currentTime = new Date('2023-08-09T12:00:00')
		const endTime = new Date('2023-08-09T14:45:00')
		const result = formatTimeLeft({ currentTime, endTime })

		expect(result).toBe('2 hours 45 minutes left')
	})

	it('should return 0 minutes left when endTime < startTime and overNightMode is false', () => {
		const currentTime = new Date('2023-08-09T12:00:00')
		const endTime = new Date('2023-08-09T11:30:00')
		const result = formatTimeLeft({ currentTime, endTime })

		expect(result).toBe('0 minutes left')
	})

	it('should display "1 hour left" when timeDifference is 1', () => {
		const result = formatTimeLeft({
			timeDifference: 1,
		})

		expect(result).toBe('1 hours left')
	})

	it('should display "${minutes} minutes left" when timeDifference is .5', () => {
		const result = formatTimeLeft({
			timeDifference: 0.5,
		})

		expect(result).toBe('30 minutes left')
	})

	it('should display "${hours} hours ${minutes} minutes left" when timeDifference is 2.75', () => {
		const result = formatTimeLeft({
			timeDifference: 2.75,
		})

		expect(result).toBe('2 hours 45 minutes left')
	})

	it('should display "2 hours left" when timeDifference is 2', () => {
		const result = formatTimeLeft({
			timeDifference: 2,
		})

		expect(result).toBe('2 hours left')
	})

})