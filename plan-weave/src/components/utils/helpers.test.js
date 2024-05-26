/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import {
	clamp,
	add,
	subtract,
	etaList,
	formatTimeLeft,
	isTimestampFromToday,
	validateTask, // not covered by property based tests
	validateTaskField,
	filterTaskList,
	hoursToSeconds,
	hoursToMillis,
	millisToHours,

	calculateWaste,
	rearrangeDnD,
	relativeSortIndex,
	highlightTaskRow,
	ordinalSet,
	deleteDnDEvent,
	diagonalize,
	calculateRange,
} from './helpers'
import {
	dateToToday,
	calculateEfficiency,
	validateTransformation,
} from './helpers.res.js'
import { TASK_STATUSES, MAX_SAFE_DATE } from './constants'
import { format } from 'date-fns-tz'
import { simpleTaskSchema } from '../schemas/simpleTaskSchema/simpleTaskSchema.js'
import { fc } from '@fast-check/jest'
import * as Yup from 'yup'

describe('clamp values so they are always in specific range', () => {
	// --- Property based tests
	it('Should clamp the value within the specified range', () => {
		fc.assert(fc.property(fc.integer(), fc.integer(), fc.integer(),
			(value, min, max) => {
				const [minValue, maxValue] = min > max ? [max, min] : [min, max]
				const result = clamp(value, min, max)
				const isClampedWithinRange = result >= minValue && result <= maxValue
				expect(isClampedWithinRange).toBe(true)
			}
		))
	})
})

describe('add hours to date', () => {
	// --- Example based tests
	test.each([
		[new Date(Date.parse('2024-01-17T12:00:00Z')), 1, new Date(Date.parse('2024-01-17T13:00:00Z'))],
		[new Date(Date.parse('2024-01-17T08:00:00Z')), 2.5, new Date(Date.parse('2024-01-17T10:30:00Z'))],
		[new Date(Date.parse('2024-01-17T20:00:00Z')), 0.5, new Date(Date.parse('2024-01-17T20:30:00Z'))],
		[new Date(Date.parse('2024-01-17T20:30:00Z')), 0, new Date(Date.parse('2024-01-17T20:30:00Z'))],
		[new Date(Date.parse('2024-01-17T20:30:00Z')), -1, new Date(Date.parse('2024-01-17T19:30:00Z'))],
	])('adds %f hours to %o', (start, hours, expectedDate) => {
		expect(add(start, hours)).toEqual(expectedDate)
	})
	// --- Property based tests
	it('Should return a date that is the sum of start time and hours', () => {
		fc.assert(fc.property(fc.date(), fc.integer(),
			(start, hours) => {
				const result = add(start, hours)
				const expected = new Date(Math.min(Math.max(start.getTime() + hoursToMillis(hours), 0), MAX_SAFE_DATE))
				expect(result).toEqual(expected)
			}
		))
	})
})

describe('subtract two dates', () => {
	// --- Example based tests
	test.each([
		[new Date(Date.parse('2024-01-17T13:00:00Z')), new Date(Date.parse('2024-01-17T12:00:00Z')), 1],
		[new Date(Date.parse('2024-01-17T10:30:00Z')), new Date(Date.parse('2024-01-17T08:00:00Z')), 2.5],
		[new Date(Date.parse('2024-01-17T20:30:00Z')), new Date(Date.parse('2024-01-17T20:00:00Z')), 0.5],
		[new Date(Date.parse('2024-01-17T20:30:00Z')), new Date(Date.parse('2024-01-17T20:30:00Z')), 0],
	])('adds %f hours to %o', (start, hours, expectedDate) => {
		expect(subtract(start, hours)).toEqual(expectedDate)
	})
	// --- Property based tests
	it('Should return the difference in hours between two dates', () => {
		//fc.configureGlobal({ seed: 301260064 })
		fc.assert(fc.property(fc.date(), fc.date(),
			(time, eta) => {
				const expected = (time.getTime() - eta.getTime()) / (1000 * 60 * 60)
				const actual = subtract(time, eta)
				expect(actual).toBeCloseTo(expected)
			}
		))
	})
})

