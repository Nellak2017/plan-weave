import OptionPicker from './OptionPicker'

const ReactSelectWrapperStories = {
	title: 'Atoms/Pickers/OptionPicker',
	component: OptionPicker,
	argTypes: { variant: { control: 'text' },},
}
const Template = args => <OptionPicker {...args} />
const options = [
	{ value: 'predecessor1', label: 'Predecessor 1' },
	{ value: 'predecessor2', label: 'Predecessor 2' },
]
export const Light = Template.bind({})
Light.args = {
	state: { variant: 'light', options },
}
export const Dark = Template.bind({})
Dark.args = {
	state: { 
		variant: 'dark',
		options,
	},
	services: {
		onChange: selectedOptions => console.log(selectedOptions)
	},
	defaultValue: options,
}
export default ReactSelectWrapperStories