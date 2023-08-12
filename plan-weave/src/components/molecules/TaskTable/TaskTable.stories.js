import React from 'react'
import TaskTable from './TaskTable' 

export default {
  title: 'Molecules/TaskTable',
  component: TaskTable,
  argTypes: {
	variant: { control: 'text' },
  },
}

const Template = args => <TaskTable {...args} />

export const light = Template.bind({})
light.args = {
  variant: 'light',
  headerLabels: ['Task', 'Waste', 'TTC', 'ETA'],
  tasks: [
    { task: 'Example Task 1', waste: 2, ttc: 5, eta: 3, id: 1 },
    { task: 'Example Task 2', waste: 1, ttc: 3, eta: 2, id: 2 },
    // Add more tasks here
  ],
}

export const dark = Template.bind({})
dark.args = {
  variant: 'dark',
  headerLabels: ['Task', 'Waste', 'TTC', 'ETA'],
  tasks: [
    { waste: 2, ttc: 5, eta: 3, id: 1 },
    { task: 'Example Task 2', waste: 1, ttc: 1, eta: 2, id: 2},
    // Add more tasks here
  ],
}