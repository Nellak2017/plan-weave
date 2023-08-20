import { simpleTaskSchema, fillDefaultsForSimpleTask } from "./simpleTaskSchema"
import { TASK_STATUSES } from '../../utils/constants'
import { Timestamp } from 'firebase/firestore'

const timestamp = Timestamp.fromDate(new Date()).seconds

const validTask = {
	task: 'Example task',
	waste: 1,
	ttc: 1,
	eta: '14:30',
	id: 1,
	// missing status
	// missing timestamp
}

describe('Simple Task Schema', () => {
	const validTestCases = [
		validTask,
		{
			task: 'Another task',
			waste: 0.5,
			ttc: 2,
			eta: '09:15',
			id: 2,
			status: TASK_STATUSES.INCOMPLETE,
			completedTimeStamp: timestamp - 3600, // Subtracting 1 hour to the current timestamp
			hidden: false,
		},
		{
			task: 'Another task',
			waste: 0.5,
			ttc: 2,
			eta: '09:15',
			id: 2,
			status: TASK_STATUSES.COMPLETED,
			completedTimeStamp: timestamp - 3600, // Subtracting 1 hour to the current timestamp
			hidden: true,
		},
		// Add other valid test cases here
	]

	const invalidTestCases = [
		{
			task: {}, // invalid type
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		{
			task: 'Example task',
			waste: 'invalid', // invalid type
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		{
			task: 'Example task',
			waste: 1,
			ttc: 'invalid', // invalid type
			eta: '14:30',
			id: 1,
		},
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: 1, // invalid type
			id: 1,
		},
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			// id is missing
		},
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: 1,
			id: 'invalid', // invalid type
		},
		{
			task: 'My Task',
			waste: 1,
			ttc: 1,
			eta: 'invalid', // invalid
			id: 1,
		},
		{
			task: 'My Task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 0, // invalid
		},
		{
			// Empty object
		},
		{
			// Some attributes missing
			task: 'Example task',
			waste: 1,
			// ttc, eta, id missing
		},
		{
			// Invalid status
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
			status: 'InvalidStatus', // This status is not one of the allowed values
		},
		{
			task: 'Another task',
			waste: 0.5,
			ttc: 2,
			eta: '09:15',
			id: 2,
			status: TASK_STATUSES.INCOMPLETE,
			completedTimeStamp: 'timestamp - 3600', // invalid Timestamp
			hidden: false,
		},
		{
			task: 'Another task',
			waste: 0.5,
			ttc: 2,
			eta: '09:15',
			id: 2,
			status: TASK_STATUSES.COMPLETED,
			completedTimeStamp: timestamp - 3600, 
			hidden: 0, // invalid hidden
		},
		{
			task: 'Another task',
			waste: 0.5,
			ttc: 2,
			eta: '09:15',
			id: 2,
			status: TASK_STATUSES.COMPLETED,
			completedTimeStamp: timestamp - 3600, 
			hidden: 'true', // invalid hidden
		},
		{
			task: 'Another task',
			waste: 0.5,
			ttc: 2,
			eta: '09:15',
			id: 2,
			status: TASK_STATUSES.COMPLETED,
			completedTimeStamp: timestamp - 3600, 
			hidden: '', // invalid hidden
		},
		// Add more invalid test cases as needed
	]

	const defaultAttributesTestCases = [
		// Add test cases for default attributes here
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '12:00',
			id: 1,
			status: TASK_STATUSES.INCOMPLETE,
		}
	]

	const validStatuses = [
		TASK_STATUSES.COMPLETED,
		TASK_STATUSES.INCOMPLETE,
		TASK_STATUSES.INCONSISTENT,
		TASK_STATUSES.WAITING
		// Add other valid statuses here
	]

	const invalidStatuses = [
		'InvalidStatus', // This status is not one of the allowed values
		// Add other invalid statuses here
	]

	const validTimeStrings = [
		'00:00', '01:30', '12:45', '23:59',
		// Add other valid time strings here
	]

	const invalidHours = ['-1', '25', 'abc', '123']

	const invalidMinutes = ['-1', '60', 'abc', '123']

	const missingColonTimes = ['1200', '0100', '1230', '0500']

	const invalidLengthTestCases = [
		{
			task: 'x'.repeat(51), // 51 characters
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		{
			task: 'x'.repeat(52), // 52 characters
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		{
			task: 'x'.repeat(500), // 500 characters
			waste: 1,
			ttc: 1,
			eta: '14:30',
			id: 1,
		},
		// Add more invalid length test cases as needed
	]

	const validTimeStamps = [
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '12:00',
			id: 1,
			status: 'incomplete',
			timestamp: timestamp,
		},
	]

	const invalidTimeStamps = [
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: '12:00',
			id: 1,
			status: 'incomplete',
			timestamp: 'invalid-timestamp', // An invalid timestamp
		},
	]

	it.each(validTestCases)('Should work on valid task', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase)
		expect(result).toBe(true)
	})

	it.each(invalidTestCases)('Should reject invalid task', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase)
		expect(result).toBe(false)
	})

	it.each(defaultAttributesTestCases)('Should accept all default attributes', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase)
		expect(result).toBe(true)
	})

	it.each(validStatuses)('Should accept valid status', async (status) => {
		const validTaskWithStatus = { ...validTask, status }
		const result = await simpleTaskSchema.isValid(validTaskWithStatus)
		expect(result).toBe(true)
	})

	it.each(invalidStatuses)('Should reject invalid status', async (status) => {
		const invalidTaskWithStatus = { ...validTask, status }
		const result = await simpleTaskSchema.isValid(invalidTaskWithStatus)
		expect(result).toBe(false)
	})

	it.each(validTimeStrings)('Should accept valid time string', async (eta) => {
		const validTaskWithEta = { ...validTask, eta }
		const result = await simpleTaskSchema.isValid(validTaskWithEta)
		expect(result).toBe(true)
	})

	it.each(invalidHours)('Should reject time string with invalid hours', async (hour) => {
		const invalidTask = { ...validTask, eta: `${hour}:00` }
		const result = await simpleTaskSchema.isValid(invalidTask)
		expect(result).toBe(false)
	})

	it.each(invalidMinutes)('Should reject time string with invalid minutes', async (minute) => {
		const invalidTask = { ...validTask, eta: `12:${minute}` }
		const result = await simpleTaskSchema.isValid(invalidTask)
		expect(result).toBe(false)
	})

	it.each(missingColonTimes)('Should reject time string without colon', async (time) => {
		const invalidTask = { ...validTask, eta: time }
		const result = await simpleTaskSchema.isValid(invalidTask)
		expect(result).toBe(false)
	})
	it.each(invalidLengthTestCases)('Should reject task with incorrect length', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase)
		expect(result).toBe(false)
	})
	it.each(validTimeStamps)('Should accept tasks with valid time stamps', async (testcase) => {
		const result = await simpleTaskSchema.isValid(testcase)
		expect(result).toBe(true)
	})
	it.each(invalidTimeStamps)('Should reject tasks with invalid time stamps', async (testcase) => {
		const result = await simpleTaskSchema.isValid(testcase)
		expect(result).toBe(false)
	})
})