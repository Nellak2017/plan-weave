import TaskEditor from './TaskEditor'
// redux stuff
import store from '../../../redux/store'
import { Provider } from 'react-redux'
import { toast } from 'react-toastify'

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
	{ name: 'name', listener: () => toast.info('Name Sorting applied. Tasks now appear alphabetically.'), algorithm: 'name' },
	{ name: 'time created', listener: () => toast.info('Time Sorting applied. Tasks now appear in chronological order.'), algorithm: 'timestamp' },
	{ name: 'ETA', listener: () => toast.info('ETA Sorting applied. Tasks now appear in ETA order.'), algorithm: 'eta' },
	{ name: 'default', listener: () => toast.info('Default Sorting applied. Tasks now appear as they do in the database.'), algorithm: '' },
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