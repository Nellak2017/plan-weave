import { TaskInput } from './TaskInput'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const TaskInputStories = {
	title: 'Atoms/input/TaskInput',
	component: TaskInput,
	argTypes: { maxwidth: { control: 'number' }, initialValue: { control: 'text' }, },
}
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><TaskInput {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><TaskInput {...args} /></MUIThemeProvider>
const options = ['Task 1', 'Task 2', 'Task 3']
export const Light = LightTemplate.bind({})
Light.args = { maxwidth: 200, options }
export const Dark = DarkTemplate.bind({})
Dark.args = { maxwidth: 200, initialValue: 'Hello', options }
export default TaskInputStories