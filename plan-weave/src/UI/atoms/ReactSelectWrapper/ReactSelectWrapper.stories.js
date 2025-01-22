import ReactSelectWrapper from './ReactSelectWrapper'

const ReactSelectWrapperStories = {
	title: 'Atoms/input/ReactSelectWrapper',
	component: ReactSelectWrapper,
	argTypes: {
		variant: { control: 'text' },
	},
}

const Template = args => {
	return (
		<ReactSelectWrapper {...args} />
	)
}

const options = [
	{ value: 'predecessor1', label: 'Predecessor 1' },
	{ value: 'predecessor2', label: 'Predecessor 2' },
]

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	options
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	options,
	initialSelectedPredecessors: options
}

export default ReactSelectWrapperStories