import {
	pureTaskAttributeUpdate,
	formatTimeLeft,
	isTimestampFromToday,
	validateTask,
	filterTaskList,
	highlightDefaults,
	calculateEta,
	calculateWaste
} from './helpers'
import { TASK_STATUSES } from './constants'

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
		expect(updatedTaskList[0].eta).toBe('12:00')
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
	const defaultTask = {
		task: ' ',
		waste: 1,
		ttc: 1,
		eta: '12:00',
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
			task: { ...defaultTask, eta: 12, ttc: '12:00' }, // eta is a time string HH:MM, ttc is positive number
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

describe('highlightDefaults', () => {
	const testCases = [
		{
			name: 'generates empty highlight list when all tasks within time range and no owl',
			input: {
				taskList: [
					{ ttc: 1 },
					{ ttc: 2 },
					{ ttc: 3 },
					// these tasks will be in range
				],
				start: new Date('2023-08-20T10:00:00'), // 10:00
				end: new Date('2023-08-20T16:00:00'), // 16:00
				owl: false,
			},
			expected: [' ', ' ', ' '],
		},
		{
			name: 'generates empty highlight list, except the last is old, when all tasks within time range except last, and no owl',
			input: {
				taskList: [
					{ ttc: 1 },
					{ ttc: 2 },
					{ ttc: 3 },
					{ ttc: 3 }, // this task will be out of range
				],
				start: new Date('2023-08-20T10:00:00'), // 10:00
				end: new Date('2023-08-20T16:00:00'), // 16:00
				owl: false,
			},
			expected: [' ', ' ', ' ', 'old'],
		},
		{
			name: 'generates empty highlight list with owl option, and all tasks before next day',
			input: {
				taskList: [
					{ ttc: 2 },
					{ ttc: 3 },
					{ ttc: 4 },
					// all tasks in range
				],
				start: new Date('2023-08-20T18:00:00'),
				end: new Date('2023-08-21T03:00:00'),
				owl: true,
			},
			expected: [' ', ' ', ' '],
		},
		{
			name: 'generates empty highlight list, except last is old, with owl option, and all tasks before next day, except last',
			input: {
				taskList: [
					{ ttc: 2 },
					{ ttc: 3 },
					{ ttc: 4 },
					{ ttc: 2 },
				],
				start: new Date('2023-08-20T18:00:00'),
				end: new Date('2023-08-20T03:00:00'),
				owl: true,
			},
			expected: [' ', ' ', ' ', 'old'],
		},
		{
			name: 'When ttc is bad, it will not affect the total (bad counts for 0 ttc)',
			input: {
				taskList: [
					{ ttc: 2 },
					{ ttc: 3 },
					{ ttc: 4 },
					{ BAD: 2 }, // should not affect anything from here on, until it is valid
					{ ttc: undefined },
					{ ttc: 1 }, // should be valid so it is old
				],
				start: new Date('2023-08-20T18:00:00'),
				end: new Date('2023-08-20T03:00:00'),
				owl: true,
			},
			expected: [' ', ' ', ' ', ' ', ' ', 'old'],
		},
		{
			name: 'When ttc is bad, it will not affect the total, even out of order',
			input: {
				taskList: [
					{ ttc: undefined },
					{ ttc: 2 },
					{ ttc: 3 },
					{ ttc: 4 },
					{ BAD: 2 },
					{ ttc: 1 }, // old here
				],
				start: new Date('2023-08-20T18:00:00'),
				end: new Date('2023-08-20T03:00:00'),
				owl: true,
			},
			expected: [' ', ' ', ' ', ' ', ' ', 'old'],
		},
	]

	testCases.forEach(testCase => {
		it(testCase.name, () => {
			const { taskList, start, end, owl } = testCase.input
			const result = highlightDefaults(taskList, start, end, owl)
			expect(result).toEqual(testCase.expected)
		})
	})
})

describe('calculateEta', () => {
	// Test data
	const testCases = [
		{
			name: 'Should work on valid task list and valid start time',
			input: {
				taskList: [
					{
						"task": "Caffiene",
						"waste": 0,
						"ttc": 0.5,
						"eta": "01:30",
						"id": 4,
						"status": "waiting",
						"timestamp": 1692913917,
						"completedTimeStamp": 1,
						"hidden": false
					},
					{
						"task": "Plan Weave (54-56) / 400",
						"waste": 0,
						"ttc": 2,
						"eta": "15:30",
						"id": 1,
						"status": "incomplete",
						"timestamp": 1692913916,
						"completedTimeStamp": 1,
						"hidden": false
					},
					{
						"task": "Gym",
						"waste": 0,
						"ttc": 1.5,
						"eta": "18:30",
						"id": 2,
						"status": "incomplete",
						"timestamp": 1692913915,
						"completedTimeStamp": 1,
						"hidden": false
					},
					{
						"task": "Shower -",
						"waste": 0,
						"ttc": 0.5,
						"eta": "01:30",
						"id": 3,
						"status": "incomplete",
						"timestamp": 1692913914,
						"completedTimeStamp": 1,
						"hidden": false
					},
					{
						"task": "Meal Prep",
						"waste": 0,
						"ttc": 1,
						"eta": "01:30",
						"id": 5,
						"status": "incomplete",
						"timestamp": 1692913912,
						"completedTimeStamp": 1,
						"hidden": false
					},
					{
						"task": "Ethics",
						"waste": 0,
						"ttc": 2,
						"eta": "23:30",
						"id": 11,
						"status": "incomplete",
						"timestamp": 1692913911,
						"completedTimeStamp": 1,
						"hidden": false
					},
					{
						"task": "Machine Learning - A1",
						"waste": 0,
						"ttc": 1,
						"eta": "18:30",
						"id": 8,
						"status": "incomplete",
						"timestamp": 1692913910,
						"completedTimeStamp": 1,
						"hidden": false
					},
					{
						"task": "Cyber Security: Ch 1-3, Rev. Linux",
						"waste": 0,
						"ttc": 1.5,
						"eta": "15:30",
						"id": 6,
						"status": "incomplete",
						"timestamp": 1692913909,
						"completedTimeStamp": 1,
						"hidden": false
					},
					{
						"task": "Break",
						"waste": 0,
						"ttc": 0.75,
						"eta": "18:30",
						"id": 9,
						"status": "incomplete",
						"timestamp": 1692913909,
						"completedTimeStamp": 1,
						"hidden": false
					},
					{
						"task": "Spanish",
						"waste": 0,
						"ttc": 0.5,
						"eta": "23:30",
						"id": 10,
						"status": "incomplete",
						"timestamp": 1692913908,
						"completedTimeStamp": 1,
						"hidden": false
					}
				], // Real Set of Tasks from Aug 24 2023
				start: new Date(1692913500000) // Aug 24 2023, 16:45:00
			},
			expected: [
				{
					"task": "Caffiene",
					"waste": 0,
					"ttc": 0.5,
					"eta": "17:15",
					"id": 4,
					"status": "waiting",
					"timestamp": 1692913917,
					"completedTimeStamp": 1,
					"hidden": false
				},
				{
					"task": "Plan Weave (54-56) / 400",
					"waste": 0,
					"ttc": 2,
					"eta": "19:15",
					"id": 1,
					"status": "incomplete",
					"timestamp": 1692913916,
					"completedTimeStamp": 1,
					"hidden": false
				},
				{
					"task": "Gym",
					"waste": 0,
					"ttc": 1.5,
					"eta": "20:45",
					"id": 2,
					"status": "incomplete",
					"timestamp": 1692913915,
					"completedTimeStamp": 1,
					"hidden": false
				},
				{
					"task": "Shower -",
					"waste": 0,
					"ttc": 0.5,
					"eta": "21:15",
					"id": 3,
					"status": "incomplete",
					"timestamp": 1692913914,
					"completedTimeStamp": 1,
					"hidden": false
				},
				{
					"task": "Meal Prep",
					"waste": 0,
					"ttc": 1,
					"eta": "22:15",
					"id": 5,
					"status": "incomplete",
					"timestamp": 1692913912,
					"completedTimeStamp": 1,
					"hidden": false
				},
				{
					"task": "Ethics",
					"waste": 0,
					"ttc": 2,
					"eta": "00:15",
					"id": 11,
					"status": "incomplete",
					"timestamp": 1692913911,
					"completedTimeStamp": 1,
					"hidden": false
				},
				{
					"task": "Machine Learning - A1",
					"waste": 0,
					"ttc": 1,
					"eta": "01:15",
					"id": 8,
					"status": "incomplete",
					"timestamp": 1692913910,
					"completedTimeStamp": 1,
					"hidden": false
				},
				{
					"task": "Cyber Security: Ch 1-3, Rev. Linux",
					"waste": 0,
					"ttc": 1.5,
					"eta": "02:45",
					"id": 6,
					"status": "incomplete",
					"timestamp": 1692913909,
					"completedTimeStamp": 1,
					"hidden": false
				},
				{
					"task": "Break",
					"waste": 0,
					"ttc": 0.75,
					"eta": "03:30",
					"id": 9,
					"status": "incomplete",
					"timestamp": 1692913909,
					"completedTimeStamp": 1,
					"hidden": false
				},
				{
					"task": "Spanish",
					"waste": 0,
					"ttc": 0.5,
					"eta": "04:00",
					"id": 10,
					"status": "incomplete",
					"timestamp": 1692913908,
					"completedTimeStamp": 1,
					"hidden": false
				}
			] // All the Etas are updated to reflect the new etas based on ttc data
		},
	]

	// Test loop
	testCases.forEach(testCase => {
		it(testCase.name, () => {
			const { taskList, start } = testCase.input
			const result = calculateEta({ start, taskList })
			expect(result).toEqual(testCase.expected)
		})
	})
})

/*
1. The initial state of the tasks should have all tasks with proper calculated eta from the taskList view.
	1a. waste for each task is this: (Calculate waste for non-complete only)
		- if the task is the first incomplete task then it will be time - eta // use the updated eta value, not the old one
		- otherwise if it is not complete it is 0
	1c. eta for each task is this: (Calculate eta for non-complete only) // calculate eta first for use in waste calculation
		- if a task is not complete, the task will have eta = acc + ttc , where acc starts at start or (last completedTasks' completedTimestamp) and goes up with each ttc value

2. When a user completes a task, the waste, ttc, and eta are recalculated, and submitted to the redux store.
	2a. waste for each task is this:
		- if the task is complete and the one to be updated, then waste = time - eta // use the old eta, not the new one
		- if the task is not complete and not the one to be updated
			- if it is the first one not complete, then waste = time - eta // use the new eta, not the old one
			- otherwise it is 0

	2c. eta for each task is this:
		- if the task is complete then eta = completedTimestamp  // use the value that was computed using the initialize method
		- if the task is not complete and not the one to be updated
			- if it is the first one not complete, then eta = time + ttc
			- otherwise it is eta = acc + ttc , where you update the sum in the acc for each task (using reduce)
	2d. completedTimestamp is this:
		- it is time

	after all this, the task must be submitted to the redux store

3. When a user incompletes a task, the waste, ttc, and eta are recalculated, and submitted to the redux store.
	Initialize(taskList)

	after all this, the task must be submitted to the redux store
*/

// TODO: Add test cases that cover over-night tasks, just in case there is bugs with that
describe('calculateWaste', () => {
	const start = new Date(1692975600000) // Friday, August 25, 2023 10:00:00 AM GMT-05:00
	const completedTime = new Date(1692977400000) // Friday, August 25, 2023 10:30:00 AM GMT-05:00 	
	const completedTimeSeconds = completedTime.getTime()/1000 
	const completedTime2 = new Date(1692981000000) // Friday, August 25, 2023 11:30:00 AM GMT-05:00 DST 
	const completedTime2Seconds = completedTime2.getTime()/1000 

	// Test cases covering what happens whenever we don't want any tasks updated and just want them initialized
	const initialTestCases = [
		{
			name: 'Given a list of tasks, The first incomplete task in the list has: waste = time - eta. eta is the updated eta, not old eta',
			input: {
				taskList: [
					{ status: 'incomplete', task: 'Task 1', waste: 0, ttc: 1, eta: '09:00', id: 1, timestamp: 1 }, // incomplete tasks are not guaranteed to have correct eta/waste
					{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: '19:00', id: 2, timestamp: 2 },
					{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: '19:30', id: 3, timestamp: 3 },
				],
				time: completedTime // Friday, August 25, 2023 10:30:00 AM GMT-05:00
			},
			expected: [
				{ status: 'incomplete', task: 'Task 1', waste: -.5, ttc: 1, eta: '11:00', id: 1, timestamp: 1 }, // eta = 10+1=11. Waste = time - eta(new) --> Waste = 10.5 - 11 == -.5
				{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: '11:30', id: 2, timestamp: 2 }, // eta = 11+.5=11.5
				{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: '13:00', id: 3, timestamp: 3 }, // eta = 12+1.5=13
			],
		},
		{
			name: 'Given a list of tasks, The tasks completed will not be touched, but the others will have the usual waste and eta calculations applied',
			input: {
				taskList: [
					{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: '10:30', id: 1, timestamp: 1, completedTimeStamp: completedTimeSeconds }, // completed tasks are guaranteed to have correct eta/waste
					{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: '19:00', id: 2, timestamp: 2 }, // incomplete tasks can have wrong eta/waste
					{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: '19:30', id: 3, timestamp: 3 },
				],
				time: completedTime // Friday, August 25, 2023 10:30:00 AM GMT-05:00
			},
			expected: [
				{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: '10:30', id: 1, timestamp: 1, completedTimeStamp: completedTimeSeconds }, // Completed tasks are not touched
				{ status: 'incomplete', task: 'Task 2', waste: -.5, ttc: .5, eta: '11:00', id: 2, timestamp: 2 }, // eta = 10.5+.5=11; waste should be 0
				{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: '12:30', id: 3, timestamp: 3 }, // eta = 11+1.5=12.5; waste should be 0
			],
		}
	]

	// Test cases covering what happens whenever we want a task in the list to be completed
	const completedTestCases = [
		{
			name: 'Given a list of tasks, if the task is completed and the one being updated, then waste = time - eta (old), eta,completedTimestamp = time',
			input: {
				taskList: [
					{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: '11:00', id: 1, timestamp: 1 }, // note this is the old eta
					{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: '19:00', id: 2, timestamp: 2 }, // incomplete tasks can have wrong eta/waste
					{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: '19:30', id: 3, timestamp: 3 },
				],
				time: completedTime, // Friday, August 25, 2023 10:30:00 AM GMT-05:00
				indexUpdated: 0 // The task 1 is being updated from incomplete to completed
			},
			expected: [
				{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: '10:30', id: 1, timestamp: 1, completedTimeStamp: completedTimeSeconds }, // Completed tasks are not touched
				{ status: 'incomplete', task: 'Task 2', waste: -.5, ttc: .5, eta: '11:00', id: 2, timestamp: 2 }, // waste should be calculated as normal, time - eta (new), eta should be updated
				{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: '12:30', id: 3, timestamp: 3 }, // waste should be 0, eta should be updated
			],
		},
		{
			name: 'Given a list of tasks, if the task is completed and NOT the one being updated, then it is untouched',
			input: {
				taskList: [
					{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: '10:30', id: 1, timestamp: 1, completedTimeStamp: completedTimeSeconds }, // note this is the unaffected completed task
					{ status: 'completed', task: 'Task 2', waste: .5, ttc: .5, eta: '11:00', id: 2, timestamp: 2 }, // This is the task being updated
					{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: '19:30', id: 3, timestamp: 3 }, // incomplete tasks can have wrong eta/waste
				],
				time: completedTime2, // Friday, August 25, 2023 11:30:00 AM GMT-05:00 DST
				indexUpdated: 1
			},
			expected: [
				{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: '10:30', id: 1, timestamp: 1, completedTimeStamp: completedTimeSeconds }, // Completed tasks are not touched
				{ status: 'completed', task: 'Task 2', waste: .5, ttc: .5, eta: '11:30', id: 2, timestamp: 2, completedTimeStamp: completedTime2Seconds }, // waste should be calculated as normal, time - eta (new), eta should be updated
				{ status: 'incomplete', task: 'Task 3', waste: -1.5, ttc: 1.5, eta: '13:00', id: 3, timestamp: 3 }, // waste should be time-eta(new), eta should be updated
			],
		}
	]

	// Test cases covering what happens whenever we want a task in the list to be un-completed
	const uncompletedTestCases = [
		// Un-completing a task is equivalent to initializing a task
		...initialTestCases
	]

	initialTestCases.forEach(testCase => {
		const { taskList, time } = testCase.input
		it(testCase.name, () => {
			expect(calculateWaste({ start, taskList, time })).toEqual(testCase.expected)
		})
	})

	completedTestCases.forEach(testCase => {
		const { taskList, time, indexUpdated } = testCase.input
		it(testCase.name, () => {
			expect(calculateWaste({ start, taskList, time, indexUpdated })).toEqual(testCase.expected)
		})
	})

	uncompletedTestCases.forEach(testCase => {
		const { taskList, time } = testCase.input
		it(testCase.name, () => {
			expect(calculateWaste({ start, taskList, time })).toEqual(testCase.expected)
		})
	})
})