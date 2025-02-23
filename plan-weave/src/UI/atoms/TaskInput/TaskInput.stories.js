import { TaskInput } from './TaskInput'

const TaskInputStories = {
	title: 'Atoms/input/TaskInput',
	component: TaskInput,
	argTypes: { maxwidth: { control: 'number' }, initialValue: { control: 'text' }, variant: { control: 'text' } },
}
const Template = args => <TaskInput {...args} />
const options = ['Task 1', 'Task 2', 'Task 3']
export const Light = Template.bind({})
Light.args = { variant: 'light', maxwidth: 200, options }
export const Dark = Template.bind({})
Dark.args = { variant: 'dark', maxwidth: 200, initialValue: 'Hello', options }
export default TaskInputStories