/* eslint-disable max-lines-per-function */
import { sortFilterPipe } from '../../../UI/molecules/TaskTable/TaskTable.helpers.js'
import { TASK_STATUSES, SORTING_METHODS } from '../../../Core/utils/constants.js'
import { fc } from '@fast-check/jest'

describe('sortFilterPipe', () => {
	// --- Example based tests
	const exampleTasks = [
		{ id: 1, status: TASK_STATUSES.COMPLETED, task: 'Task 1' },
		{ id: 2, status: TASK_STATUSES.INCOMPLETE, task: 'Task 2' },
		{ id: 3, status: TASK_STATUSES.COMPLETED, task: 'Task 3' },
		{ id: 4, status: TASK_STATUSES.WAITING, task: 'Task 4' },
	]
	const testCases = [
		{
			description: 'sorts and filters tasks with completed tasks on top and search applied',
			input: {
				globalTasks: { tasks: exampleTasks },
				sortingAlgo: 'default',
				search: 'Task',
			},
			expectedOutput: [
				{ id: 1, status: TASK_STATUSES.COMPLETED, task: 'Task 1' },
				{ id: 3, status: TASK_STATUSES.COMPLETED, task: 'Task 3' },
				{ id: 2, status: TASK_STATUSES.INCOMPLETE, task: 'Task 2' },
				{ id: 4, status: TASK_STATUSES.WAITING, task: 'Task 4' },
			],
		},
		{
			description: 'handles an empty list of tasks',
			input: {
				globalTasks: { tasks: [] },
				sortingAlgo: 'default',
				search: 'Task',
			},
			expectedOutput: [],
		},
		{
			description: 'filters tasks by search term',
			input: {
				globalTasks: { tasks: exampleTasks },
				sortingAlgo: 'default',
				search: '2',
			},
			expectedOutput: [
				{ id: 2, status: TASK_STATUSES.INCOMPLETE, task: 'Task 2' },
			],
		},
		{
			description: 'sorts tasks with all tasks completed',
			input: {
				globalTasks: {
					tasks: [
						{ id: 1, status: TASK_STATUSES.COMPLETED, task: 'Task 1' },
						{ id: 2, status: TASK_STATUSES.COMPLETED, task: 'Task 2' },
					]
				},
				sortingAlgo: 'default',
				search: '',
			},
			expectedOutput: [
				{ id: 1, status: TASK_STATUSES.COMPLETED, task: 'Task 1' },
				{ id: 2, status: TASK_STATUSES.COMPLETED, task: 'Task 2' },
			],
		},
		{
			description: 'sorts tasks with no tasks completed',
			input: {
				globalTasks: {
					tasks: [
						{ id: 1, status: TASK_STATUSES.INCOMPLETE, task: 'Task 1' },
						{ id: 2, status: TASK_STATUSES.WAITING, task: 'Task 2' },
					]
				},
				sortingAlgo: 'default',
				search: '',
			},
			expectedOutput: [
				{ id: 1, status: TASK_STATUSES.INCOMPLETE, task: 'Task 1' },
				{ id: 2, status: TASK_STATUSES.WAITING, task: 'Task 2' },
			],
		},
	]

	testCases.forEach(({ description, input, expectedOutput }) => {
		test(description, () => {
			const result = sortFilterPipe(input)
			expect(result).toEqual(expectedOutput)
		})
	})

	// --- Property based tests
	/*
	---- Properties of the pipe (based on properties of units combined)
	1. output is an array of 0 or more objects which has atleast a status attribute that is a string of one of the accepted statuses // and input for arbitrary
		[{status: in TASK_STATUSES}*, ...inf]
	2. tasks with completed status are before all others if there is any
		[{status: TASK_STATUSES.COMPLETED}*, {status: !TASK_STATUSES.COMPLETED}*, ...inf]
	3. len(output) <= len(input) and len(output) == len(input) if no filter or no attribute
		[{status: TASK_STATUSES.COMPLETED}*, {status: !TASK_STATUSES.COMPLETED}*, ...<= len(input)]
	4. completed tasks and non completed tasks are sorted based on the given sort function
		[sort({status: TASK_STATUSES.COMPLETED}*), sort({status: !TASK_STATUSES.COMPLETED}*), ...<= len(input)]
	5. only tasks that contain the specified search attribute (to lower-case and trimmed) exist
		[filter(sort({status: TASK_STATUSES.COMPLETED}*), sort({status: !TASK_STATUSES.COMPLETED}*), ...<= len(input), search attribute)]
	*/
	fc.configureGlobal({ seed: -300169520 })
	const globalTasksArbitrary = fc.record({
		tasks: fc.array(fc.record({
			id: fc.nat({ min: 1 }),
			status: fc.constantFrom(...Object.values(TASK_STATUSES)),
			task: fc.string({ maxLength: 50 }),
		}))
	})
	const sortingAlgoArbitrary = fc.constantFrom(...Object.keys(SORTING_METHODS))
	const searchArbitrary = fc.string({ minLength: 0, maxLength: 50 })

	test('[{status: in TASK_STATUSES}*, ...inf]', () => {
		fc.assert(fc.property(
			globalTasksArbitrary,
			sortingAlgoArbitrary,
			searchArbitrary,
			(globalTasks, sortingAlgo, search) => {
				const outputTasks = sortFilterPipe({ globalTasks, sortingAlgo, search })
				expect(outputTasks.every(task => Object.values(TASK_STATUSES).includes(task.status))).toBe(true)
			}
		))
	})

	test('tasks with completed status are before all others if there is any', () => {
		fc.assert(fc.property(
			globalTasksArbitrary,
			sortingAlgoArbitrary,
			searchArbitrary,
			(globalTasks, sortingAlgo, search) => {
				const outputTasks = sortFilterPipe({ globalTasks, sortingAlgo, search })
				const firstNonCompletedIndex = outputTasks.findIndex(task => task.status !== TASK_STATUSES.COMPLETED)
				if (firstNonCompletedIndex === -1) return true
				expect(outputTasks.slice(firstNonCompletedIndex).every(task => task.status !== TASK_STATUSES.COMPLETED)).toBe(true)
			}
		))
	})

	test('len(output) <= len(input) and len(output) == len(input) if no filter or no attribute', () => {
		fc.assert(fc.property(
			globalTasksArbitrary,
			sortingAlgoArbitrary,
			searchArbitrary,
			(globalTasks, sortingAlgo, search) => {
				const outputTasks = sortFilterPipe({ globalTasks, sortingAlgo, search })
				const lenOutput = outputTasks.length
				const lenInput = globalTasks.tasks.length
				expect(lenOutput).toBeLessThanOrEqual(lenInput) // Always true
				if (search === '') {
					expect(lenOutput).toBe(lenInput) // True if there is no search input
				}
			}
		))
	})

	test('completed tasks and non completed tasks are sorted based on the given sort function', () => {
		fc.assert(fc.property(
			globalTasksArbitrary,
			sortingAlgoArbitrary,
			searchArbitrary,
			(globalTasks, sortingAlgo, search) => {
				const outputTasks = sortFilterPipe({ globalTasks, sortingAlgo, search })
				const completedTasks = outputTasks.filter(task => task.status === TASK_STATUSES.COMPLETED)
				const nonCompletedTasks = outputTasks.filter(task => task.status !== TASK_STATUSES.COMPLETED)
				const sortedCompletedTasks = SORTING_METHODS[sortingAlgo](completedTasks)
				const sortedNonCompletedTasks = SORTING_METHODS[sortingAlgo](nonCompletedTasks)
				expect(completedTasks).toEqual(sortedCompletedTasks)
				expect(nonCompletedTasks).toEqual(sortedNonCompletedTasks)
			}
		))
	})

	test('only tasks that contain the specified search attribute (to lower-case and trimmed) exist', () => {
		fc.assert(fc.property(
			globalTasksArbitrary,
			sortingAlgoArbitrary,
			searchArbitrary,
			(globalTasks, sortingAlgo, search) => {
				const outputTasks = sortFilterPipe({ globalTasks, sortingAlgo, search })
				if (search === '') {
					expect(outputTasks.length).toBe(globalTasks.tasks.length)
				} else {
					expect(outputTasks.every(task => task.task.toLowerCase().trim().includes(search.toLowerCase().trim()))).toBe(true)
				}
			}
		))
	})

})

