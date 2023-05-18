import TaskInput from './TaskInput'

export default {
	title: 'Atoms/input/TaskInput',
	component: TaskInput,
	argTypes: {
		maxwidth: { control: 'number' },
	},
}

const Template = args => <TaskInput {...args} />

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	maxwidth: 200,
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	maxwidth: 200,
}
