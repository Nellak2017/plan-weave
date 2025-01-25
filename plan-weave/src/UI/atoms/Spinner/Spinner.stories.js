import Spinner from './Spinner'

const SpinnerStories = {
	title: 'Atoms/Spinner',
	component: Spinner,
	argTypes: {
		width: { control: 'number' },
	},
}

const Template = args => <Spinner {...args} />

export const Light = Template.bind({})
Light.args = { width: 200}

export const Dark = Template.bind({})
Dark.args = {}

export default SpinnerStories