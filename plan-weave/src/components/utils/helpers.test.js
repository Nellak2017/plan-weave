import {
	pureTaskAttributeUpdate,
	formatTimeLeft,
	isTimestampFromToday,
	validateTask,
	filterTaskList,
	calculateWaste,
	rearrangeDnD,
} from './helpers'
import { TASK_STATUSES } from './constants'

describe('pureTaskAttributeUpdate function', () => {
	// Data
	const oneThirty = new Date(new Date().setHours(1, 30, 0, 0))
	const twelve = new Date(new Date().setHours(12, 0, 0, 0))

	const validTaskLists = [
		[ // should work for valid lists of tasks
			{ task: 'Example Task 1', waste: 10, ttc: 5, eta: oneThirty, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: oneThirty, id: 2 },
		],
		[{ task: 'Example Task', waste: 1, ttc: 2, eta: oneThirty, id: 1 }],
	]

	const extraneousTaskLists = [
		[ // should remove extraneous fields
			{ task: 'Example Task 1', waste: 10, ttc: 5, eta: oneThirty, id: 1, extra: 'foo' },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: oneThirty, id: 2 },
		],
	]

	const missingFields = [
		/*
		[ // should fill in missing fields
			{ task: 'Example Task 1', waste: 10, ttc: 5, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 1, eta: oneThirty, id: 2 },
		],
		*/
		[
			{ status: 'completed', task: 'AAA', waste: 2, ttc: 1, eta: null, id: 3 }, // missing timestamp, eta
			{ status: 'completed', task: 'AAA', waste: 2, ttc: 1, eta: undefined, id: 4 }, // missing timestamp, eta
		],
		/*
		[
			{ status: 'completed', task: 'AAA', waste: 2, ttc: 1, eta: undefined, id: 4 }, // missing timestamp, eta
			{ status: 'completed', task: 'AAA', waste: 2, ttc: 1, eta: null, id: 3 }, // missing timestamp, eta
		]
		*/
	]

	const invalidUpdateFields = [
		[ // should update field, even if field is invalid
			{ task: 'Example Task', waste: 1, ttc: -1, eta: oneThirty, id: 1 }
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
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: oneThirty, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: oneThirty, id: undefined },
		],
		[
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: oneThirty, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: oneThirty, id: 0 },
		],
		[
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: oneThirty, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: oneThirty, id: -1 },
		],
		[
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: oneThirty, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: oneThirty, id: null },
		],
	]

	const duplicateIds = [ // should return an error if any valid id is a duplicate of another in the list
		[
			{ task: 'Example Task 1', waste: 1, ttc: 2, eta: oneThirty, id: 1 },
			{ task: 'Example Task 2', waste: 1, ttc: 2, eta: oneThirty, id: 1 },
		]
	]

	// Tests
	it.each(validTaskLists)('Should work for valid list of tasks', (...testCase) => {
		const updatedTaskList = pureTaskAttributeUpdate({ index: 0, attribute: 'waste', value: 2, taskList: testCase })
		expect(updatedTaskList[0]['waste']).toBe(2)
	})

	it.each(extraneousTaskLists)('Should remove extraneous fields, for the task to update only', (...testCase) => {
		// TODO: Change hard coded 'extra' to be any attribute found that is not in the list
		const updatedTaskList = pureTaskAttributeUpdate({ index: 0, attribute: 'waste', value: 2, taskList: testCase })
		expect(updatedTaskList[0]['extra']).toBeUndefined()
	})

	it.each(missingFields)('Should fill in empty or missing fields, for the task to update only, with defaults', (...testCase) => {
		// TODO: Change hard coded eta to be any one of the missing fields and the 'toBe' should be the default value
		const updatedTaskList = pureTaskAttributeUpdate({ index: 0, attribute: 'ttc', value: 1, taskList: testCase })
		expect(updatedTaskList[0].eta).toEqual(twelve)
	})

	it.each(invalidUpdateFields)('Should update the given valid field even if the field is invalid', (...testCase) => {
		// TODO: Should scan for invalid fields, choose the first one, then do the test with default values applied
		const updatedTaskList = pureTaskAttributeUpdate({ index: 0, attribute: 'ttc', value: 2, taskList: testCase })
		expect(updatedTaskList[0].ttc).toBe(2)
	})

	it.each(invalidFunctionParameters)('Should return an error if index, attribute, value, or taskList are null/undefined/invalid', (...testCase) => {
		expect(() => pureTaskAttributeUpdate(testCase)).toThrow()
	})

	it.each(invalidIds)('Should return an error if any id for the given list is undefined/null/invalid', (...testCase) => {
		// Note, this test only covers index = 0, it is to ensure that if there is any id in the list other than index 0, it will throw
		expect(() => pureTaskAttributeUpdate({ index: 0, attribute: 'waste', value: 2, taskList: testCase })).toThrow()
	})

	it.each(duplicateIds)('Should return an error if any valid id is a duplicate of another in the list', (...testCase) => {
		// Note, this test only covers index = 0, it because a duplicate found should throw from any index in the list
		expect(() => pureTaskAttributeUpdate({ index: 0, attribute: 'waste', value: 2, taskList: testCase })).toThrow()
	})
})

