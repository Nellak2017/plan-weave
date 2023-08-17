// This story uses Redux to get the task information

import TaskTable from './TaskTable'
import { SIMPLE_TASK_HEADERS } from '../../utils/constants.js'
// redux stuff
import store from '../../../redux/store'
import { Provider, useSelector } from 'react-redux'

export default {
  title: 'Molecules/TaskTable',
  component: TaskTable,
  argTypes: {
    variant: { control: 'text' },
  },
}


const TemplateWithProvider = args => {
  return (
    <Provider store={store}>
      <Template {...args} />
    </Provider>
  )
}

const Template = args => {
  const tasks = useSelector(state => state.tasks.tasks)
  return <TaskTable {...args} />
}

export const light = TemplateWithProvider.bind({})
light.args = {
  variant: 'light',
  headerLabels: SIMPLE_TASK_HEADERS,
  /*
  tasks: [
    { task: 'Example Task 1', waste: 2, ttc: 5, eta: '15:30', id: 1 },
    { task: 'Example Task 2', waste: 1, ttc: 3, eta: '18:30', id: 2 },
    // Add more tasks here
  ],
  */
}

export const dark = TemplateWithProvider.bind({})
dark.args = {
  variant: 'dark',
  headerLabels: SIMPLE_TASK_HEADERS,
  tasks: [
    { status: 'completed', waste: 2, ttc: 5, eta: '15:30', id: 1 },
    { status: 'incomplete', task: 'Example Task 2', waste: 1, ttc: 2, eta: '18:30', id: 2 },
    { status: 'waiting', waste: 2, ttc: 5, eta: '23:30', id: 3 },
    { status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 4 },
    { status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 5 },
    // Add more tasks here
  ],
}