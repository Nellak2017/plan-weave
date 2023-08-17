import TaskEditor from './TaskEditor'
// redux stuff
import store from '../../../redux/store'
import { Provider, useSelector } from 'react-redux'

export default {
	title: 'Organisms/TaskEditor',
	component: TaskEditor,
	argTypes: {
		variant: { control: 'text' },
		maxwidth: { control: 'number' },
		sortingAlgorithm: { control: 'text' },
		useReduxData: { control: 'boolean' },
	},
}

const Template = args => {
	return (
		<Provider store={store}>
			<TaskEditor {...args} />
		</Provider>
	)
}

const options = [
	{ name: 'name', listener: () => console.log('Option 1 clicked'), algorithm: 'name' },
	{ name: 'time created', listener: () => console.log('Option 2 clicked'), algorithm: 'timestamp' },
	{ name: 'default', listener: () => console.log('Option 3 clicked'), algorithm: '' },
]

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	sortingAlgorithm: '',
	options
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	sortingAlgorithm: 'timestamp',
	options
}