describe('etaList', () => {
	// etaList figures out the running sum for each element in the list
	// --- Property based tests
	it('should preserve length for any input', () => {
		fc.assert(fc.property(fc.array(fc.anything()), taskList => etaList(taskList).length === taskList.length))
	})

	it('should preserve cumulative sum property for valid input', () => {
		fc.assert(fc.property(
			fc.array(fc.nat()),
			taskDurations => {
				const taskList = taskDurations.map(duration => ({ ttc: duration }))
				const etas = etaList(taskList)
				return taskList.reduce(
					(acc, task, index) => {
						const cumulativeSum = acc.cumulativeSum + task.ttc
						const isValid = etas[index] === cumulativeSum
						return { cumulativeSum, isValid: acc.isValid && isValid }
					},
					{ cumulativeSum: 0, isValid: true }
				).isValid
			}))
	})
})

describe('formatTimeLeft', () => {
	// --- Example based tests
	test.each([
		['endTime - startTime = 1', new Date('2023-08-09T12:00:00'), new Date('2023-08-09T13:00:00'), '1 hours left'],
		['0 < endTime - startTime < 1', new Date('2023-08-09T12:00:00'), new Date('2023-08-09T12:30:00'), '30 minutes left'],
		['endTime - startTime > 1 and not an integer', new Date('2023-08-09T12:00:00'), new Date('2023-08-09T14:45:00'), '2 hours 45 minutes left'],
		['endTime < startTime and overNightMode is false', new Date('2023-08-09T12:00:00'), new Date('2023-08-09T11:30:00'), '0 minutes left'],
		// eslint-disable-next-line max-params
	])('should return the correct string when %s', (_, currentTime, endTime, expected) => {
		const result = formatTimeLeft({ currentTime, endTime })
		expect(result).toBe(expected)
	})

	test.each([
		['1 hours left', 1],
		['30 minutes left', 0.5],
		['2 hours 45 minutes left', 2.75],
		['2 hours left', 2],
	])('should display "%s" when timeDifference is %s', (expected, timeDifference) => {
		const result = formatTimeLeft({ timeDifference })
		expect(result).toBe(expected)
	})
	// --- Property based tests
	it('should produce consistent output for the same input', () => {
		fc.assert(fc.property(
			fc.integer(), fc.boolean(), fc.date(),
			(timeDifference, overNightMode, endTime) => {
				const currentTime = new Date()
				const result1 = formatTimeLeft({ timeDifference, overNightMode, endTime, currentTime })
				const result2 = formatTimeLeft({ timeDifference, overNightMode, endTime, currentTime })
				return result1 === result2
			}
		))
	})

	// it is quite hard to make properties for this function since it is a composite
})

describe('isTimestampFromToday', () => {
	// --- Example based tests
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
	// --- Property based tests
	it('should return true for timestamps from today', () => {
		fc.assert(fc.property(
			fc.date({ min: new Date(0) }), fc.integer({ min: 0, max: 86399 }),
			(today, seconds) => {
				const timestamp = new Date(today).setHours(0, 0, 0, 0) / 1000 + seconds
				return isTimestampFromToday(today, timestamp)
			}
		))
	})

	it('should return false for timestamps outside of today\'s range', () => {
		fc.assert(fc.property(
			fc.date({ min: new Date(0) }), fc.integer({ min: Number.MIN_SAFE_INTEGER, max: -1 }), fc.integer({ min: 86401 }),
			(today, beforeSeconds, afterSeconds) => {
				const beforeTimestamp = new Date(today).setHours(0, 0, 0, 0) / 1000 + beforeSeconds
				const afterTimestamp = new Date(today).setHours(0, 0, 0, 0) / 1000 + afterSeconds
				return !isTimestampFromToday(today, beforeTimestamp) && !isTimestampFromToday(today, afterTimestamp)
			}
		))
	})

	it('should return the same value for timestamps on the boundaries', () => {
		fc.assert(fc.property(
			fc.date({ min: new Date(0) }), fc.constant(0), fc.constant(86400),
			(today, startTimestamp, endTimestamp) => {
				const startOfToday = new Date(today).setHours(0, 0, 0, 0) / 1000
				const startTimestampToday = startOfToday + startTimestamp
				const endTimestampToday = startOfToday + endTimestamp
				return isTimestampFromToday(today, startTimestampToday) && isTimestampFromToday(today, endTimestampToday)
			}
		))
	})
})

