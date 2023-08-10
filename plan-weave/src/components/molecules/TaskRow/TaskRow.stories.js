import TaskRow from './TaskRow'

export default {
	title: 'Molecules/TaskRow',
	component: TaskRow,
	argTypes: {
		variant: { control: 'text' },
	},
}

const Template = args => <TaskRow {...args} />

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	waste: '1 hour'
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	waste: '1 hour'
}