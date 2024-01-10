import DeleteModal from './DeleteModal'

const DeleteModalStories = {
	title: 'Atoms/DeleteModal',
	component: DeleteModal,
	argTypes: {
		variant: { control: 'text' },
	},
}

const Template = args => <DeleteModal {...args} />


export const Light = Template.bind({})
Light.args = {
}

export const Dark = Template.bind({})
Dark.args = {
}

export default DeleteModalStories