describe('validateTaskField', () => {
	// --- Property based tests
	const simpleTaskSchema = Yup.object({
		parentThread: Yup.string().min(2).required(),
	}) // minimal example

	it('should validate successfully for valid payloads', () => {
		fc.assert(fc.property(
			fc.record({
				field: fc.constantFrom('parentThread'),
				payload: fc.string({ minLength: 2 })
			}),
			({ field, payload }) => {
				const result = validateTaskField({ field, payload, schema: simpleTaskSchema })
				return result.valid === true && result.error === null
			}
		))
	})


	test('Validation should fail for invalid payloads', () => {
		fc.assert(fc.property(
			fc.record({
				field: fc.constantFrom('parentThread'),
				payload: fc.string({ maxLength: 1 })
			}),
			({ field, payload }) => {
				const result = validateTaskField({ field, payload, schema: simpleTaskSchema, logger: e => { } })
				return result.valid === false && result.error !== null
			}
		))
	})
})

describe('filterTaskList', () => {
	// --- Example based tests
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
	// --- Property based tests
	it('should return original list if no filter or no attribute', () => {
		fc.assert(
			fc.property(
				fc.array(fc.record({ attribute: fc.string() })),
				fc.string(),
				fc.string(),
				(list, attribute, filter) => {
					const res1 = filterTaskList({ filter: '', list, attribute })
					expect(res1).toEqual(list)
					const res2 = filterTaskList({ filter, list, attribute: '' })
					expect(res2).toEqual(list)
				}
			)
		)
	})

	it('should have len(filtered list) <= len(list)', () => {
		fc.assert(
			fc.property(
				fc.array(fc.record({ attribute: fc.string() })),
				fc.string(),
				(list, filter) => {
					const res = filterTaskList({ filter, list, attribute: 'attribute' })
					expect(res.length <= list.length).toBe(true)
				}
			)
		)
	})

	it('should have filtered list contain only items with attribute containing filter', () => {
		fc.assert(
			fc.property(
				fc.array(fc.record({ attribute: fc.string() })),
				fc.string(),
				(list, filter) => {
					const result = filterTaskList({ filter, list, attribute: 'attribute' })
					const lowerFilter = filter.toLowerCase()
					result.forEach(item => {
						expect(item['attribute']?.toLowerCase()?.includes(lowerFilter)).toBe(true)
					})
				}
			)
		)
	})

})

describe('hoursToSeconds', () => {
	// --- Example based tests
	test.each([
		[1, 3600],
		[0.5, 1800],
		[2.5, 9000],
		[0, 0],
	])('converts %f hours to %d seconds', (hours, expectedSeconds) => {
		expect(hoursToSeconds(hours)).toBe(expectedSeconds)
	})
	// --- Property based tests
	it('should correctly convert hours to seconds', () => {
		fc.assert(fc.property(
			fc.float({ min: 0, max: 1e6 }),
			hours => {
				const processedHours = isNaN(hours) ? 0 : hours
				const result = hoursToSeconds(processedHours)
				expect(result).toBeCloseTo(processedHours * 3600)
			})
		)
	})
})

