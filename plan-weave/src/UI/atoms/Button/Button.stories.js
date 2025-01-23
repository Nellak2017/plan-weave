import Button from './Button.js'

const ButtonStory = {
	title: 'Atoms/Buttons/Button',
	component: Button,
	argTypes: {
		variant: { control: 'text' },
		color: { control: 'text' },
		onClick: { action: 'onClick works' },
	}
}

const Template = args => <Button {...args} />

export const StandardButton = Template.bind({})
StandardButton.args = {
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
export default ButtonStory