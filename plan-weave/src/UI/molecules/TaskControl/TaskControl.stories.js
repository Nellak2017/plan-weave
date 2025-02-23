import TaskControl from './TaskControl'
import store from '../../../Application/store.js'
import { Provider } from 'react-redux'

const TaskControlStories = {
  title: 'Molecules/TaskControl',
  component: TaskControl,
  argTypes: { variant: { control: 'text' }, maxwidth: { control: 'number' }, maxwidthsearch: { control: 'number' }, color: { control: 'text' } },
}
const TemplateWithProvider = args => <Provider store={store}><Template {...args} /></Provider>
const Template = args => <TaskControl {...args} />
export const Light = TemplateWithProvider.bind({})
Light.args = { customHook: () => ({ childState: { variant: 'light' } })}
export const Dark = TemplateWithProvider.bind({})
Dark.args = { }
export default TaskControlStories