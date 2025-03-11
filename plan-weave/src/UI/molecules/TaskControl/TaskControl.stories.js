import TaskControl from './TaskControl'
import store from '../../../Application/store.js'
import { Provider } from 'react-redux'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const TaskControlStories = {
  title: 'Molecules/TaskControl',
  component: TaskControl,
  argTypes: { maxwidth: { control: 'number' }, maxwidthsearch: { control: 'number' }, color: { control: 'text' } },
}
const LightTemplateWithProvider = args => <MUIThemeProvider theme={lightTheme}><Provider store={store}><Template {...args} /></Provider></MUIThemeProvider>
const DarkTemplateWithProvider = args => <MUIThemeProvider theme={theme}><Provider store={store}><Template {...args} /></Provider></MUIThemeProvider>
const Template = args => <TaskControl {...args} />
export const Light = LightTemplateWithProvider.bind({})
Light.args = {}
export const Dark = DarkTemplateWithProvider.bind({})
Dark.args = {}
export default TaskControlStories