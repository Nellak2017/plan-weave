import React from 'react'
import TableHeader from './TableHeader.js'

export default {
  title: 'Atoms/Table Elements/TableHeader',
  component: TableHeader,
  argTypes: {
    variant: { control: 'text' },
    label: { control: 'text'}
  }
}

const Template = args => <TableHeader {...args} />

export const light = Template.bind({})
light.args = {
  labels: ['Task', 'Waste', 'Eta', 'TTC'],
  variant: 'light'
}

export const dark = Template.bind({})
dark.args = {
  labels: ['Task', 'Waste', 'Eta', 'TTC'],
  variant: 'dark'
}