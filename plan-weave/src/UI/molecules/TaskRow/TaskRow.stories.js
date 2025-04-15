import { TaskRowDefault } from './TaskRow'
import store from '../../../Application/store.js'
import { Provider } from 'react-redux'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const TaskRowStories = {
	title: 'Molecules/TaskRow',
	component: TaskRowDefault,
	argTypes: {
		highlight: { control: 'select', options: ['', 'old', 'selected'], },
		status: { control: 'select', options: ['completed', 'incomplete', 'waiting', 'inconsistent'], },
	},
}
const DarkTemplateWithProvider = args => (<MUIThemeProvider theme={theme}><Provider store={store}><Template {...args} /></Provider></MUIThemeProvider>)
const LightTemplateWithProvider = args => (<MUIThemeProvider theme={lightTheme}><Provider store={store}><Template {...args} /></Provider></MUIThemeProvider>)
const Template = ({ customHook, ...args }) => (
	<table style={{ borderCollapse: 'collapse' }}>
		<thead></thead>
		<tbody>
			{typeof customHook === 'function' || !customHook /*Added so we can control it in storybook easier*/
				? (<TaskRowDefault currentTime={new Date()} {...args} />)
				: (<TaskRowDefault currentTime={new Date()} customHook={() => customHook} {...args} />)
			}
		</tbody>
	</table>
)
export const Light = LightTemplateWithProvider.bind({})
Light.args = { customHook: { status: 'completed', highlight: 'selected' }}
export const Dark = DarkTemplateWithProvider.bind({})
Dark.args = {customHook: { status: 'waiting', }}
export default TaskRowStories