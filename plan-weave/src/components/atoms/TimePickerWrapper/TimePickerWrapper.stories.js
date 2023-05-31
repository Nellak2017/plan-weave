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

export const Light = Template.bind({})
Light.args = {
  variant: 'light'
}

export const Dark = Template.bind({})
Dark.args = {
  variant: 'dark'
}