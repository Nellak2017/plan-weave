/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { simpleTaskSchema, fillDefaultsForSimpleTask } from "./simpleTaskSchema"
import { TASK_STATUSES } from '../../utils/constants'

const timestamp = Math.floor((new Date()).getTime() / 1000)
const fourteenThirty = new Date(new Date().setHours(14, 30, 0, 0)).toISOString()
const nineFifteen = new Date(new Date().setHours(9, 15, 0, 0)).toISOString()
const twelve = new Date(new Date().setHours(12, 0, 0, 0)).toISOString()

const validTask = {
	task: 'Example task',
	waste: 1,
	ttc: 1,
	eta: fourteenThirty,//'14:30',
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
			eta: nineFifteen, //'09:15',
			id: 2,
			status: TASK_STATUSES.INCOMPLETE,
			completedTimeStamp: timestamp - 3600, // Subtracting 1 hour to the current timestamp
			hidden: false,
		},
		{
			task: 'Another task',
			waste: 0.5,
			ttc: 2,
			eta: nineFifteen, //'09:15',
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
			eta: fourteenThirty,//'14:30',
			id: 1,
		},
		{
			task: 'Example task 1',
			waste: 'invalid', // invalid type
			ttc: 1,
			eta: fourteenThirty, //'14:30',
			id: 1,
		},
		{
			task: 'Example task 2',
			waste: 1,
			ttc: 'invalid', // invalid type
			eta: fourteenThirty, //'14:30',
			id: 1,
		},
		{
			task: 'Example task 3',
			waste: 1,
			ttc: 1,
			eta: '2', // invalid type
			id: 1,
		},
		{
			task: 'Example task 4',
			waste: 1,
			ttc: 1,
			eta: fourteenThirty,// '14:30',
			// id is missing
		},
		{
			task: 'Example task 5',
			waste: 1,
			ttc: 1,
			eta: fourteenThirty, //1,
			id: 'invalid', // invalid type
		},
		{
			task: 'My Task 1',
			waste: 1,
			ttc: 1,
			eta: '14:30', // invalid
			id: 1,
		},
		{
			task: 'My Task 2',
			waste: 1,
			ttc: 1,
			eta: fourteenThirty, //'14:30',
			id: 0, // invalid
		},
		{
			// Empty object
		},
		{
			// Some attributes missing
			task: 'Example task 6',
			waste: 1,
			// ttc, eta, id missing
		},
		{
			// Invalid status
			task: 'Example task 7',
			waste: 1,
			ttc: 1,
			eta: fourteenThirty, //'14:30',
			id: 1,
			status: 'InvalidStatus', // This status is not one of the allowed values
		},
		{
			task: 'Another task 1',
			waste: 0.5,
			ttc: 2,
			eta: nineFifteen, //'09:15',
			id: 2,
			status: TASK_STATUSES.INCOMPLETE,
			completedTimeStamp: 'timestamp - 3600', // invalid Timestamp
			hidden: false,
		},
		{
			task: 'Another task 2',
			waste: 0.5,
			ttc: 2,
			eta: nineFifteen, //'09:15',
			id: 2,
			status: TASK_STATUSES.COMPLETED,
			completedTimeStamp: timestamp - 3600, 
			hidden: 0, // invalid hidden
		},
		{
			task: 'Another task 3',
			waste: 0.5,
			ttc: 2,
			eta: nineFifteen, //'09:15',
			id: 2,
			status: TASK_STATUSES.COMPLETED,
			completedTimeStamp: timestamp - 3600, 
			hidden: 'true', // invalid hidden
		},
		{
			task: 'Another task 4',
			waste: 0.5,
			ttc: 2,
			eta: nineFifteen, //'09:15',
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
			eta: twelve, //'12:00',
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

	const invalidLengthTestCases = [
		{
			task: 'x'.repeat(51), // 51 characters
			waste: 1,
			ttc: 1,
			eta: fourteenThirty, //'14:30',
			id: 1,
		},
		{
			task: 'x'.repeat(52), // 52 characters
			waste: 1,
			ttc: 1,
			eta: fourteenThirty, //'14:30',
			id: 1,
		},
		{
			task: 'x'.repeat(500), // 500 characters
			waste: 1,
			ttc: 1,
			eta: fourteenThirty, //'14:30',
			id: 1,
		},
		// Add more invalid length test cases as needed
	]

	const validTimeStamps = [
		{
			task: 'Example task',
			waste: 1,
			ttc: 1,
			eta: twelve, //'12:00',
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
			eta: twelve, //'12:00',
			id: 1,
			status: 'incomplete',
			timestamp: 'invalid-timestamp', // An invalid timestamp
		},
	]

	it('Should work on valid Simple Tasks Generated with fillDefaults function', async () => {
		const defaultTasks = fillDefaultsForSimpleTask({})
		const result = await simpleTaskSchema.isValid(defaultTasks)
		expect(result).toBe(true)
	})

	it.each(validTestCases)('Should work on valid task', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase)
		expect(result).toBe(true)
	})

	it.each(invalidTestCases)('Should reject invalid task', async (testCase) => {
		const result = await simpleTaskSchema.isValid(testCase, { strict: true })
		if (result) console.log(testCase)
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