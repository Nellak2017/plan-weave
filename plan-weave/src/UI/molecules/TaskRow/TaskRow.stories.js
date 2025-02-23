import { TaskRowDefault } from './TaskRow'
import store from '../../../Application/store.js'
import { Provider } from 'react-redux'

const TaskRowStories = {
	title: 'Molecules/TaskRow',
	component: TaskRowDefault,
	argTypes: { variant: { control: 'text' }, highlight: { control: 'text' }, },
}
const TemplateWithProvider = args => (<Provider store={store}><Template {...args} /></Provider>)
const Template = args => (
	<table style={{ borderCollapse: 'collapse' }}>
		<thead></thead>
		<tbody><TaskRowDefault currentTime={new Date()} {...args} /></tbody>
	</table>
)
export const Light = TemplateWithProvider.bind({})
Light.args = {}
export const Dark = TemplateWithProvider.bind({})
Dark.args = {}
export default TaskRowStories