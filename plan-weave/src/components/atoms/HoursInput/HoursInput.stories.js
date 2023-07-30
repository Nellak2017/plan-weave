import HoursInput from './HoursInput'

export default {
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


export const light = Template.bind({})
light.args = {
  	text: 'Hours',
	variant: 'light',
}

export const dark = Template.bind({})
dark.args = {
  	text: 'Hours',
	variant: 'dark',
	placeholder: 'Time',
	initialValue: 2
}