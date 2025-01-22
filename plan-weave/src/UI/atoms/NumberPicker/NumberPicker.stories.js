import NumberPicker from './NumberPicker'

const NumberPickerStories = {
	title: 'Atoms/Pickers/NumberPicker',
	component: NumberPicker,
	argTypes: {
		variant: { control: 'text' },
	},
}

const Template = args => <NumberPicker {...args}/>

const options = [10, 20, 30]

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	options: options
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	options: options
}

export default NumberPickerStories