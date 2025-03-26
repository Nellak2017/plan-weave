/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */

// TODO: PBT the ones that need it such as: dateToToday
// Progress = 16 / 23
// Missing => deleteDnDEvent, deleteMultipleDnDEvent, taskListPipe, calculateLiveTime, calculateWaste, calculateEta, calculateEfficiency, getAvailableThreads
import {
	clamp,
	add,
	subtract,
	between,
	isTimestampFromToday,
	hoursToMillis,
	millisToHours,
	isRelativelyOrdered, // not covered by property based tests
	highlightTaskRow, // not covered by property based tests (only 8 cases)
	dateToToday,
	isTaskOld,
	ordinalSet,
	isOrdinalSet, // not covered by any tests other than manual tests
	rearrangeDnD,
	deleteDnDEvent,
	pipe,
	getAvailableThreads,

	deleteMultipleDnDEvent, taskListPipe, calculateLiveTime, calculateWaste, calculateEta, calculateEfficiency,
	// reorderList, // not covered by property based tests (Annoying, also unused content)
} from '../../../Core/utils/helpers.js'
import { TASK_STATUSES, MAX_SAFE_DATE, MAX_SAFE_DATE_SMALL } from '../../../Core/utils/constants.js'
import { format } from 'date-fns-tz'
import { fc } from '@fast-check/jest'
import { formatISO } from 'date-fns'

