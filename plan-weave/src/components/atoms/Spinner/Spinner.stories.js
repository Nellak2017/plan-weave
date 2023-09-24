import Spinner from './Spinner'

export default {
	title: 'Atoms/Spinner',
	component: Spinner,
	argTypes: {
		width: { control: 'number' },
	},
}

const Template = args => <Spinner {...args} />

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	width: 200
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
}