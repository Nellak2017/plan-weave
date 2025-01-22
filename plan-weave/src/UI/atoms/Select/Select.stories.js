import Select from './Select'

const SelectStories = {
	title: 'Atoms/input/Select',
	component: Select,
	argTypes: {
		variant: { control: 'text' },
	},
}

const Template = args => {
	return (
		<Select {...args} />
	)
}

const options = [
	'Option 1',
	'Option 2',
	'Option 3',
]

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	state: {
		options
	}
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	state: {
		options,
		minLength: 2,
		maxLength: 3,
	}
}

export default SelectStories