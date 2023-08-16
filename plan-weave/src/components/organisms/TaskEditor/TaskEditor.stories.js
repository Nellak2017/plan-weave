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

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	sortingAlgorithm: '',
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	sortingAlgorithm: 'timestamp',
}