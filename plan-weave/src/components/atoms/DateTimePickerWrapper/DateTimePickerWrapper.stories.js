import DateTimePickerWrapper from './DateTimePickerWrapper'

const DateTimePickerWrapperStories =  {
	title: 'Atoms/Pickers/DateTimePicker',
	component: DateTimePickerWrapper,
	argTypes: {
		variant: { control: 'text' },
	},
}

const Template = args => {
	return (
		<DateTimePickerWrapper {...args} />
	)
}

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
}

export default DateTimePickerWrapperStories