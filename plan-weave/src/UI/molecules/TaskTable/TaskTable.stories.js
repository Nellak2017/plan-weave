// This story uses Redux to get the task information

import TaskTable from './TaskTable'
import { SIMPLE_TASK_HEADERS } from '../../utils/constants.js'
// redux stuff
import store from '../../../redux/store'
import { Provider } from 'react-redux'

const TaskTableStories = {
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

const Template = args => <TaskTable {...args} />


export const Light = TemplateWithProvider.bind({})
Light.args = {
  variant: 'light',
  headerLabels: SIMPLE_TASK_HEADERS,
}

export const Dark = TemplateWithProvider.bind({})
Dark.args = {
  variant: 'dark',
  headerLabels: SIMPLE_TASK_HEADERS,
  tasks: [
    { status: 'completed', task: 'Example Task 1', waste: 2, ttc: 5, eta: '15:30', id: 1 },
    { status: 'incomplete', task: 'Example Task 2', waste: 1, ttc: 2, eta: '18:30', id: 2 },
    { status: 'waiting', task: 'Example Task 3', waste: 2, ttc: 5, eta: '23:30', id: 3 },
    { status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 4 },
    { status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 5 },
    // Add more tasks here
  ],
}

export default TaskTableStories