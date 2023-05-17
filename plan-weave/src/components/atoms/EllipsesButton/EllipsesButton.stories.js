import React from 'react'
import EllipsesButton from './EllipsesButton'

export default {
  title: 'Atoms/Buttons/EllipsesButton',
  component: EllipsesButton,
  argTypes: {
    variant: { control: 'text' },
  },
}

const Template = (args) => <EllipsesButton {...args} />

export const Light = Template.bind({})
Light.args = {
  variant: 'light',
}

export const Dark = Template.bind({})
Dark.args = {
  variant: 'dark',
}