describe('hoursToMillis', () => {
	// --- Example based tests
	test.each([
		[1, 3600000],
		[0.5, 1800000],
		[2.5, 9000000],
		[0, 0],
	])('converts %f hours to %d milliseconds', (hours, expectedMillis) => {
		expect(hoursToMillis(hours)).toBe(expectedMillis)
	})
	// --- Property based tests
	it('should correctly convert hours to milliseconds', () => {
		fc.configureGlobal({seed: -790803875})
        fc.assert(
            fc.property(fc.float({ min: 0, max: 1e6 }), hours => {
				const processedHours = isNaN(hours) ? 0 : hours
                const result = hoursToMillis(processedHours)
                expect(result).toBeCloseTo(processedHours * 3600000)
            })
        )
    })
})

describe('millisToHours', () => {
	// --- Example based tests
	test.each([
		[3600000, 1],
		[1800000, 0.5],
		[9000000, 2.5],
		[0, 0],
	])('converts %d milliseconds to %f hours', (milliseconds, expectedHours) => {
		expect(millisToHours(milliseconds)).toBeCloseTo(expectedHours, 5) // Adjust for float precision
	})
	// --- Property based tests
	test('should correctly convert milliseconds to hours', () => {
        fc.assert(
            fc.property(fc.float({ min: 0, max: Math.fround(1e12) }), milliseconds => {
				const processedMillis = isNaN(milliseconds) ? 0 : milliseconds
                const result = millisToHours(processedMillis)
                expect(result).toBeCloseTo(processedMillis / 3600000)
            })
        )
    })
})


describe('dateToToday', () => {
	const testCases = [
		{
			description: 'Transforms a given date to today\'s date',
			input: new Date('2023-01-15T12:00:00Z'),
			expected: new Date(new Date().setHours(6, 0, 0, 0)),
		},
		{
			description: 'Handles invalid input',
			input: 'abc',
			expectedError: 'Invalid input. Expected a Date for dateToToday function.',
		},
	]

	testCases.forEach(({ description, input, expected, expectedError }) => {
		it(description, () => {
			const result = dateToToday(input)
			if (expectedError) {
				expect(result.TAG).toEqual('Error')
				expect(result._0).toEqual(expectedError)
			} else {
				expect(result.TAG).toEqual('Ok')
				expect(result._0).toEqual(expected)
			}
		})
	})
})