describe('formatTimeLeft', () => {
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

describe('isTimestampFromToday', () => {
	// https://www.epochconverter.com/ (Use Local Time)
	const testCases = [
		// Current date: August 20, 2023
		// Timestamp: August 20, 2023, 10:00:00 (in seconds)
		{ today: new Date(2023, 7, 20, 10, 0, 0, 0), timestamp: 1692543600, expected: true },

		// Current date: August 20, 2023
		// Timestamp: August 20, 2023, 23:59:59 (in seconds)
		{ today: new Date(2023, 7, 20, 10, 0, 0, 0), timestamp: 1692593999, expected: true },

		// Current date: August 23, 2023 00:00:00
		// Timestamp: Wednesday, August 23, 2023 23:45:00 === 1692852300 seconds
		// secondsElapsed: 85500 ==> 23:45
		{ today: new Date(2023, 7, 23, 0, 0, 0, 0), timestamp: 1692852300, expected: true, elapsed: 85500 }, // I am inclusive in start/end acceptance

		// Current date: August 20, 2023
		// Timestamp: August 21, 2023, 00:00:00 (in seconds)
		{ today: new Date(2023, 7, 20, 10, 0, 0, 0), timestamp: 1692594000, expected: true }, // I am inclusive in start/end acceptance

		// Current date: August 20, 2023
		// Timestamp: August 21, 2023, 00:00:01 (in seconds)
		{ today: new Date(2023, 7, 20, 10, 0, 0, 0), timestamp: 1692594001, expected: false },

		// Current date: August 20, 2023
		// Timestamp: August 21, 2023, 02:00:00 (in seconds)
		{ today: new Date(2023, 7, 20, 10, 0, 0, 0), timestamp: 1692601200, expected: false },

		// Current date: August 20, 2023
		// Timestamp: August 19, 2023, 18:00:00 (in seconds)
		{ today: new Date(2023, 7, 20, 10, 0, 0, 0), timestamp: 1692486000, expected: false },
	]

	testCases.forEach(({ today, timestamp, expected, elapsed = 60 * 60 * 24 }) => {
		const result = isTimestampFromToday(today, timestamp, elapsed)
		it(`Should return ${expected} for timestamp = ${timestamp} and today = ${today}`, () => {
			expect(result).toBe(expected)
		})
	})
})

describe('validateTask', () => {
	const twelve = new Date(new Date().setHours(12, 0, 0, 0))
	const defaultTask = {
		task: ' ',
		waste: 1,
		ttc: 1,
		eta: new Date(new Date().setHours(12, 0, 0, 0)), //'12:00',
		id: 1,
		status: TASK_STATUSES.INCOMPLETE,
		timestamp: 1692543600 - 1,
		completedTimeStamp: 1692543600,
		hidden: false,
	}

	const validTestCases = [
		{
			description: 'Valid task with required fields should return same object',
			task: defaultTask,
			expected: { ...defaultTask },
		},
		{
			description: 'Valid task with additional fields should return object without the extra fields',
			task: { ...defaultTask, extra: 'Extra Field' },
			expected: { ...defaultTask },
		},
		{
			description: 'Invalid task with required fields but undefined values',
			task: { ...defaultTask, eta: undefined, ttc: undefined },
			expected: { ...defaultTask },
		},
		{
			description: 'Invalid task with required fields but values of wrong type, not undefined',
			task: { ...defaultTask, eta: twelve, ttc: '12:00' }, // eta is a Date, ttc is positive number
			expected: { ...defaultTask },
		},
	]

	const invalidTestCases = [
		{
			description: 'Invalid task with missing required fields should throw an error',
			task: { ...defaultTask, id: undefined }, // any falsey value for id, which is required, will work
			errorMessage: "Failed to validate Task in validateTask function. This is likely a programming bug.",
		},
	]

	// Valid test cases
	test.each(validTestCases)('%s', ({ task, expected }) => {
		const result = validateTask({ task })
		//console.log('------------') console.log(result) console.log(expected)
		expect(result).toEqual(expected)
	})

	// Invalid test cases
	test.each(invalidTestCases)('%s', ({ task, errorMessage }) => {
		expect(() => {
			validateTask({ task })
		}).toThrowError()
	})
})

describe('filterTaskList', () => {
	const testCases = [
		{
			name: 'filters list correctly with valid filter and attribute',
			input: {
				filter: 'apple',
				list: [
					{ name: 'apple pie' },
					{ name: 'banana' },
					{ name: 'apple cider' },
					{ name: 'orange' },
				],
				attribute: 'name',
			},
			expected: [
				{ name: 'apple pie' },
				{ name: 'apple cider' },
			],
		},
		{
			name: 'returns the original list with missing attribute',
			input: {
				filter: 'apple',
				list: [
					{ name: 'apple pie' },
					{ name: 'banana' },
					{ name: 'apple cider' },
					{ name: 'orange' },
				],
				attribute: undefined,
			},
			expected: [
				{ name: 'apple pie' },
				{ name: 'banana' },
				{ name: 'apple cider' },
				{ name: 'orange' },
			],
		},
		{
			name: 'returns the original list with missing filter',
			input: {
				filter: undefined,
				list: [
					{ name: 'apple pie' },
					{ name: 'banana' },
					{ name: 'apple cider' },
					{ name: 'orange' },
				],
				attribute: 'name',
			},
			expected: [
				{ name: 'apple pie' },
				{ name: 'banana' },
				{ name: 'apple cider' },
				{ name: 'orange' },
			],
		},
	]

	testCases.forEach(testCase => {
		it(testCase.name, () => {
			const { filter, list, attribute } = testCase.input
			const result = filterTaskList({ filter, list, attribute })
			expect(result).toEqual(testCase.expected)
		})
	})

})

describe('calculateWaste', () => {
	const start = new Date(1692975600000) // Friday, August 25, 2023 10:00:00 AM GMT-05:00
	const completedTime = new Date(1692977400000) // Friday, August 25, 2023 10:30:00 AM GMT-05:00 	
	const completedTimeSeconds = completedTime.getTime() / 1000

	const hoursToMillis = hours => hours * 60000 * 60
	const add = (dateA, hour) => new Date(dateA.getTime() + hoursToMillis(hour))

	// Test cases covering what happens whenever we don't want any tasks updated and just want them initialized
	const initialTestCases = [
		{
			name: 'Given a list of tasks, The first incomplete task in the list has: waste = time - eta. eta is the updated eta, not old eta',
			input: {
				taskList: [
					{ status: 'incomplete', task: 'Task 1', waste: 0, ttc: 1, eta: add(start, -1), id: 1, timestamp: 1 }, // incomplete tasks are not guaranteed to have correct eta/waste
					{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: add(start, 8.5), id: 2, timestamp: 2 },
					{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: add(start, 9), id: 3, timestamp: 3 },
				],
				time: completedTime // Friday, August 25, 2023 10:30:00 AM GMT-05:00
			},
			expected: [
				{ status: 'incomplete', task: 'Task 1', waste: -.5, ttc: 1, eta: add(start, 1), id: 1, timestamp: 1 }, // eta = 10+1=11. Waste = time - eta(new) --> Waste = 10.5 - 11 == -.5
				{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: add(start, 1 + .5), id: 2, timestamp: 2 }, // eta = 11+.5=11.5
				{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: add(start, 1 + .5 + 1.5), id: 3, timestamp: 3 }, // eta = 12+1.5=13
			],
		},
		{
			name: 'Given a list of tasks, The tasks completed will not be touched, but the others will have the usual waste and eta calculations applied',
			input: {
				taskList: [
					{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: add(start, .5), id: 1, timestamp: 1, completedTimeStamp: completedTimeSeconds }, // completed tasks are guaranteed to have correct eta/waste
					{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: add(start, .5 + .5), id: 2, timestamp: 2 }, // incomplete tasks can have wrong eta/waste
					{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: add(start, .5 + .5 + 1.5), id: 3, timestamp: 3 },
				],
				time: completedTime // Friday, August 25, 2023 10:30:00 AM GMT-05:00
			},
			expected: [
				{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: add(start, .5), id: 1, timestamp: 1, completedTimeStamp: completedTimeSeconds }, // Completed tasks are not touched
				{ status: 'incomplete', task: 'Task 2', waste: -.5, ttc: .5, eta: add(start, .5 + .5), id: 2, timestamp: 2 }, // eta = 10.5+.5=11 waste should be 0
				{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: add(start, .5 + .5 + 1.5), id: 3, timestamp: 3 }, // eta = 11+1.5=12.5 waste should be 0
			],
		}
	]

	// Task Row is responsible for updating and submitting Completed tasks

	initialTestCases.forEach(testCase => {
		const { taskList, time } = testCase.input
		it(testCase.name, () => {
			expect(calculateWaste({ start, taskList, time })).toEqual(testCase.expected)
		})
	})

})

describe('rearrangeDnD', () => {
	const initialDnD = [1, 2, 3, 4]
	const destinations = [0, 1, 2, 3]

	destinations.forEach(destination => {
		it(`moves 4 to index ${destination}`, () => {
			const result = rearrangeDnD(initialDnD, 3, destination)
			const expected = [...initialDnD] // Copy the initial DnD array
			expected.splice(destination, 0, expected.splice(3, 1)[0]) // Perform the same rearrangement as the function
			expect(result).toEqual(expected)
		})
	})
})