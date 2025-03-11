import { TaskTableDefault } from './TaskTable'
import { DEFAULT_SIMPLE_TASKS, FULL_TASK_HEADERS } from '../../../Core/utils/constants.js'
import store from '../../../Application/store.js'
import { Provider } from 'react-redux'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const TaskTableStories = { title: 'Molecules/TaskTable', component: TaskTableDefault, argTypes: {}, }
const DarkTemplateWithProvider = args => <MUIThemeProvider theme={theme}><Provider store={store}><Template {...args} /></Provider></MUIThemeProvider>
const LightTemplateWithProvider = args => <MUIThemeProvider theme={lightTheme}><Provider store={store}><Template {...args} /></Provider></MUIThemeProvider>
const Template = args => <TaskTableDefault {...args} />
const darkModeTasks = [
  { status: 'completed', task: 'Example Task 1', waste: 2, ttc: 5, eta: '15:30', id: 1 },
  { status: 'incomplete', task: 'Example Task 2', waste: 1, ttc: 2, eta: '18:30', id: 2 },
  { status: 'waiting', task: 'Example Task 3', waste: 2, ttc: 5, eta: '23:30', id: 3 },
  { status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 4 },
  { status: 'inconsistent', task: 'Example Task 2', waste: 1, ttc: 2, eta: '01:30', id: 5 },
]
export const Light = LightTemplateWithProvider.bind({})
Light.args = { currentTime: new Date(), customHook: () => ({ childState: { renderNumber: 6, labels: FULL_TASK_HEADERS.slice(0, 4), taskList: DEFAULT_SIMPLE_TASKS } }) }
export const Dark = DarkTemplateWithProvider.bind({})
Dark.args = { currentTime: new Date(), customHook: () => ({ childState: { renderNumber: 12, labels: FULL_TASK_HEADERS, taskList: darkModeTasks } }) }
export default TaskTableStories