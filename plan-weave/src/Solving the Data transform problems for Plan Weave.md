# Solving the Data transform problems for Plan Weave

## Filter Fields Problem

1. We need the user to be able to select the fields they actually use such as simple task or full task.

### Filter Fields Solution

- [X] In redux, store if it is full task or simple task
- [X] Assign a listener to the full task/simple task button to toggle between them by sending an action to it in redux
- [X] render simple task component if it is simple task or full task if it is full task
- [ ] UI Property Test for this

// NOTE: This only changes if the user presses the change full task button, it is independent of all other pipes

## Order Problem

1. We need the user to be able to select the appropriate sorting algorithm and it to be sorted properly

2. We need the user to be able to always see completed tasks on top of incomplete ones

3. We need the user to be able to filter tasks using the search feature and it to show all available tasks matching that description, even if it is on another page

4. We need the user to be able to filter out all pages except the one they are on and for invalid pages to be inaccessible

### Order Problem solution

#### Observations
- We need this particular order of data transformation to happen or else it will fail
	sort -> completed on top -> search filter -> filter pages

#### Order Problem solution

- [X] sort and completed on top
- [X] search filter
- [X] filter pages
- [X] pipe(sort, completed on top, search filter, filter pages)
- [X] redux store variables
- [ ] UI Property test for this

#### Implementations
How do we implement the sort?

- Store sort method in redux
- Let user change it with a drop down or by some other interface
- For each sorting method, we define a new sorting function that is tested

How do we implement completed on top?

- sort(completed slice) + sort(incomplete slice)

How do we implement search filter?

- Store search query in redux
- Let user change it with input
- filter(existingReduxTasks, search query)

How do we implement pages?

- Store page number and tasks per page in redux
- Let user change it with input and buttons
- Define functions to ensure that the number is always in the correct range given the tasks per page and number of redux tasks
- Filter out all tasks that do not belong to the current page we are on

#### Code

##### Units
// Define Pipe helper function
const pipe = (...f) => x => f.reduce((acc, fn) => fn(acc), x)

// Define custom sort functions with signature t => t

// sort -> completed on top
const completedOnTopSorted = (sort = t => t.slice()) => (reduxTasks) => {
	const completedTasks = sort([...reduxTasks].filter(task => task?.status === TASK_STATUSES.COMPLETED))
	const remainingTasks = sort([...reduxTasks].filter(task => task?.status !== TASK_STATUSES.COMPLETED))
	return [...completedTasks, ...remainingTasks]
}

// search filter
const filterTasks = (filter, attribute = 'task') => (reduxTasks) => {
	return (!filter || !attribute)
		? reduxTasks
		: reduxTasks.filter(task => task[attribute]?.toLowerCase()?.includes(filter?.toLowerCase()))
}

// filter pages
const calculateRange = (tasksPerPage, page) => (isInt(tasksPerPage) && isInt(page))
	? [(page - 1) * tasksPerPage + 1, page * tasksPerPage]
	: [0, undefined] // Used for keeping input in proper range and displaying correctly

const filterPages = (pageNumber, tasksPerPage) => (reduxTasks) => {
	const startIndex = pageNumber * tasksPerPage // 0 * 10 = 0 ; 1 * 10 = 10; ...
	const endIndex = ((pageNumber + 1) * tasksPerPage) - 1 // (1 * 10) - 1 = 9
	return reduxTasks.filter((_, i) => i >= startIndex && i <=  endIndex) // keep tasks in that range and ignore all else

	reduxTasks.slice(startIndex, endIndex)
} // Used to actually filter pages from redux Tasks

##### Pipeline
// sort -> completed on top -> search filter -> filter pages

// NOTE: Assume the variables are known and sorting method is defined as sort, filter as filter, tasksPerPage as tasksPerPage, and pageNumber as pageNumber
pipe(
	completedOnTopSorted(sort),
	filterTasks(filter),
	filterPages(pageNumber, tasksPerPage),
)(reduxTasks)

// NOTE: This pipe should get the redux tasks in the proper order after initialization and one of the following events: (change sort method, complete/incomplete task, search change, page change, tasks per page change)
// It is independent of all other pipes

## Field / Time Problem

1. We need tasks to automatically be highlighted correctly based on their status or time
	- Completed
	- Inconsistent
	- Waiting
	- Not Today (grayed out)

2. We need to accurately calculate waste for all tasks

3. We need to accurately calculate efficiency

4. We need tasks to 'wrap' into the next day
	- task waste represents the distance away from the est completion time and it will reset daily (daily meaning after it exceeds the end date)
		Ex: 
			start = 5/10/2024, 12:00, end = 5/11/2024, 03:00, first task eta = 1 hour
			waste at 5/10/2024, 12:00 = -1
			waste at 5/10/2024, 13:00 = 0
			waste at 5/11/2024, 03:00 = 14
			waste at 5/11/2024, 04:00 = -8 // start - current time
			
	- efficiency will be bounded to be in the day as well
	- time left will also wrap after the end period
	- ? Will task data wrap as well after the end date ?



























