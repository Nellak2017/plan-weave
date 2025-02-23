import DateTimePickerWrapper from './DateTimePickerWrapper'

const DateTimePickerWrapperStories = {
	title: 'Atoms/Pickers/DateTimePicker',
	component: DateTimePickerWrapper,
	argTypes: {},
}
const Template = args => <DateTimePickerWrapper {...args} />
export const Light = Template.bind({})
Light.args = { state: { variant: 'light' }, }
export const Dark = Template.bind({})
Dark.args = { state: { variant: 'dark' }, }
export default DateTimePickerWrapperStories