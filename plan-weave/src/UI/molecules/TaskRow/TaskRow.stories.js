import { TaskRowDefault } from './TaskRow'
import store from '../../../Application/store.js'
import { Provider } from 'react-redux'

const TaskRowStories = {
	title: 'Molecules/TaskRow',
	component: TaskRowDefault,
	argTypes: { // TODO: Figure out how to make these controls actually work!
		highlight: { control: 'select', options: ['', 'old', 'selected'], },
		status: { control: 'select', options: ['completed', 'incomplete', 'waiting', 'inconsistent'], },
		variant: { control: 'select', options: ['dark', 'light'] }
	},
}
const TemplateWithProvider = args => (<Provider store={store}><Template {...args} /></Provider>)
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
export const Light = TemplateWithProvider.bind({})
Light.args = { customHook: { status: 'completed', highlight: 'selected' }}
export const Dark = TemplateWithProvider.bind({})
Dark.args = {}
export default TaskRowStories