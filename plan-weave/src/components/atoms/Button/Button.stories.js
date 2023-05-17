import Button from './Button.js'

export default {
	title: 'Atoms/Buttons/Button',
	component: Button,
	argTypes: {
		variant: { control: 'text' },
		size: { control: 'text' },
		color: { control: 'text' },
		onClick: { action: 'onClick works' },
	}
}

const Template = args => <Button {...args} />

export const StandardButton = Template.bind({})
StandardButton.args = {
	variant: 'standardButton',
	children: 'Button'
}

export const NewTaskButton = Template.bind({})
NewTaskButton.args = {
	variant: 'newTask',
	children: '+ New Task'
}

export const DeleteButton = Template.bind({})
DeleteButton.args = {
	variant: 'delete',
	children: 'Delete'
}