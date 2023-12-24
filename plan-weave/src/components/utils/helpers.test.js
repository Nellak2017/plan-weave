import {
	formatTimeLeft,
	isTimestampFromToday,
	validateTask,
	filterTaskList,
	calculateWaste,
	rearrangeDnD,
	relativeSortIndex,
} from './helpers'
import { TASK_STATUSES } from './constants'

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

describe('relativeSortIndex', () => {
	const sortFunction = array => array.sort((a, b) => a.id - b.id) // Sort by task ID
	const incomplete = TASK_STATUSES.INCOMPLETE
	const complete = TASK_STATUSES.COMPLETED

	const testCases = [
		{
			description: 'Incomplete -> Complete',
			tasks: [{ id: 1, status: incomplete }, { id: 2, status: complete }],
			id: 2,
			expected: 0,
		},
		{
			description: 'Complete -> Incomplete',
			tasks: [{ id: 1, status: incomplete }, { id: 2, status: incomplete }],
			id: 1,
			expected: 0,
		},
		{
			description: 'Middle Complete -> Incomplete',
			tasks: [
				{ id: 1, status: complete },
				{ id: 3, status: incomplete },
				{ id: 2, status: complete },
			],
			id: 3,
			expected: 2,
		},
		{
			description: 'Middle Incomplete -> Complete',
			tasks: [
				{ id: 1, status: incomplete },
				{ id: 3, status: complete },
				{ id: 2, status: incomplete },
			],
			id: 3,
			expected: 0,
		},
		{
			description: 'Last to Middle, Incomplete -> Complete',
			tasks: [
				{ id: 1, status: complete },
				{ id: 3, status: incomplete },
				{ id: 2, status: complete },
			],
			id: 2,
			expected: 1,
		},
		{
			description: 'Real Case, 1st to 0th, Incomplete -> Complete',
			tasks: [
				{
					"task": "Eat 1",
					"waste": -2.3942413888888887,
					"ttc": 0.5,
					"eta": 1703315180.731,
					"id": 1,
					"status": "completed",
					"timestamp": 1703315063,
					"completedTimeStamp": 1703315180.731,
					"hidden": false
				},
				{
					"status": "incomplete",
					"task": "ML : Flash (Lectures/Study guide)",
					"ttc": 3,
					"id": 2,
					"timestamp": 1703315062
				},
				{
					"status": "incomplete",
					"task": "br 1",
					"ttc": 0.5,
					"id": 3,
					"timestamp": 1703315061
				},
				{
					"status": "incomplete",
					"task": "ML : Written Ass Analysis",
					"ttc": 2,
					"id": 4,
					"timestamp": 1703315060
				},
				{
					"status": "incomplete",
					"task": "ML : Flash Cards",
					"ttc": 1,
					"id": 5,
					"timestamp": 1703315059
				},
				{
					"status": "incomplete",
					"task": "br 2",
					"ttc": 0.75,
					"id": 6,
					"timestamp": 1703315058
				},
				{
					"status": "incomplete",
					"task": "ML : Note Creation",
					"ttc": 0.75,
					"id": 7,
					"timestamp": 1703315057
				},
				{
					"status": "incomplete",
					"task": "ML : Practice Probs",
					"ttc": 1.5,
					"id": 9,
					"timestamp": 1703315054
				},
				{
					"status": "incomplete",
					"task": "br",
					"ttc": 0.5,
					"id": 10,
					"timestamp": 1703315053
				},
				{
					"status": "incomplete",
					"task": "Cyber : Practice",
					"ttc": 1,
					"id": 11,
					"timestamp": 1703315052
				},
				{
					"status": "incomplete",
					"task": "Calculator Custom Formulas",
					"ttc": 0.75,
					"id": 12,
					"timestamp": 1703315051
				}
			],
			id: 1,
			expected: 0,
		}
	]
	testCases.forEach(({ description, tasks, id, expected }) => {
		it(`Correctly calculates index for ${description} case`, () => {
			expect(relativeSortIndex(tasks, sortFunction, id)).toBe(expected)
		})
	})
})