import React from 'react'
import EllipsesButton from './EllipsesButton'

const EllipsesButtonStories = {
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
  variant: 'dark'
}

export default EllipsesButtonStories