describe('clamp', () => {
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
	])('%o + %o hours = %o', (start, hours, expectedDate) => {
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
describe('subtract dates', () => {
	// --- Example based tests
	test.each([
		[new Date(Date.parse('2024-01-17T13:00:00Z')), new Date(Date.parse('2024-01-17T12:00:00Z')), 1],
		[new Date(Date.parse('2024-01-17T10:30:00Z')), new Date(Date.parse('2024-01-17T08:00:00Z')), 2.5],
		[new Date(Date.parse('2024-01-17T20:30:00Z')), new Date(Date.parse('2024-01-17T20:00:00Z')), 0.5],
		[new Date(Date.parse('2024-01-17T20:30:00Z')), new Date(Date.parse('2024-01-17T20:30:00Z')), 0],
	])('%o - %o hours = %o', (start, hours, expectedDate) => {
		expect(subtract(start, hours)).toEqual(expectedDate)
	})
	// --- Property based tests
	it('Should return the difference in hours between two dates', () => {
		fc.assert(fc.property(fc.date(), fc.date(),
			(time, eta) => {
				const expected = (time.getTime() - eta.getTime()) / (1000 * 60 * 60)
				const actual = subtract(time, eta)
				expect(actual).toBeCloseTo(expected)
			}
		))
	})
})
describe('between', () => {
	[
		[1, { start: 0, end: 0 }, false],
		[1, { start: 0, end: 1 }, true],
		[1, { start: 1, end: 1 }, true],
		[1, { start: 0, end: -1 }, false],
	].forEach(([value, range, expectedBool]) => {
		it(`${value} ${expectedBool ? 'is' : 'is not'} between (${range?.start}, ${range?.end})`, () => {
			expect(between(value, range)).toBe(expectedBool)
		})
	})
	// --- Property based tests
	it('Should have value always be between start and end inclusive', () => {
		fc.assert(fc.property(fc.integer(), fc.record({ start: fc.integer(), end: fc.integer() }),
			(value, { start, end }) => {
				const expected = value >= start && value <= end
				expect(between(value, { start, end })).toBe(expected)
			}
		))
	})
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
		it(`${timestamp} epoch (${new Date(timestamp * 1000)}) is ${expected ? '' : 'not '}from today ${today}`, () => {
			expect(isTimestampFromToday(today, timestamp, elapsed)).toBe(expected)
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
describe('isRelativelyOrdered', () => {
	// --- Example based tests
	const testCases = [
		{ list1: [3, 4], list2: [0, 1], expected: true },
		{ list1: [1, 2, 3], list2: [0, 1, 2], expected: true },
		{ list1: [1, 3, 2], list2: [0, 2, 1], expected: true },
		{ list1: [3, 1], list2: [2, 0], expected: true },
		{ list1: [1], list2: [0], expected: true },
		{ list1: [], list2: [], expected: true },
		{ list1: [1, 2, 3, 4], list2: [10, 20, 30, 40], expected: true },
		{ list1: [3, 4], list2: [1, 0], expected: false },
		{ list1: [1, 3, 2], list2: [1, 0, 2], expected: false },
		{ list1: [3, 1], list2: [0, 2], expected: false },
		{ list1: [1, 2, 3, 4], list2: [10, 30, 20, 40], expected: false },
	]
	testCases.forEach(({ list1, list2, expected }, index) => {
		test(`[${list1}] with [${list2}] dnd config is ${expected ? 'relatively ordered' : 'not relatively ordered'}`, () => {
			expect(isRelativelyOrdered(list1, list2)).toBe(expected)
		})
	})
})
describe('highlightTaskRow', () => {
	const testCases = [
		{ isHighlighting: true, isChecked: true, isOld: true, expected: 'selected' },
		{ isHighlighting: true, isChecked: true, isOld: false, expected: 'selected' },
		{ isHighlighting: true, isChecked: false, isOld: true, expected: '' },
		{ isHighlighting: true, isChecked: false, isOld: false, expected: '' },
		{ isHighlighting: false, isChecked: true, isOld: true, expected: '' },
		{ isHighlighting: false, isChecked: true, isOld: false, expected: '' },
		{ isHighlighting: false, isChecked: false, isOld: true, expected: 'old' },
		{ isHighlighting: false, isChecked: false, isOld: false, expected: '' },
	]
	describe.each(testCases)('highlightTaskRow', ({ isHighlighting, isChecked, isOld, expected }) => {
		it(`returns "${expected}" for isHighlighting: ${isHighlighting}, isChecked: ${isChecked}, isOld: ${isOld}`, () => {
			expect(highlightTaskRow(isHighlighting, isChecked, isOld)).toBe(expected)
		})
	})
})
describe('dateToToday', () => {
	const testCases = [
		{
			input: new Date('2023-01-15T12:00:00Z').toISOString(),
			expected: new Date(new Date().setHours(6, 0, 0, 0)).toISOString(),
		},
		{
			input: new Date('2023-12-31T23:59:59Z').toISOString(),
			expected: new Date(new Date().setHours(17, 59, 59, 0)).toISOString(),
		},
	]
	testCases.forEach(({ input, expected }) => {
		it(`${input} would be ${expected} if it were today`, () => {
			const result = dateToToday(input)
			expect(result).toEqual(expected)
		})
	})
	// --- Property based tests
})
describe('isTaskOld', () => {
	const testCases = [
		{
			input: {
				timeRange: {
					start: '2023-03-18T00:00:00Z', // UTC Mar 18, 2023, 12:00:00 AM
					end: '2023-03-18T23:59:58Z' // UTC Mar 18, 2023, 11:59:58 PM
				},
				eta: '2023-03-18T23:59:59Z' // UTC Mar 18, 2023, 11:59:59 PM
			},
			expected: true,
		},
		{
			input: {
				timeRange: undefined,
				eta: '2023-03-17T12:00:00Z'
			},
			expected: true,
		},
		{
			input: {
				timeRange: {
					start: '2025-03-18T19:20:00.000Z', // UTC Mar 18, 2025, 7:20:00 PM
					end: '2025-03-18T06:00:00.000Z', // UTC Mar 18, 2025, 6:00:00 AM
				},
				eta: '2023-03-18T12:00:00Z' // UTC Mar 18, 2023, 12:00:00 PM
			},
			expected: true,
		},
		{
			input: {
				timeRange: {
					start: '2025-03-18T06:00:00.000Z', // UTC Mar 18, 2025, 6:00:00 AM
					end: '2025-03-18T19:20:00.000Z', // UTC Mar 18, 2025, 7:20:00 PM
				},
				eta: '2023-03-18T12:00:00Z' // UTC Mar 18, 2023, 12:00:00 PM
			},
			expected: true,
		},
		{
			input: {
				timeRange: {
					start: '2025-03-18T06:00:00.000Z', // UTC Mar 18, 2025, 6:00:00 AM
					end: '2025-03-18T19:20:00.000Z', // UTC Mar 18, 2025, 7:20:00 PM
				},
				eta: '2025-03-18T19:19:00.000Z' // UTC Mar 18, 2025, 7:19:00 PM
			},
			expected: false,
		},
	]
	testCases.forEach(({ input, expected }) => {
		it(`A task on ${input?.eta} is ${expected ? 'not old' : 'old'} in the range of ${input?.timeRange?.start} to ${input?.timeRange?.end}`, () => {
			expect(isTaskOld(input)).toBe(expected)
		})
	})
	// --- Property Tests
	it('Should return true only if eta is outside of the given time range', () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 0, max: MAX_SAFE_DATE }), // Random ETA (>= 1971)
				fc.integer({ min: 0, max: MAX_SAFE_DATE }), // Start Date (>= 1971)
				fc.integer({ min: 0, max: MAX_SAFE_DATE }), // End Date (>= 1971)
				(etaMillis, startMillis, endMillis) => {
					expect(isTaskOld({
						eta: new Date(etaMillis).toISOString(),
						timeRange: { start: new Date(startMillis).toISOString(), end: new Date(endMillis).toISOString() }
					})).toBe(!between(etaMillis, { start: startMillis, end: endMillis }))
				}
			),
		)
	})
})
describe('ordinalSet', () => {
	// --- Example based tests
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

	// --- Property based tests
	it('should preserve the length of the array', () => {
		fc.assert(fc.property(
			fc.array(fc.integer()),
			(dnd) => {
				expect((ordinalSet(dnd)).length).toBe(dnd.length)
			}
		))
	})
	it('should produce ordinal values within the correct range', () => {
		fc.assert(fc.property(
			fc.array(fc.integer()),
			(dnd) => {
				expect((ordinalSet(dnd)).every(value => value >= 0 && value < new Set(dnd).size)).toBe(true)
			}
		))
	})
	it('should preserve the uniqueness of ordinal values', () => {
		fc.assert(fc.property(
			fc.array(fc.integer()),
			(dnd) => {
				expect(new Set((ordinalSet(dnd))).size).toBe(new Set(dnd).size)
			}
		))
	})
	it('should correctly map input numbers to their ordinal values', () => {
		fc.assert(fc.property(
			fc.array(fc.integer()),
			(dnd) => {
				const result = ordinalSet(dnd)
				const uniqueSortedArr = [...new Set(dnd)].sort((a, b) => a - b)
				const mapping = {}
				uniqueSortedArr.forEach((num, index) => {
					mapping[num] = index
				})
				const correctMapping = dnd.every((num, index) => result[index] === mapping[num])
				expect(correctMapping).toBe(true)
			}
		))
	})
})
describe('rearrangeDnD', () => {
	// --- Example based tests
	const initialDnD = [1, 2, 3, 4], destinations = [0, 1, 2, 3]
	destinations.forEach(destination => {
		it(`moves 4 to index ${destination}`, () => {
			const result = rearrangeDnD(initialDnD, 3, destination)
			const expected = [...initialDnD] // Copy the initial DnD array
			expected.splice(destination, 0, expected.splice(3, 1)[0]) // Perform the same rearrangement as the function
			expect(result).toEqual(expected)
		})
	})
	// --- Property based tests
	it('should preserve the length of the array', () => {
		fc.assert(fc.property(
			fc.array(fc.anything()),
			fc.nat(),
			fc.nat(),
			(dnd, source, destination) => {
				const sourceIndex = source % dnd.length
				const destinationIndex = destination % dnd.length
				const result = rearrangeDnD(dnd, sourceIndex, destinationIndex)
				expect(result.length).toBe(dnd.length)
			}
		))
	})
	it('should contain the same elements as the original array', () => {
		fc.assert(fc.property(
			fc.array(fc.nat()),
			fc.nat(),
			fc.nat(),
			(dnd, source, destination) => {
				const sourceIndex = source % dnd.length
				const destinationIndex = destination % dnd.length
				const result = rearrangeDnD(dnd, sourceIndex, destinationIndex)
				const originalSorted = [...dnd].sort()
				const resultSorted = [...result].sort()
				expect(originalSorted).toEqual(resultSorted)
			}
		))
	})
	it('should be identical if source and destination are the same', () => {
		fc.assert(fc.property(
			fc.array(fc.anything()), // Arbitrary array
			fc.nat(),
			(dnd, index) => {
				const idx = index % dnd.length
				const result = rearrangeDnD(dnd, idx, idx)
				expect(result).toEqual(dnd)
			}
		))
	})
	it('should preserve the order of elements not involved in the move', () => {
		fc.assert(fc.property(
			fc.array(fc.anything()), // Arbitrary array
			fc.nat(),
			fc.nat(),
			(dnd, source, destination) => {
				const sourceIndex = source % dnd.length
				const destinationIndex = destination % dnd.length
				const result = rearrangeDnD(dnd, sourceIndex, destinationIndex)
				const originalWithoutMovedItem = dnd.filter((_, i) => i !== sourceIndex)
				const resultWithoutMovedItem = result.filter((_, i) => i !== destinationIndex)

				expect(originalWithoutMovedItem).toEqual(resultWithoutMovedItem)
			}
		)
		)
	})
	it('should place the moved item in the correct position', () => {
		fc.assert(fc.property(
			fc.array(fc.anything()), // Arbitrary array
			fc.nat(),
			fc.nat(),
			(dnd, source, destination) => {
				if (dnd.length === 0) return true
				const sourceIndex = source % dnd.length
				const destinationIndex = destination % dnd.length
				const result = rearrangeDnD(dnd, sourceIndex, destinationIndex)
				expect(result[destinationIndex]).toEqual(dnd[sourceIndex])
			}
		))
	})
	it('should maintain the correctness of the overall array', () => {
		fc.assert(fc.property(
			fc.array(fc.anything()), // Arbitrary array
			fc.nat(),
			fc.nat(),
			(dnd, source, destination) => {
				if (dnd.length === 0) return true
				const sourceIndex = source % dnd.length
				const destinationIndex = destination % dnd.length
				const result = rearrangeDnD(dnd, sourceIndex, destinationIndex)

				const expectedArray = [
					...dnd.slice(0, sourceIndex),
					...dnd.slice(sourceIndex + 1)
				]
				const resultWithoutMovedItem = [
					...result.slice(0, destinationIndex),
					...result.slice(destinationIndex + 1)
				]
				expect(expectedArray).toEqual(resultWithoutMovedItem)
			}
		))
	})
})
describe('deleteDnDEvent', () => {
	const testCases = [
		{
			description: '([0, 1], 0) -> [0]. Should delete 0th item then make the list an ordinal set.',
			input: {
				dnd: [0, 1],
				index: 0
			},
			expected: [0],
		},
		{
			description: '([], n) -> []. Should return empty list when empty dnd is given with any index.',
			input: {
				dnd: [],
				index: 0
			},
			expected: [],
		},
		{
			description: '([0], n > len) -> [0]. Should return same list when non-empty dnd is given with out of bounds index.',
			input: {
				dnd: [0],
				index: 5
			},
			expected: [0],
		},
		{
			description: '([1,2,0], 2) -> [0, 1]. Should return ordinal set of removed index on typical input.',
			input: {
				dnd: [1, 2, 0],
				index: 2
			},
			expected: [0, 1],
		},
		{
			description: '([2,1,0], 1) -> [1, 0]. Should return ordinal set of removed index on typical input.',
			input: {
				dnd: [2, 1, 0],
				index: 1
			},
			expected: [1, 0],
		},
	]
	testCases.forEach(({ description, input, expected }) => {
		it(description, () => {
			const { dnd, index } = input
			expect(deleteDnDEvent(dnd, index)).toEqual(expected)
		})
	})
	// --- Property based tests
	// 1. Idempotency on invalid index – If an index is out of bounds, the output is the ordinal set of the input.
	it('Idempotency on invalid index property - If an index is out of bounds, the output is the ordinal set of the input', () => {
		fc.assert(fc.property(
			fc.array(fc.nat(), { minLength: 0, maxLength: 100 }),
			fc.integer({ min: 0, max: 200 }),
			(dnd, index) => {
				return (index < 0 || index >= dnd.length)
					? JSON.stringify(deleteDnDEvent(dnd, index)) === JSON.stringify(ordinalSet(dnd))
					: true
			}
		))
	})
	// 2. Length Decreases by at Most One – Removing an index should never add elements.
	it('Length Decreases by at Most One property - Removing an index should never add elements', () => {
		fc.assert(fc.property(
			fc.array(fc.nat(), { minLength: 0, maxLength: 100 }),
			fc.integer({ min: 0, max: 100 }),
			(dnd, index) => {
				const result = deleteDnDEvent(dnd, index)
				return result.length <= dnd.length && result.length >= Math.max(0, dnd.length - 1)
			}
		))
	})
	// 3. Ordinal Property – The resulting list should always be a valid ordinal set [0, 1, 2, ...].
	it('Ordinal Property - The resulting list should always be a valid ordinal set [0, 1, 2, ...]', () => {
        fc.assert(fc.property(
            fc.array(fc.nat(), { minLength: 0, maxLength: 100 }),
            fc.nat(),
            (dnd, index) => {
                return isOrdinalSet(deleteDnDEvent(dnd, index))
            }
        ))
    })
})
describe('pipe', () => {
	const areFunctionsEqual = (func1, func2) => (func1.length !== func2.length)
		? false
		: func1.toString() === func2.toString()
	// --- Property based tests
	// 1. Identity Property: (I ∘ I)(f) = f ; pipe(I, I)(f) = f
	// 2. Associativity Property: (f ∘ g) ∘ h = f ∘ (g ∘ h)
	test('Identity Property: (f ∘ I) = f ; pipe(I, I, ...1 or more times)(f) = f', () => {
		fc.assert(fc.property(
			fc.func(fc.anything()),
			f => {
				const I = x => x
				const result = pipe(I, I)(f)
				expect(result).toEqual(f)
			}
		))
	})
	test('Associativity Property: (f ∘ g) ∘ h = f ∘ (g ∘ h); pipe(pipe(f,g), h) = pipe(f, pipe(g, h))', () => {
		fc.assert(fc.property(
			fc.func(fc.anything()), // Generate a random function
			fc.func(fc.anything()), // Generate another random function
			fc.func(fc.anything()), // Generate another random function
			(f, g, h) => {
				const result1 = pipe(pipe(f, g), h) // Compose functions left to right
				const result2 = pipe(f, pipe(g, h)) // Compose functions right to left
				expect(areFunctionsEqual(result1, result2)).toBe(true)
			}
		))
	})
})
describe('getAvailableThreads', () => {
	const testCases = [
		{
			input: [{ id: 1, parentThread: 'first' }, { id: 2, parentThread: 'second' }, { id: 3, parentThread: 'first' },],
			expected: ['first', 'second'],
		},
		{
			input: [{ id: 1, parentThread: '' }, { id: 2, parentThread: 'second' }, { id: 3, parentThread: 'first' },],
			expected: ['first', 'second'],
		},
		{
			input: [{ id: 1, parentThread: '     ' }, { id: 2, parentThread: 'second' }, { id: 3, parentThread: 'first' },],
			expected: ['first', 'second'],
		},
		{
			input: [{ id: 1, parentThread: '     ' },],
			expected: [],
		},
		{
			input: [],
			expected: [],
		},
		{
			input: [{ id: 1, parentThread: '     ' }, { id: 2, parentThread: 'second ' }, { id: 3, parentThread: 'first' },],
			expected: ['first', 'second'],
		},
	]
	testCases.forEach(({ input, expected }) => {
		it(`Tasks with parentThreads:   '${input.map(task => task?.parentThread)}'\n    Returns unique parentThreads: '${expected}'`, () => {
			expect(new Set(getAvailableThreads(input))).toEqual(new Set(expected))
		})
	})
	// --- Property Tests
	const taskArb = fc.array(
		fc.record({
			id: fc.integer({ min: 1, max: 10000 }),
			parentThread: fc.string(),
		})
	)
	// 1. Idempotenecy - running getAvailableThreads twice doesn't change results
	it("Idempotenecy property: running getAvailableThreads twice doesn't change results", () => {
		fc.assert(fc.property(taskArb, tasks => {
			const firstRun = getAvailableThreads(tasks)
			const secondRun = getAvailableThreads(firstRun.map(t => ({ id: t, parentThread: t })))
			expect(new Set(secondRun)).toEqual(new Set(firstRun))
		}))
	})
	// 2. Uniqueness - there should only be unique threads in output
	it('Uniqueness property: getAvailableThreads should only return unique threads', () => {
		fc.assert(fc.property(taskArb, tasks => {
			const result = getAvailableThreads(tasks)
			expect(new Set(result).size).toBe(result.length)
		}))
	})
	// 3. Input Order Agnostic - reordering the input has no effect on the output
	it('Input Order Agnostic property: getAvailableThreads should return the same threads regardless of input order', () => {
		fc.assert(fc.property(taskArb, tasks => {
			const shuffledTasks = [...tasks].sort(() => Math.random() - 0.5)
			expect(new Set(getAvailableThreads(tasks))).toEqual(new Set(getAvailableThreads(shuffledTasks)))
		}))
	})
	// 4. Complete Representation - Every thread in output is in the input Task List atleast once when the input task list is trimmed (to remove whitespace from input)
	it('Complete Representation property - getAvailableThreads should only contain threads that are present in the trimmed input', () => {
		fc.assert(fc.property(taskArb, tasks => {
			const result = new Set(getAvailableThreads(tasks))
			const validThreads = new Set(tasks.map(task => task.parentThread.trim()).filter(Boolean))
			expect([...result].every(thread => validThreads.has(thread))).toBe(true)
		}))
	})
	// 5. No White Space - The output never contains any amount of whitespace for any of the entries and none for the text as well
	it('No White Space property - getAvailableThreads should not return empty or whitespace-only threads or threads with any amount of whitespace', () => {
		fc.assert(fc.property(taskArb, tasks => {
			const result = getAvailableThreads(tasks)
			expect(result.every(thread => thread.trim() === thread && thread.length > 0)).toBe(true)
		}))
	})
})
/*
describe('calculateWaste', () => {
	// --- Example based tests
	const start = new Date(1692975600000) // Friday, August 25, 2023 10:00:00 AM GMT-05:00
	const completedTime = new Date(1692977400000) // Friday, August 25, 2023 10:30:00 AM GMT-05:00 	
	const completedTimeSeconds = completedTime.getTime() / 1000

	const hoursToMillis = hours => hours * 60000 * 60
	const fmt = (dateISO) => format(new Date(dateISO), 'yyyy-MM-dd\'T\'HH:mm:ssXXX', { timeZone: 'America/Chicago' }) // gets it in correct format, so tests will pass
	const addTestOnly = (dateA, hour) => fmt(new Date(dateA.getTime() + hoursToMillis(hour)).toISOString()) // used to be without these wrappers, but now dates are ISO strings

	// Test cases covering what happens whenever we don't want any tasks updated and just want them initialized
	const initialTestCases = [
		{
			name: 'Given a list of tasks, The first incomplete task in the list has: waste = time - eta. eta is the updated eta, not old eta',
			input: {
				taskList: [
					{ status: 'incomplete', task: 'Task 1', waste: 0, ttc: 1, eta: addTestOnly(start, -1), id: 1, timestamp: 1 }, // incomplete tasks are not guaranteed to have correct eta/waste
					{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: addTestOnly(start, 8.5), id: 2, timestamp: 2 },
					{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: addTestOnly(start, 9), id: 3, timestamp: 3 },
				],
				time: completedTime // Friday, August 25, 2023 10:30:00 AM GMT-05:00
			},
			expected: [
				{ status: 'incomplete', task: 'Task 1', waste: -.5, ttc: 1, eta: addTestOnly(start, 1), id: 1, timestamp: 1 }, // eta = 10+1=11. Waste = time - eta(new) --> Waste = 10.5 - 11 == -.5
				{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: addTestOnly(start, 1 + .5), id: 2, timestamp: 2 }, // eta = 11+.5=11.5
				{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: addTestOnly(start, 1 + .5 + 1.5), id: 3, timestamp: 3 }, // eta = 12+1.5=13
			],
		},
		{
			name: 'Given a list of tasks, The tasks completed will not be touched, but the others will have the usual waste and eta calculations applied',
			input: {
				taskList: [
					{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: addTestOnly(start, .5), id: 1, timestamp: 1, completedTimeStamp: completedTimeSeconds }, // completed tasks are guaranteed to have correct eta/waste
					{ status: 'incomplete', task: 'Task 2', waste: 0, ttc: .5, eta: addTestOnly(start, .5 + .5), id: 2, timestamp: 2 }, // incomplete tasks can have wrong eta/waste
					{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: addTestOnly(start, .5 + .5 + 1.5), id: 3, timestamp: 3 },
				],
				time: completedTime // Friday, August 25, 2023 10:30:00 AM GMT-05:00
			},
			expected: [
				{ status: 'completed', task: 'Task 1', waste: -.5, ttc: 1, eta: addTestOnly(start, .5), id: 1, timestamp: 1, completedTimeStamp: completedTimeSeconds }, // Completed tasks are not touched
				{ status: 'incomplete', task: 'Task 2', waste: -.5, ttc: .5, eta: addTestOnly(start, .5 + .5), id: 2, timestamp: 2 }, // eta = 10.5+.5=11 waste should be 0
				{ status: 'incomplete', task: 'Task 3', waste: 0, ttc: 1.5, eta: addTestOnly(start, .5 + .5 + 1.5), id: 3, timestamp: 3 }, // eta = 11+1.5=12.5 waste should be 0
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

	// --- Property based tests

	// Setup
	const startArbitrary = fc.date({ min: new Date(0), max: new Date(MAX_SAFE_DATE_SMALL) })
	const taskStatusArbitrary = fc.constantFrom(TASK_STATUSES.COMPLETED, TASK_STATUSES.INCOMPLETE, TASK_STATUSES.WAITING, TASK_STATUSES.INCONSISTENT)
	const etaArbitrary = start => fc.date({ min: start, max: new Date(MAX_SAFE_DATE_SMALL) }).map(date => formatISO(date))
	const ttcArbitrary = fc.float({ min: 0, max: 5 }).filter(ttc => !isNaN(ttc) && isFinite(ttc))
	const completedTimeStampArbitrary = fc.integer({ min: 0, max: Math.floor(Date.now() / 1000) }) // CompletedTimeStamps are epoch in seconds
	const taskArbitrary = start => fc.record({
		status: taskStatusArbitrary,
		waste: fc.float({ min: 0, max: 23 }),
		eta: etaArbitrary(start),
		ttc: ttcArbitrary,
		completedTimeStamp: completedTimeStampArbitrary,
	})
	const taskListArbitrary = start => fc.array(taskArbitrary(start), { minLength: 0 })
		.map(tasks => {
			const completedTasks = tasks.filter(task => task.status === TASK_STATUSES.COMPLETED)
			const incompleteTasks = tasks.filter(task => task.status !== TASK_STATUSES.COMPLETED)
			return [...completedTasks, ...incompleteTasks]
		})
	const timeArbitrary = start => fc.date({ min: start, max: new Date(start.getTime() + 82800000) })
	const calculateWasteArbitrary = fc.record({
		start: startArbitrary,
		taskList: fc.record({ start: startArbitrary }).chain(({ start }) => taskListArbitrary(start)),
		time: fc.option(fc.record({ start: startArbitrary }).chain(({ start }) => timeArbitrary(start)), { nil: undefined })
	})

	// Property tests
	test('completed tasks in the input taskList and output must match', () => {
		fc.assert(fc.property(
			calculateWasteArbitrary,
			({ start, taskList, time }) => {
				const result = calculateWaste({ start, taskList, time })
				const completedTasksInput = taskList.filter(task => task.status === TASK_STATUSES.COMPLETED)
				const completedTasksOutput = result.filter(task => task.status === TASK_STATUSES.COMPLETED)
				expect(completedTasksOutput).toEqual(completedTasksInput)
			}
		))
	})

	test('waste is ( currentTime - (etas[0] + startTime) ) for 1st incomplete if 1st incomplete exists in the input taskList', () => {
		fc.assert(fc.property(
			calculateWasteArbitrary,
			({ start, taskList, time }) => {
				const result = calculateWaste({ start, taskList, time })
				const incompleteTasks = result.filter(task => task.status === !TASK_STATUSES.COMPLETED)
				if (incompleteTasks.length === 0) return true
				const firstIncomplete = incompleteTasks[0]
				const firstIncompleteIndex = taskList?.findIndex(task => task?.status !== TASK_STATUSES.COMPLETED)
				const lastCompletedTimestamp = taskList[firstIncompleteIndex - 1]?.completedTimeStamp * 1000 // last completed to millis
				const startTime = firstIncompleteIndex === 0 ? start : new Date(lastCompletedTimestamp) // startTime is a Date 
				const etas0 = firstIncomplete.ttc
				const eta = add(startTime, etas0)
				const currentTime = new Date(time || new Date())
				const waste = subtract(currentTime, eta)
				expect(firstIncomplete.waste).toBeCloseTo(waste)
			})
		)
	})

	test('waste is 0 for incomplete tasks with index > first incomplete task', () => {
		fc.assert(fc.property(
			calculateWasteArbitrary,
			({ start, taskList, time }) => {
				const res = calculateWaste({ start, taskList, time })
				const firstIncompleteIndex = taskList.findIndex(task => task.status !== TASK_STATUSES.COMPLETED)
				return res.every((task, index) =>
					task.status !== TASK_STATUSES.COMPLETED && index > firstIncompleteIndex
						? task.waste === 0
						: true
				)
			}
		))
	})

	test('eta is etas[i] + startTime for all incomplete tasks, where i is indexed based on incomplete pos', () => {
		fc.assert(fc.property(
			calculateWasteArbitrary,
			({ start, taskList, time }) => {
				const res = calculateWaste({ start, taskList, time })
				const incompleteTasks = taskList.filter(task => task.status !== TASK_STATUSES.COMPLETED)
				const firstIncompleteIndex = taskList?.findIndex(task => task?.status !== TASK_STATUSES.COMPLETED)
				const lastCompletedTimestamp = taskList[firstIncompleteIndex - 1]?.completedTimeStamp * 1000
				const startTime = firstIncompleteIndex === 0 ? start : new Date(lastCompletedTimestamp)
				// const etas = etaList(incompleteTasks)
				res.every((task, i) => {
					if (task.status !== TASK_STATUSES.COMPLETED) {
						// round to nearest second. date-fns formatISO doesn't have ms precision
						expect(Math.floor(new Date(task.eta).getTime() / 1000))
							.toBeCloseTo(Math.floor(add(startTime, etas[i - firstIncompleteIndex]).getTime() / 1000))
					}
					else return true
				}
				)
			}
		))
	})

	test('len(taskList input) == len(taskList output)', () => {
		fc.assert(fc.property(
			calculateWasteArbitrary,
			({ start, taskList, time }) => {
				const output = calculateWaste({ start, taskList, time })
				return taskList.length === output.length
			}),
		)
	})

	test('task.status is valid for all tasks in output', () => {
		fc.assert(fc.property(
			calculateWasteArbitrary,
			({ start, taskList, time }) => {
				const output = calculateWaste({ start, taskList, time })
				return output.every(task => Object.values(TASK_STATUSES).includes(task.status))
			}),
		)
	})

})
describe('reorderList', () => {

	// --- Property based tests

	// Identity Property: Applying the transformation with the identity list ([0, 1, 2, ..., n]) should result in the same array of tasks.
	test('should satisfy the identity property', () => {
		fc.assert(fc.property(
			fc.array(fc.object()),
			tasks => {
				const result = reorderList(tasks, tasks.map((_, i) => i))
				expect(result).toEqual(tasks)
			}
		)
		)
	})

	// // Reversibility Property: Applying the transformation twice with its inverse should result in the original array of tasks.
	// test('should satisfy the reversibility property', () => {
	// 	fc.assert(fc.property(
	// 		fc.array(fc.object()), // Arbitrary array of objects for tasks
	// 		fc.array(fc.object()).chain(tasks => {
	// 			const indices = [...Array(tasks.length).keys()]
	// 			return fc.tuple(
	// 				fc.constant(tasks),
	// 				fc.shuffledSubarray(indices, { minLength: tasks.length, maxLength: tasks.length })
	// 			)
	// 		}),
	// 		(tasks, transformation) => {
	// 			const result1 = transform(transform(tasks, transformation), transformation.map((_, i) => transformation.indexOf(i)))
	// 			const result2 = transform(tasks, tasks.map((_, i) => i))
	// 			expect(JSON.stringify(result1)).toEqual(JSON.stringify(result2))
	// 		}
	// 	)
	// 	)
	// })

	// // Consistency Property: Reordering tasks with a transformation list should yield the same result regardless of the order of tasks or the transformation list.
	// test('should satisfy the consistency property', () => {
	// 	fc.assert(fc.property(
	// 		fc.array(fc.object()),
	// 		fc.array(fc.integer()),
	// 		fc.array(fc.object()),
	// 		fc.array(fc.integer()),
	// 		(tasks1, transformation1, tasks2) => {
	// 			// Applying the same transformation to different tasks should yield the same result
	// 			const result1 = transform(tasks1, transformation1)
	// 			const result2 = transform(tasks2, transformation1)

	// 			expect(JSON.stringify(result1)).toEqual(JSON.stringify(result2))
	// 		}
	// 	)
	// 	)
	// })

	// // Transitivity Property: If a transformation list A transforms tasks to a result B, and another transformation list B transforms B back to the original tasks, 
	// // then composing transformation lists A and B should also transform the tasks back to the original order.
	// test('should satisfy the transitivity property', () => {
	// 	fc.assert(fc.property(
	// 		fc.array(fc.object()),
	// 		fc.array(fc.integer()),
	// 		fc.array(fc.integer()),
	// 		(tasks, transformation1, transformation2) => {
	// 			// Applying composed transformation should yield the same result as applying each transformation individually
	// 			const composedTransformation = transformation2.map(i => transformation1[i])
	// 			const result1 = transform(transform(tasks, transformation1), transformation2)
	// 			const result2 = transform(tasks, composedTransformation)

	// 			expect(JSON.stringify(result1)).toEqual(JSON.stringify(result2))
	// 		}
	// 	)
	// 	)
	// })

	// // Length Preservation Property: The length of the resulting array should always be the same as the length of the input array.
	// test('should satisfy the length preservation property', () => {
	// 	fc.assert(fc.property(
	// 		fc.array(fc.object()), // Arbitrary array of objects for tasks
	// 		fc.array(fc.integer()), // Arbitrary array of integers for transformation
	// 		(tasks, transformation) => {
	// 			const result = transform(tasks, transformation)
	// 			expect(result.length).toBe(tasks.length)
	// 		}
	// 	)
	// 	)
	// })

})

describe('deleteDnDEvent', () => {
	// --- Example based tests
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

	// --- Property based tests
	// Constraints on outputs given valid inputs
	// 1. Output is an array of natural numbers
	// 	[nat, nat, nat, ...inf]
	// 2. len(Output) = len(dnd) - ((endIndex - startIndex) + 1) // since it is strictly smaller than input dnd
	// 	[nat, nat, nat, ...len(dnd) - ((endIndex - startIndex) + 1)]
	// 3. all naturals 0 to len(dnd) - ((endIndex - startIndex) + 1) are in the output // making all naturals in list unique
	// 	[nat, nat, nat, ...len(dnd) - ((endIndex - startIndex) + 1)]
	// 4. for all pairs (a, b) in the ouput and (c, d) in the input dnd, the comparison between all pairs is the same for both.
	// 	// i.e if a < b then c < d and vice versa. This ensures proper ordering of the natural numbers in the list
	// 	// ex: [1,2,3] = input after deletions, [0, 1, 2] = output => (1 < 2) === (0 < 1) and (2 < 3) === (1 < 2) etc.
	// 	[nat, nat, nat, ...len(dnd) - ((endIndex - startIndex) + 1)] // properly ordered
	const setCompare = (set1, set2) => set1.size === set2.size && [...set1].every(x => set2.has(x))
	const dndArbitrary = fc.uniqueArray(fc.nat(), { minLength: 1 })
	const indexRangeArbitrary = max => fc.tuple(
		fc.nat({ max }), // Start index is an int with a minimum of 0
		fc.nat({ max }), // End index is an int >= start
	).filter(([startIndex, endIndex]) => endIndex >= startIndex)

	// Output is an array of natural numbers
	test('Output is an array of natural numbers', () => {
		fc.assert(fc.property(
			dndArbitrary,
			dndArbitrary.chain(arr => indexRangeArbitrary(arr.length - 1)),
			(dnd, indexRange) => {
				const output = deleteDnDEvent(dnd, indexRange)
				expect(output.every(num => Number.isInteger(num) && num >= 0)).toBe(true)
			}
		))
	})

	// len(Output) = len(dnd) - ((endIndex - startIndex) + 1)
	test('len(Output) = len(dnd) - ((endIndex - startIndex) + 1)', () => {
		fc.assert(fc.property(
			dndArbitrary,
			dndArbitrary.chain(arr => indexRangeArbitrary(arr.length - 1)),
			(dnd, [startIndex, endIndex]) => {
				if (endIndex > dnd.length - 1) return // skip this case, endIndex should not be bigger than the len of list
				const output = deleteDnDEvent(dnd, [startIndex, endIndex])
				const lenOutput = output.length
				const expectedLen = dnd.length - ((endIndex - startIndex) + 1)
				expect(lenOutput).toBe(expectedLen)
			}
		))
	})

	// all naturals 0 to len(dnd) - ((endIndex - startIndex) + 1) are in output meaning no duplicates
	test('all naturals 0 to len(dnd) - ((endIndex - startIndex) + 1) are in output meaning no duplicates', () => {
		fc.assert(fc.property(
			dndArbitrary,
			dndArbitrary.chain(arr => indexRangeArbitrary(arr.length - 1)),
			(dnd, [startIndex, endIndex]) => {
				if (endIndex > dnd.length - 1) return // skip this case, endIndex should not be bigger than the len of list
				const output = deleteDnDEvent(dnd, [startIndex, endIndex])
				const expectedLen = dnd.length - ((endIndex - startIndex) + 1)
				const expectedSet = new Set([...Array(expectedLen).keys()]) // {0...expectedLen}
				const outputSet = new Set(output) // {0...expectedLen} ?
				expect(setCompare(outputSet, expectedSet)).toBe(true)
			}
		))
	})

	// for all pairs (a, b) in the ouput and (c, d) in the input dnd, the comparison between all pairs is the same for both.
	// Order is preserved after deletions
	test('Order of elements is preserved after deletions', () => {
		fc.assert(fc.property(
			dndArbitrary,
			dndArbitrary.chain(arr => indexRangeArbitrary(arr.length - 1)),
			(dnd, [startIndex, endIndex]) => {
				if (endIndex > dnd.length - 1) return // skip this case, endIndex should not be bigger than the len of list
				const output = deleteDnDEvent(dnd, [startIndex, endIndex])
				const filteredDnd = dnd.filter((_, i) => i < startIndex || i > endIndex)
				expect(isRelativelyOrdered(filteredDnd, output)).toBe(true)
			}
		))
	})

})
	*/