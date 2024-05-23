import HoursInput from './HoursInput'

const HoursInputStories = {
  title: 'Atoms/input/HoursInput',
  component: HoursInput,
  argTypes: {
	placeholder: { control: 'text' },
    text: { control: 'text' },
	variant: { control: 'text' },
    color: { control: 'text' },
    maxwidth: { control: 'number' },
	initialValue: { control: 'number'}
  },
}

const Template = args => <HoursInput {...args} />


export const Light = Template.bind({})
Light.args = {
  	text: 'Hours',
	variant: 'light',
}

export const Dark = Template.bind({})
Dark.args = {
  	text: 'Hours',
	variant: 'dark',
	placeholder: 'Time',
	initialValue: 2
}

export default HoursInputStories