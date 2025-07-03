/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
/* eslint-disable max-params */

// TODO: PBT the complex setup orchestrator functions
// Progress = / 
// Missing =>
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
	deleteMultipleDnDEvent,
	pipe,
	getAvailableThreads,
	computeUpdatedLiveTime, // compute part of live time. not covered by property based tests (it is effectively addition)
	getInsertionIndex,
	insertTaskAtIndex,
} from '../../../Core/utils/helpers.js'
import { MAX_SAFE_DATE } from '../../../Core/utils/constants.js'
import { fc } from '@fast-check/jest'

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
describe('deleteMultipleDnDEvent', () => {
	const testCases = [
		{
			description: '([0, 1], [0]) -> [0]. Should delete 0th item then make the list an ordinal set.',
			input: {
				dnd: [0, 1],
				indices: [0]
			},
			expected: [0],
		},
		{
			description: '([], [n]) -> []. Should return empty list when empty dnd is given with any index.',
			input: {
				dnd: [],
				indices: [0]
			},
			expected: [],
		},
		{
			description: '([0], [n > len]) -> [0]. Should return same list when non-empty dnd is given with out of bounds index.',
			input: {
				dnd: [0],
				indices: [5]
			},
			expected: [0],
		},
		{
			description: '([1,2,0], [2]) -> [0, 1]. Should return ordinal set of removed index on typical input.',
			input: {
				dnd: [1, 2, 0],
				indices: [2]
			},
			expected: [0, 1],
		},
		{
			description: '([2,1,0], [1]) -> [1, 0]. Should return ordinal set of removed index on typical input.',
			input: {
				dnd: [2, 1, 0],
				indices: [1]
			},
			expected: [1, 0],
		},
		{
			description: '([2,1,0], [1,2]) -> [0]. Should return ordinal set of removed index on typical multiple delete.',
			input: {
				dnd: [2, 1, 0],
				indices: [1, 2]
			},
			expected: [0],
		},
		{
			description: '([2,1,0,3,5,4], [1,2]) -> [0,1,3,2]. Should return ordinal set of removed index on typical multiple delete.',
			input: {
				dnd: [2, 1, 0, 3, 5, 4],
				indices: [1, 2]
			},
			expected: [0, 1, 3, 2],
		},
	]
	testCases.forEach(({ description, input, expected }) => {
		it(description, () => {
			const { dnd, indices } = input
			expect(deleteMultipleDnDEvent(dnd, indices)).toEqual(expected)
		})
	})
	// --- Property based tests

	// 1. Idempotency on invalid index – If an index is out of bounds, the output is the ordinal set of the input.
	it('Idempotency on invalid index property - If an index is out of bounds, it is ignored in the output', () => {
		fc.assert(fc.property(
			fc.array(fc.nat(), { minLength: 0, maxLength: 100 }),
			fc.array(fc.integer({ min: 0, max: 200 })),
			(dnd, indices) => {
				expect(deleteMultipleDnDEvent(dnd, indices)).toEqual(deleteMultipleDnDEvent(dnd, indices.filter(idx => 0 <= idx && idx < dnd.length)))
			}
		))
	})
	// 2. Length Decreases by at Most One – Removing an index should never add elements.
	it('Length Decreases by at Most One property - Removing an index should never add elements', () => {
		fc.assert(fc.property(
			fc.array(fc.nat(), { minLength: 0, maxLength: 100 }),
			fc.array(fc.integer({ min: 0, max: 100 })),
			(dnd, indices) => {
				const result = deleteMultipleDnDEvent(dnd, indices);
				return result.length <= dnd.length && result.length >= Math.max(0, dnd.length - indices.length)
			}
		))
	})
	// 3. Ordinal Property – The resulting list should always be a valid ordinal set [0, 1, 2, ...].
	it('Ordinal Property - The resulting list should always be a valid ordinal set [0, 1, 2, ...]', () => {
		fc.assert(fc.property(
			fc.array(fc.nat(), { minLength: 0, maxLength: 100 }),
			fc.array(fc.nat({ min: 0, max: 100 })),
			(dnd, indices) => {
				return isOrdinalSet(deleteMultipleDnDEvent(dnd, indices))
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
describe('computeUpdatedLiveTime', () => {
	const testCases = [
		{
			description: "7 = 5 + 2. Should be 7 when oldLiveTime is 5 and the liveTimeStamp is 2 hours ago",
			input: {
				oldLiveTime: 5,
				liveTimeStamp: new Date(Date.now() - hoursToMillis(2)).toISOString(), // 2 hours ago
				currentTime: new Date(),
			},
			expected: 7 // 5 + 2
		},
		{
			description: "4 = 3 + 1. Should be 4 when oldLiveTime is 3 and the liveTimeStamp is 1 hour ago",
			input: {
				oldLiveTime: 3,
				liveTimeStamp: new Date(Date.now() - hoursToMillis(1)).toISOString(), // 1 hour ago
				currentTime: new Date(),
			},
			expected: 4 // 3 + 1
		},
		{
			description: "7 = 4 + 3. Should be 7 when oldLiveTime is 4 and the liveTimeStamp is 3 hours ago",
			input: {
				oldLiveTime: 4,
				liveTimeStamp: new Date(Date.now() - hoursToMillis(3)).toISOString(), // 3 hours ago
				currentTime: new Date(),
			},
			expected: 7 // 4 + 3
		},
		{
			description: "2 = 2 + 0. Should be 2 when oldLiveTime is 2 and the liveTimeStamp is 0 hours ago",
			input: {
				oldLiveTime: 2,
				liveTimeStamp: new Date(),
				currentTime: new Date(),
			},
			expected: 2 // No increase
		},
		{
			description: "5 = 6 - 1. Should be 5 when oldLiveTime is 6 and the liveTimeStamp is 1 hour in the future",
			input: {
				oldLiveTime: 6,
				liveTimeStamp: new Date(Date.now() + hoursToMillis(1)).toISOString(), // 1 hour in the future
				currentTime: new Date(),
			},
			expected: 5 // 6 - 1
		}
	]
	testCases.forEach(({ description, input, expected }) => {
		test(description, () => {
			const result = computeUpdatedLiveTime(input)
			expect(result).toBeCloseTo(expected, 6)
		})
	})
	// --- Property Based Tests
})
describe('getInsertionIndex', () => {
	const testCases = [
		{
			name: 'Page 1, less than full page → insert at end',
			input: { tasksPerPage: 10, pageNumber: 1, taskList: Array(7).fill('task') },
			expected: 7,
		},
		{
			name: 'Page 1, exactly full page → insert at endIndex - 1',
			input: { tasksPerPage: 10, pageNumber: 1, taskList: Array(10).fill('task') },
			expected: 9,
		},
		{
			name: 'Page 2, taskList has 20 → full → insert at endIndex - 1',
			input: { tasksPerPage: 10, pageNumber: 2, taskList: Array(20).fill('task') },
			expected: 19,
		},
		{
			name: 'Page 2, only 15 tasks → incomplete page → insert at end',
			input: { tasksPerPage: 10, pageNumber: 2, taskList: Array(15).fill('task') },
			expected: 15,
		},
		{
			name: 'Page 3, taskList only has 15 → insert at end',
			input: { tasksPerPage: 10, pageNumber: 3, taskList: Array(15).fill('task') },
			expected: 15,
		},
		{
			name: 'Page 1, empty task list → insert at index 0',
			input: { tasksPerPage: 10, pageNumber: 1, taskList: [] },
			expected: 0,
		},
		{
			name: 'Page 2, taskList has 11 -> insert at index 10',
			input: { tasksPerPage: 10, pageNumber: 2, taskList: Array(11).fill('task')},
			expected: 11,
		}
	]
	testCases.forEach(({ name, input, expected }) => {
    test(name, () => {
      expect(getInsertionIndex(input)).toBe(expected)
    })
  })
})
describe('insertTaskAtIndex', () => {
  const testCases = [
    {
      name: 'Insert in middle',
      input: {
        taskList: ['A', 'B', 'D'],
        insertLocation: 2,
        addedTask: 'C',
      },
      expected: ['A', 'B', 'C', 'D'],
    },
    {
      name: 'Insert at beginning',
      input: {
        taskList: ['B', 'C'],
        insertLocation: 0,
        addedTask: 'A',
      },
      expected: ['A', 'B', 'C'],
    },
    {
      name: 'Insert at end',
      input: {
        taskList: ['A', 'B'],
        insertLocation: 2,
        addedTask: 'C',
      },
      expected: ['A', 'B', 'C'],
    },
    {
      name: 'Insert into empty list',
      input: {
        taskList: [],
        insertLocation: 0,
        addedTask: 'X',
      },
      expected: ['X'],
    },
	{
      name: 'Insert into page 2 with array(11) to have it at end of array',
      input: {
        taskList: Array(11).fill('task'),
        insertLocation: 11,
        addedTask: 'X',
      },
      expected: [...Array(11).fill('task'), 'X'],
    },
  ]
  testCases.forEach(({ name, input, expected }) => {
    test(name, () => {
      expect(insertTaskAtIndex(input)).toEqual(expected)
    })
  })
})