describe('calculateEfficiency', () => {
	const testCases = [
		// Example 1
		{ startTime: 0, endTime: 7200, etaHours: 2.5, expected: { "TAG": "Ok", "_0": 1.25 } },

		// Example 2
		{ startTime: 0, endTime: 11250, etaHours: 2.5, expected: { "TAG": "Ok", "_0": 0.8 } },

		// Example 3
		{ startTime: 0, endTime: 1, etaHours: 24, expected: { "TAG": "Ok", "_0": 86400 } },

		{ startTime: -0, endTime: 3600, etaHours: 1, expected: { "TAG": "Ok", "_0": 1 } }, // 100% efficiency
		{ startTime: 7200, endTime: 3600, etaHours: 1, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Start time greater than end time Not allowed anymore

		// Additional cases
		{ startTime: 'invalid', endTime: 7200, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid start time type
		{ startTime: 0, endTime: 'invalid', etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid end time type
		{ startTime: 0, endTime: 7200, etaHours: 'invalid', expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid etaHours time type
		{ startTime: -1, endTime: 7200, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Negative start time
		{ startTime: 0, endTime: -100, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Negative end time, start > end
		{ startTime: 0, endTime: 100, etaHours: -2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Negative etaHours
		{ startTime: 0, endTime: 7200, etaHours: 0, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid eta
		{ startTime: 8.64e15 + 1, endTime: 7200, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // start time too big
		{ startTime: 0, endTime: 8.64e15 + 1, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // end time too big
		{ startTime: 0, endTime: 7200, etaHours: 24 + 1, expected: { "TAG": "Error", "_0": expect.any(String) } }, // etaHours too big
		{ startTime: 0, endTime: 86400 + 1, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // end - start too big
		{ startTime: 0, endTime: 0, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // start == end

		{ startTime: NaN, endTime: 7200, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid start time type NaN
		{ startTime: NaN, endTime: NaN, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid start,end time type NaN
		{ startTime: -5e-324, endTime: 7200, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid start time < 0
		{ startTime: 0, endTime: undefined, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid end time type undefined
		{ startTime: null, endTime: 7200, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid start time type null
		{ startTime: Infinity, endTime: 7200, etaHours: 2, expected: { "TAG": "Error", "_0": expect.any(String) } }, // Invalid start time type infinity
	]

	testCases.forEach(({ startTime, endTime, etaHours, expected }) => {
		test(`calculateEfficiency(${startTime}, ${endTime}, ${etaHours}) should return ${expected['_0']}`, () => {
			expect(calculateEfficiency(startTime, endTime, etaHours)).toEqual(expected) // Use toBeCloseTo for floating-point numbers
		})
	})
})

describe('validateTransformation', () => {
	const twelve = new Date(new Date().setHours(12, 0, 0, 0)).toISOString()
	const validTask = {
		task: ' ',
		waste: 1,
		ttc: 1,
		eta: twelve, //'12:00',
		id: 1,
		status: TASK_STATUSES.INCOMPLETE,
		timestamp: 1692543600 - 1,
		completedTimeStamp: 1692543600,
		hidden: false,
	}
	const invalidTask = {
		task: '1'.repeat(51), // too long
		waste: -1, // negative
		ttc: 1,
		eta: twelve, //'12:00',
		id: 1,
		status: TASK_STATUSES.INCOMPLETE,
		timestamp: 1692543600 - 1,
		completedTimeStamp: 1692543600,
		hidden: false,
	}
	const simpleSchema = simpleTaskSchema
	const customErrorMessage = 'Validation failed.'

	const testCases = [
		{
			name: 'valid transformation with strict schema',
			task: validTask,
			schema: simpleSchema,
			errorMessage: customErrorMessage,
			expected: { "TAG": "Ok", "_0": undefined },
		},
		{
			name: 'invalid transformation with strict schema',
			task: invalidTask,
			schema: simpleSchema,
			errorMessage: customErrorMessage,
			expected: { "TAG": "Error", "_0": expect.any(String) },
		},
		{
			name: 'valid transformation without defined error message',
			task: validTask,
			schema: simpleSchema,
			errorMessage: undefined,
			expected: { "TAG": "Ok", "_0": undefined },
		},
	]

	testCases.forEach(({ name, task, schema, errorMessage, expected }) => {
		test(name, () => {
			const result = validateTransformation(task, schema, errorMessage)
			expect(result).toEqual(expected)
		})
	})
})

// --- Later

describe('validateTask', () => {
	const twelve = new Date(new Date().setHours(12, 0, 0, 0)).toISOString()
	const defaultTask = {
		task: ' ',
		waste: 1,
		ttc: 1,
		eta: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), //'12:00',
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


describe('calculateWaste', () => {
	const start = new Date(1692975600000) // Friday, August 25, 2023 10:00:00 AM GMT-05:00
	const completedTime = new Date(1692977400000) // Friday, August 25, 2023 10:30:00 AM GMT-05:00 	
	const completedTimeSeconds = completedTime.getTime() / 1000

	const hoursToMillis = hours => hours * 60000 * 60
	const fmt = (dateISO) => format(new Date(dateISO), 'yyyy-MM-dd\'T\'HH:mm:ssXXX', { timeZone: 'America/Chicago' }) // gets it in correct format, so tests will pass
	const add = (dateA, hour) => fmt(new Date(dateA.getTime() + hoursToMillis(hour)).toISOString()) // used to be without these wrappers, but now dates are ISO strings


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

describe('highlightTaskRow', () => {
	const testCases = [
		{ isHighlighting: true, isChecked: true, isOld: true, expected: 'selected' },
		{ isHighlighting: true, isChecked: false, isOld: true, expected: '' },
		{ isHighlighting: true, isChecked: true, isOld: false, expected: 'selected' },
		{ isHighlighting: true, isChecked: false, isOld: false, expected: '' },
		{ isHighlighting: false, isChecked: true, isOld: true, expected: '' },
		{ isHighlighting: false, isChecked: false, isOld: true, expected: 'old' },
		{ isHighlighting: false, isChecked: true, isOld: false, expected: '' },
		{ isHighlighting: false, isChecked: false, isOld: false, expected: '' },
	]

	describe.each(testCases)('highlightTaskRow', ({ isHighlighting, isChecked, isOld, expected }) => {
		it(`returns "${expected}" for isHighlighting: ${isHighlighting}, isChecked: ${isChecked}, isOld: ${isOld}`, () => {
			expect(highlightTaskRow(isHighlighting, isChecked, isOld)).toBe(expected)
		})
	})

	it('throws TypeError for illegal inputs', () => {
		expect(() => highlightTaskRow('string', true, false)).toThrow(TypeError)
		expect(() => highlightTaskRow(true, 'string', false)).toThrow(TypeError)
		expect(() => highlightTaskRow(true, true, 'string')).toThrow(TypeError)
	})
})

describe('ordinalSet', () => {
	const testCases = [
		{
			description: 'should return empty array for empty input',
			input: [],
			expected: [],
		},
		{
			description: 'should assign ordinal values to unique numbers in the input array',
			input: [1, 3, 2],
			expected: [0, 2, 1],
		},
	]

	testCases.forEach(({ description, input, expected }) => {
		it(description, () => {
			expect(ordinalSet(input)).toEqual(expected)
		})
	})
})

describe('deleteDnDEvent', () => {
	const testCases = [
		{
			description: 'should delete a single index',
			input: [[1, 3, 2, 4, 5], [0, 0]],
			expected: [1, 0, 2, 3],
		},
		{
			description: 'should delete a range of indices starting from 0',
			input: [[1, 3, 2, 4, 5], [0, 2]],
			expected: [0, 1],
		},
		{
			description: 'should delete another range of indices starting from not 0',
			input: [[1, 3, 2, 4, 5], [2, 3]],
			expected: [0, 1, 2],
		},
	]

	testCases.forEach(({ description, input, expected }) => {
		it(description, () => {
			expect(deleteDnDEvent(...input)).toEqual(expected)
		})
	})
})

describe('diagonalize', () => {
	const testCases = [
		{
			description: 'Generates a new string not present in the original list',
			input: ['apple', 'banana', 'cherry', 'glass'],
			expected: 'bbft',
		},
		{
			description: 'Handles empty string list',
			input: [],
			expected: '',
		},
		{
			description: 'Throws error for invalid input',
			input: 123,
			expectedError: 'Invalid input. Expected an array of strings.',
		},
	]

	testCases.forEach(({ description, input, expected, expectedError }) => {
		it(description, () => {
			if (expectedError) {
				expect(diagonalize(input)).toEqual('')
			} else {
				expect(diagonalize(input)).toEqual(expected)
			}
		})
	})
})

describe('calculateRange', () => {
	const testCases = [
		{
			description: 'Calculates the range for a valid page and tasks per page',
			input: [10, 3],
			expected: [21, 30],
		},
		{
			description: 'Handles invalid input with default range',
			input: ['abc', 2],
			expected: [0, undefined],
		},
		{
			description: 'Handles invalid input with default range',
			input: [10, 'xyz'],
			expected: [0, undefined],
		},
	]

	testCases.forEach(({ description, input, expected }) => {
		it(description, () => {
			expect(calculateRange(...input)).toEqual(expected)
		})
	})
})
