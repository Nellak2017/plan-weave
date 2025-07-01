import TaskEditor from './TaskEditor'
import store from '../../../Application/store.js'
import { Provider } from 'react-redux'
import { toast } from 'react-toastify'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const TaskEditorStories = {
	title: 'Organisms/TaskEditor',
	component: TaskEditor,
	argTypes: { maxwidth: { control: 'number' }, sortingAlgorithm: { control: 'text' }, useReduxData: { control: 'boolean' }, },
}
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><Provider store={store}><TaskEditor {...args} /></Provider></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><Provider store={store}><TaskEditor {...args} /></Provider></MUIThemeProvider>
const options = [
	{ name: 'name', listener: () => toast.info('Name Sorting applied. Tasks now appear alphabetically.'), algorithm: 'name' },
	{ name: 'ETA', listener: () => toast.info('ETA Sorting applied. Tasks now appear in ETA order.'), algorithm: 'eta' },
	{ name: 'default', listener: () => toast.info('Default Sorting applied. Tasks now appear as they do in the database.'), algorithm: '' },
]
export const Light = LightTemplate.bind({})
Light.args = { sortingAlgorithm: '', options }
export const Dark = DarkTemplate.bind({})
Dark.args = { sortingAlgorithm: 'default', options }
export default TaskEditorStories