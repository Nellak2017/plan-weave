import TaskRow from './TaskRow'
import { DragDropContext } from 'react-beautiful-dnd'
import StrictModeDroppable from '../../atoms/StrictModeDroppable/StrictModeDroppable.js' // Wrapper for the unmaintained Droppable component
// redux stuff
import store from '../../../redux/store'
import { Provider } from 'react-redux'
import { DEFAULT_SIMPLE_TASKS } from '../../utils/constants.js'

const TaskRowStories = {
	title: 'Molecules/TaskRow',
	component: TaskRow,
	argTypes: {
		variant: { control: 'text' },
		highlight: { control: 'text'},
	},
}

// dummy store included to avoid errors
const TemplateWithProvider = args => {
	return (
		<Provider store={store}>
			<Template {...args} />
		</Provider>
	)
}

// dummy context included to avoid errors
const Template = args =>
	<DragDropContext onDragEnd={() => { console.log('dummy context') }}>
		<table style={{borderCollapse: 'collapse'}}>
			<thead></thead>
			<StrictModeDroppable droppableId="taskTable" type="TASK">
				{(provided) => (
					<tbody ref={provided.innerRef} {...provided.droppableProps}>
						<TaskRow {...args} index={0} />
						{provided.placeholder}
					</tbody>
				)}
			</StrictModeDroppable>
		</table>
	</DragDropContext>

// Using dummy context, it may not correctly update or be interactive.
export const Light = TemplateWithProvider.bind({})
Light.args = {
	variant: 'light',
	waste: '1 hour',
	taskObject: DEFAULT_SIMPLE_TASKS[0]
}

export const Dark = TemplateWithProvider.bind({})
Dark.args = {
	variant: 'dark',
	waste: '1 hour',
	taskObject: DEFAULT_SIMPLE_TASKS[1],
	highlight: 'selected'
}

export default TaskRowStories