import TimePickerWrapper from './TimePickerWrapper'

export default {
  title: 'Atoms/Pickers/TimePicker',
  component: TimePickerWrapper,
  argTypes: {
    variant: { control: 'text' },
    defaultTime: { control: 'text'}
  }
}

const Template = args => <TimePickerWrapper {...args} />

export const light = Template.bind({})
light.args = {
  variant: 'light'
}

export const dark = Template.bind({})
light.args = {
  variant: 'dark'
}